<?php

namespace App\Repositories\Staff;

use App\Repositories\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

interface StaffRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Create a new staff member.
     *
     * @param array $attributes
     * @return Model
     */
    public function create(array $attributes): Model;
}
