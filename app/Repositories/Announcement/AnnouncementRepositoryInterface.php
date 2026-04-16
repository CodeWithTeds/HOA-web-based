<?php

namespace App\Repositories\Announcement;

use App\Repositories\BaseRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AnnouncementRepositoryInterface extends BaseRepositoryInterface
{
    public function getPaginated(int $perPage = 10, array $filters = []): LengthAwarePaginator;
    public function getPublished(int $perPage = 10): LengthAwarePaginator;
}
