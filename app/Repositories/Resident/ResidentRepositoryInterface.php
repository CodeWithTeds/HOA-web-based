<?php

namespace App\Repositories\Resident;

use App\Models\Resident;
use App\Repositories\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ResidentRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get paginated residents with optional filters.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginated(array $filters = [], int $perPage = 25): LengthAwarePaginator;

    /**
     * Get all active residents.
     *
     * @return Collection
     */
    public function getActiveResidents(): Collection;

    /**
     * Find a resident by email address.
     *
     * @param string $email
     * @return Resident|null
     */
    public function findByEmail(string $email): ?Resident;

    /**
     * Get residents by IDs.
     *
     * @param array $ids
     * @return Collection
     */
    public function getByIds(array $ids): Collection;
}
