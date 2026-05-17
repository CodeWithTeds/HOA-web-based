<?php

namespace App\Services\Staff;

use App\Enums\UserRole;
use App\Exceptions\StaffNotFoundException;
use App\Models\Staff;
use App\Repositories\Staff\StaffRepositoryInterface;
use App\Repositories\User\UserRepositoryInterface;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class StaffService
{
    public function __construct(
        protected StaffRepositoryInterface $staffRepository,
        protected UserRepositoryInterface $userRepository
    ) {}

    public function getPaginatedStaff(int $perPage = 10, ?string $search = null)
    {
        return $this->staffRepository->paginateWithSearch($perPage, $search);
    }

    public function createStaff(array $data): Staff
    {
        return DB::transaction(function () use ($data) {
            $staff = $this->staffRepository->create($this->staffAttributes($data));
            $this->createOrUpdateStaffLogin($staff, $data['password']);

            return $staff;
        });
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
        $previousEmail = $staff->email;

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

        DB::transaction(function () use ($staff, $attributes, $data, $previousEmail) {
            $updated = $this->staffRepository->update($staff, $attributes);

            if (!$updated) {
                Log::error("Failed to update staff", ['staff_id' => $staff->id]);
                throw new Exception("Failed to update staff member.");
            }

            $this->createOrUpdateStaffLogin($staff->refresh(), $data['password'] ?? null, $previousEmail);
        });

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

        $deleted = DB::transaction(function () use ($staff) {
            $loginUser = $this->userRepository->findByEmail($staff->email);
            $deleted = $this->staffRepository->delete($staff);

            if ($deleted && $loginUser?->role === UserRole::STAFF) {
                $this->userRepository->delete($loginUser);
            }

            return $deleted;
        });

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

    protected function staffAttributes(array $data): array
    {
        $photoPath = null;
        if (isset($data['photo']) && $data['photo'] instanceof UploadedFile) {
            $photoPath = $this->handlePhotoUpload($data['photo']);
        }

        return [
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
    }

    protected function createOrUpdateStaffLogin(Staff $staff, ?string $password = null, ?string $previousEmail = null): void
    {
        $loginUser = $this->userRepository->findByEmail($previousEmail ?? $staff->email);

        if ($loginUser && $loginUser->role !== UserRole::STAFF) {
            if ($previousEmail && $previousEmail !== $staff->email) {
                $loginUser = $this->userRepository->findByEmail($staff->email);
            }

            if ($loginUser && $loginUser->role !== UserRole::STAFF) {
                throw new Exception('This email already belongs to another login account.');
            }
        }

        $attributes = [
            'name' => "{$staff->first_name} {$staff->last_name}",
            'email' => $staff->email,
            'role' => UserRole::STAFF,
            'email_verified_at' => now(),
        ];

        if ($password) {
            $attributes['password'] = $password;
        }

        if ($loginUser) {
            $this->userRepository->update($loginUser, $attributes);
            return;
        }

        $attributes['password'] = $password ?? $staff->password;

        $this->userRepository->create($attributes);
    }
}
