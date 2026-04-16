<?php

namespace App\Repositories\Announcement;

use App\Enums\AnnouncementStatus;
use App\Models\Announcement;
use App\Repositories\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentAnnouncementRepository extends BaseRepository implements AnnouncementRepositoryInterface
{
    public function __construct(Announcement $model)
    {
        parent::__construct($model);
    }

    public function getPaginated(int $perPage = 10, array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->newQuery()->with('author');

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        return $query->latest()->paginate($perPage)->withQueryString();
    }

    public function getPublished(int $perPage = 10): LengthAwarePaginator
    {
        return $this->model->newQuery()
            ->where('status', AnnouncementStatus::PUBLISHED->value)
            ->with('author')
            ->latest()
            ->paginate($perPage);
    }
}
