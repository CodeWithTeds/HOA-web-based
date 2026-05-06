<?php

namespace App\Repositories\Resident;

use App\Enums\ResidentStatus;
use App\Models\Resident;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentResidentRepository extends BaseRepository implements ResidentRepositoryInterface
{
    /**
     * EloquentResidentRepository constructor.
     *
     * @param Resident $model
     */
    public function __construct(Resident $model)
    {
        parent::__construct($model);
    }

    /**
     * @inheritDoc
     */
    public function getPaginated(array $filters = [], int $perPage = 25): LengthAwarePaginator
    {
        $query = $this->model->newQuery();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('mobile_number', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['resident_type'])) {
            $query->where('resident_type', $filters['resident_type']);
        }

        return $query->latest()->paginate($perPage);
    }

    /**
     * @inheritDoc
     */
    public function getActiveResidents(): Collection
    {
        return $this->model->newQuery()
            ->where('status', ResidentStatus::ACTIVE->value)
            ->orderBy('last_name')
            ->get();
    }

    /**
     * @inheritDoc
     */
    public function findByEmail(string $email): ?Resident
    {
        return $this->model->newQuery()
            ->where('email', $email)
            ->first();
    }

    /**
     * @inheritDoc
     */
    public function getByIds(array $ids): Collection
    {
        return $this->model->newQuery()->whereIn('id', $ids)->get();
    }
}
