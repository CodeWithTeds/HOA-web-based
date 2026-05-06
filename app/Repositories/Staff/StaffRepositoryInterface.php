<?php

namespace App\Repositories\Staff;

use App\Repositories\BaseRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;

interface StaffRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get paginated staff with optional search.
     *
     * @param int $perPage
     * @param string|null $search
     * @return LengthAwarePaginator
     */
    public function paginateWithSearch(int $perPage = 10, ?string $search = null): LengthAwarePaginator;

    /**
     * Create a new staff member.
     *
     * @param array $attributes
     * @return Model
     */
    public function create(array $attributes): Model;
}
