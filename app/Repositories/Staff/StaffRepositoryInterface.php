<?php

namespace App\Repositories\Staff;

use App\Repositories\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

interface StaffRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get paginated staff with optional search.
     *
     * @param int $perPage
     * @param string|null $search
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginateWithSearch(int $perPage = 10, ?string $search = null): \Illuminate\Contracts\Pagination\LengthAwarePaginator;

    /**
     * Create a new staff member.
     *
     * @param array $attributes
     * @return Model
     */
    public function create(array $attributes): Model;
}
