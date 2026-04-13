<?php

namespace App\Services\Resident;

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
}
