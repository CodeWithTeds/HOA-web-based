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

    public function getStaffById(string $id): Staff
    {
        $staff = $this->staffRepository->find($id);

        if (!$staff) {
            throw new \App\Exceptions\StaffNotFoundException("Staff member with ID {$id} could not be found.");
        }

        return $staff;
    }

    public function updateStaff(string $id, array $data): Staff
    {
        $staff = $this->getStaffById($id);

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
        ];

        $updated = $this->staffRepository->update($staff, $attributes);

        if (!$updated) {
            \Illuminate\Support\Facades\Log::error("Failed to update staff", ['staff_id' => $id]);
            throw new \Exception("Failed to update staff member.");
        }

        return $staff->refresh();
    }

    public function toggleStaffStatus(string $id): Staff
    {
        $staff = $this->getStaffById($id);
        
        $newStatus = $staff->status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        
        $updated = $this->staffRepository->update($staff, ['status' => $newStatus]);
        
        if (!$updated) {
            \Illuminate\Support\Facades\Log::error("Failed to toggle staff status", ['staff_id' => $id]);
            throw new \Exception("Failed to toggle staff status.");
        }
        
        return $staff->refresh();
    }

    public function deleteStaff(string $id): bool
    {
        $staff = $this->getStaffById($id);
        
        $deleted = $this->staffRepository->delete($staff);
        
        if (!$deleted) {
            \Illuminate\Support\Facades\Log::error("Failed to delete staff", ['staff_id' => $id]);
            throw new \Exception("Failed to delete staff member.");
        }
        
        return true;
    }
}
