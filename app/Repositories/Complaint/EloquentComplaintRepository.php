<?php

namespace App\Repositories\Complaint;

use App\Models\Complaint;
use App\Repositories\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentComplaintRepository extends BaseRepository implements ComplaintRepositoryInterface
{
    public function __construct(Complaint $model)
    {
        parent::__construct($model);
    }

    public function getPaginated(int $perPage = 10, array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->newQuery()->with(['resident', 'assignedStaff']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        return $query->latest()->paginate($perPage)->withQueryString();
    }

    public function getByResident(int $residentId, int $perPage = 10): LengthAwarePaginator
    {
        return $this->model->newQuery()
            ->where('resident_id', $residentId)
            ->latest()
            ->paginate($perPage);
    }
}
