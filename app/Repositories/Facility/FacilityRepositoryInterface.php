<?php

namespace App\Repositories\Facility;

use App\Models\Facility;
use App\Models\FacilityBooking;
use Illuminate\Database\Eloquent\Collection;

interface FacilityRepositoryInterface
{
    public function getAllFacilities(): Collection;
    public function findFacilityById(int $id): ?Facility;
    public function createFacility(array $data): Facility;
    public function updateFacility(int $id, array $data): bool;
    public function deleteFacility(int $id): bool;

    public function getAllBookings(): Collection;
    public function createBooking(array $data): FacilityBooking;
    public function updateBooking(int $id, array $data): bool;
    public function findBookingById(int $id): ?FacilityBooking;
}
