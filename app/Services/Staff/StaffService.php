<?php

namespace App\Services\Staff;

use App\Exceptions\StaffNotFoundException;
use App\Models\Staff;
use App\Repositories\Staff\StaffRepositoryInterface;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class StaffService
{
    public function __construct(
        protected StaffRepositoryInterface $staffRepository
    ) {}

    public function getPaginatedStaff(int $perPage = 10, ?string $search = null)
    {
        return $this->staffRepository->paginateWithSearch($perPage, $search);
    }

    public function createStaff(array $data): Staff
    {
        // Handle photo upload if present
        $photoPath = null;
        if (isset($data['photo']) && $data['photo'] instanceof UploadedFile) {
            $photoPath = $this->handlePhotoUpload($data['photo']);
        }

        // Map camelCase DTO/Request fields to snake_case database columns
        $attributes = [
            'profile_picture' => $photoPath,
            'first_name' => $data['firstName'],
            'last_name' => $data['lastName'],
            'email' => $data['email'],
            'password' => $data['password'],
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
            throw new StaffNotFoundException("Staff member with ID {$id} could not be found.");
        }

        return $staff;
    }

    public function updateStaff(string $id, array $data): Staff
    {
        $staff = $this->getStaffById($id);

        $attributes = [
            'first_name' => $data['firstName'],
            'last_name' => $data['lastName'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'role' => $data['role'],
            'department' => $data['department'] ?? null,
            'status' => $data['status'],
            'hire_date' => $data['hireDate'],
        ];

        // Only update password if provided
        if (!empty($data['password'])) {
            $attributes['password'] = $data['password'];
        }

        // Handle photo upload if present
        if (isset($data['photo']) && $data['photo'] instanceof UploadedFile) {
            // Delete old photo if it exists
            if ($staff->profile_picture) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $staff->profile_picture));
            }
            $attributes['profile_picture'] = $this->handlePhotoUpload($data['photo']);
        }

        $updated = $this->staffRepository->update($staff, $attributes);

        if (!$updated) {
            Log::error("Failed to update staff", ['staff_id' => $id]);
            throw new Exception("Failed to update staff member.");
        }

        return $staff->refresh();
    }

    public function toggleStaffStatus(string $id): Staff
    {
        $staff = $this->getStaffById($id);
        
        $newStatus = $staff->status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        
        $updated = $this->staffRepository->update($staff, ['status' => $newStatus]);

        if (!$updated) {
            Log::error("Failed to toggle staff status", ['staff_id' => $id]);
            throw new Exception("Failed to toggle staff status.");
        }
        
        return $staff->refresh();
    }

    public function deleteStaff(string $id): bool
    {
        $staff = $this->getStaffById($id);
        
        // Delete photo if it exists
        if ($staff->profile_picture) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $staff->profile_picture));
        }

        $deleted = $this->staffRepository->delete($staff);

        if (!$deleted) {
            Log::error("Failed to delete staff", ['staff_id' => $id]);
            throw new Exception("Failed to delete staff member.");
        }
        
        return true;
    }

    /**
     * Handle photo upload and return public URL.
     */
    protected function handlePhotoUpload(UploadedFile $file): string
    {
        $path = $file->store('staff/avatars', 'public');
        return Storage::url($path);
    }
}
