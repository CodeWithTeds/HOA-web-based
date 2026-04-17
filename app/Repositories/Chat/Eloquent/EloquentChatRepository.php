<?php

namespace App\Repositories\Chat\Eloquent;

use App\Models\ResidentMessage;
use App\Models\User;
use App\Repositories\Chat\Contracts\ChatRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Enums\UserRole;

class EloquentChatRepository implements ChatRepositoryInterface
{
    public function getThreadByResidentId(int $residentId, int $perPage = 50): object
    {
        return ResidentMessage::with(['resident', 'admin'])
            ->where('resident_id', $residentId)
            ->orderBy('created_at', 'asc')
            ->paginate($perPage);
    }

    public function createMessage(array $data): ResidentMessage
    {
        return ResidentMessage::create($data);
    }

    public function markAsRead(int $residentId, int $adminId = null): void
    {
        ResidentMessage::where('resident_id', $residentId)
            ->where('is_read', false)
            ->where('sender_type', '!=', $adminId ? 'admin' : 'resident') // If admin is marking, they mark resident messages as read
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    public function getActiveResidentThreads(): Collection
    {
        // Return all homeowners so admin can initiate chat with anyone
        return User::where('role', UserRole::HOMEOWNER->value)
            ->withCount(['residentMessages as unread_count' => function ($query) {
                $query->where('is_read', false)->where('sender_type', 'homeowner');
            }])
            ->orderByDesc('unread_count')
            ->orderBy('name')
            ->get();
    }
}
