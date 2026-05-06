<?php

namespace App\Repositories\Facility;

use App\Models\Facility;
use App\Models\FacilityBooking;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class EloquentFacilityRepository extends BaseRepository implements FacilityRepositoryInterface
{
    public function __construct(Facility $model)
    {
        parent::__construct($model);
    }

    public function getAllFacilities(): Collection
    {
        return $this->model->with('amenities')->get();
    }

    public function findFacilityById(int $id): ?Facility
    {
        return $this->model->with(['amenities', 'bookings'])->find($id);
    }

    public function createFacility(array $data): Facility
    {
        return $this->model->create($data);
    }

    public function updateFacility(int $id, array $data): bool
    {
        $facility = $this->model->find($id);
        return $facility ? $facility->update($data) : false;
    }

    public function deleteFacility(int $id): bool
    {
        return $this->model->destroy($id) > 0;
    }

    public function getAllBookings(): Collection
    {
        return FacilityBooking::with(['resident', 'facility', 'invoice'])->get();
    }

    public function createBooking(array $data): FacilityBooking
    {
        return FacilityBooking::create($data);
    }

    public function updateBooking(int $id, array $data): bool
    {
        $booking = FacilityBooking::find($id);
        return $booking ? $booking->update($data) : false;
    }

    public function findBookingById(int $id): ?FacilityBooking
    {
        return FacilityBooking::with(['resident', 'facility', 'invoice'])->find($id);
    }
}
