<?php

namespace App\Services\Facility;

use App\Models\Facility;
use App\Models\FacilityBooking;
use App\Repositories\Facility\FacilityRepositoryInterface;
use Carbon\Carbon;
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
        return $this->repository->createFacility($data);
    }

    public function updateFacility(int $id, array $data): bool
    {
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
            throw new \Exception('Facility is already booked for this time slot.');
        }

        // Calculate fee
        $data['total_fee'] = $this->calculateFee($data['facility_id'], $data['start_time'], $data['end_time']);

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
