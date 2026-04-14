<?php

namespace App\Repositories\Resident;

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
     * Get residents by IDs.
     *
     * @param array $ids
     * @return Collection
     */
    public function getByIds(array $ids): Collection;
}
