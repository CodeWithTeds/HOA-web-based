<?php

namespace App\Repositories\Staff;

use App\Models\Staff;
use App\Repositories\BaseRepository;

class EloquentStaffRepository extends BaseRepository implements StaffRepositoryInterface
{
    public function __construct(Staff $model)
    {
        parent::__construct($model);
    }
}
