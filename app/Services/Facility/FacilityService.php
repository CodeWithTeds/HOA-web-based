<?php

namespace App\Services\Facility;

use App\Models\Facility;
use App\Models\FacilityBooking;
use App\Repositories\Facility\FacilityRepositoryInterface;
use Carbon\Carbon;
use Exception;
use App\Models\BillingPeriod;
use App\Models\Invoice;
use App\Enums\InvoiceStatus;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Collection;

class FacilityService
{
    public function __construct(
        protected FacilityRepositoryInterface $repository
    ) {}

    public function getFacilities(): Collection
    {
        return $this->repository->getAllFacilities();
    }

    public function getFacility(int $id): ?Facility
    {
        return $this->repository->findFacilityById($id);
    }

    public function createFacility(array $data): Facility
    {
        if (isset($data['image'])) {
            $path = $data['image']->store('facilities', 'public');
            $data['image_path'] = '/storage/' . $path;
            unset($data['image']);
        }
        return $this->repository->createFacility($data);
    }

    public function updateFacility(int $id, array $data): bool
    {
        if (isset($data['image'])) {
            $path = $data['image']->store('facilities', 'public');
            $data['image_path'] = '/storage/' . $path;
            unset($data['image']);
        }
        return $this->repository->updateFacility($id, $data);
    }

    public function deleteFacility(int $id): bool
    {
        return $this->repository->deleteFacility($id);
    }

    public function getBookings(): Collection
    {
        return $this->repository->getAllBookings();
    }

    public function createBooking(array $data): FacilityBooking
    {
        // Conflict prevention logic
        if ($this->hasConflict($data['facility_id'], $data['start_time'], $data['end_time'])) {
            throw new Exception('Facility is already booked for this time slot.');
        }

        // Calculate fee
        $data['total_fee'] = $this->calculateFee($data['facility_id'], $data['start_time'], $data['end_time']);

        // Create or find a billing period for facility bookings
        $period = BillingPeriod::latest()->first();
        if (!$period) {
            $period = BillingPeriod::create([
                'name' => 'Facility Bookings ' . date('Y'),
                'start_date' => Carbon::now()->startOfMonth(),
                'end_date' => Carbon::now()->endOfMonth(),
                'due_date' => Carbon::now()->endOfMonth(),
                'amount' => 0,
            ]);
        }

        // Create the invoice
        if ($data['total_fee'] > 0) {
            $invoice = Invoice::create([
                'resident_id' => $data['resident_id'],
                'billing_period_id' => $period->id,
                'invoice_number' => 'FB-' . date('Ym') . '-' . Str::upper(Str::random(6)),
                'total_amount' => $data['total_fee'],
                'paid_amount' => 0,
                'balance' => $data['total_fee'],
                'status' => InvoiceStatus::UNPAID->value,
                'due_date' => Carbon::now()->addDays(3),
            ]);

            $facility = $this->getFacility($data['facility_id']);

            $invoice->items()->create([
                'description' => 'Facility Booking - ' . $facility->name,
                'amount' => $data['total_fee'],
                'type' => 'Special',
            ]);

            $data['invoice_id'] = $invoice->id;
        }

        return $this->repository->createBooking($data);
    }

    public function hasConflict(int $facilityId, $startTime, $endTime): bool
    {
        return FacilityBooking::where('facility_id', $facilityId)
            ->where('status', 'Confirmed')
            ->where(function ($query) use ($startTime, $endTime) {
                $query->whereBetween('start_time', [$startTime, $endTime])
                    ->orWhereBetween('end_time', [$startTime, $endTime])
                    ->orWhere(function ($q) use ($startTime, $endTime) {
                        $q->where('start_time', '<=', $startTime)
                            ->where('end_time', '>=', $endTime);
                    });
            })
            ->exists();
    }

    public function calculateFee(int $facilityId, $startTime, $endTime): float
    {
        $facility = $this->repository->findFacilityById($facilityId);
        $start = Carbon::parse($startTime);
        $end = Carbon::parse($endTime);

        if ($facility->price_type === 'Hourly') {
            $hours = $start->diffInHours($end);
            return $hours * $facility->base_price;
        }

        return (float) $facility->base_price;
    }
}
