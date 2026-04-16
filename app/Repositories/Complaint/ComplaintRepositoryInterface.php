<?php

namespace App\Repositories\Complaint;

use App\Repositories\BaseRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ComplaintRepositoryInterface extends BaseRepositoryInterface
{
    public function getPaginated(int $perPage = 10, array $filters = []): LengthAwarePaginator;
    
    public function getByResident(int $residentId, int $perPage = 10): LengthAwarePaginator;
}
