<?php

namespace App\Services\Resident;

use App\Enums\ResidentStatus;
use App\Repositories\Resident\ResidentRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class ResidentService
{
    /**
     * ResidentService constructor.
     *
     * @param ResidentRepositoryInterface $residentRepository
     */
    public function __construct(
        protected ResidentRepositoryInterface $residentRepository
    ) {}

    /**
     * Get paginated residents.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getPaginatedResidents(array $filters): LengthAwarePaginator
    {
        return $this->residentRepository->getPaginated($filters, 25);
    }

    /**
     * Store a new resident.
     *
     * @param array $data
     * @return \App\Models\Resident
     */
    public function storeResident(array $data)
    {
        return $this->residentRepository->create($data);
    }

    /**
     * Find a resident by ID or model.
     *
     * @param mixed $resident
     * @return \App\Models\Resident
     */
    public function findResident(mixed $resident)
    {
        return is_object($resident) ? $resident : $this->residentRepository->find($resident);
    }

    /**
     * Update an existing resident.
     *
     * @param mixed $resident
     * @param array $data
     * @return bool
     */
    public function updateResident(mixed $resident, array $data): bool
    {
        $residentModel = $this->findResident($resident);
        return $this->residentRepository->update($residentModel, $data);
    }

    /**
     * Approve a resident whose registration is pending verification.
     *
     * @param mixed $resident
     * @return bool
     */
    public function approveResident(mixed $resident): bool
    {
        $residentModel = $this->findResident($resident);
        return $this->residentRepository->update($residentModel, [
            'status' => ResidentStatus::ACTIVE->value,
        ]);
    }

    /**
     * Delete a resident.
     *
     * @param mixed $resident
     * @return bool
     */
    public function deleteResident(mixed $resident): bool
    {
        $residentModel = $this->findResident($resident);
        return $this->residentRepository->delete($residentModel);
    }
}
