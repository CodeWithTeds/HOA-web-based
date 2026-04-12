<?php

namespace App\Services\Staff;

use App\Models\Staff;
use App\Repositories\Staff\StaffRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class StaffService
{
    public function __construct(
        protected StaffRepositoryInterface $staffRepository
    ) {}

    public function getPaginatedStaff(int $perPage = 10)
    {
        return $this->staffRepository->paginate($perPage);
    }

    public function createStaff(array $data): Staff
    {
        // Map camelCase DTO/Request fields to snake_case database columns
        $attributes = [
            'profile_picture' => $data['profilePicture'] ?? null,
            'first_name' => $data['firstName'],
            'last_name' => $data['lastName'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'role' => $data['role'],
            'department' => $data['department'] ?? null,
            'status' => $data['status'],
            'hire_date' => $data['hireDate'],
            'created_by' => Auth::id(),
        ];

        return $this->staffRepository->create($attributes);
    }
}
