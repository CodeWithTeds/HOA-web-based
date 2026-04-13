<?php

namespace App\Repositories\Resident;

use App\Repositories\BaseRepositoryInterface;
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
}
