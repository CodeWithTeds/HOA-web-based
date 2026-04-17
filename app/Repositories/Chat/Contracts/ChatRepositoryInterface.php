<?php

namespace App\Repositories\Chat\Contracts;

use App\Models\ResidentMessage;
use Illuminate\Support\Collection;

interface ChatRepositoryInterface
{
    public function getThreadByResidentId(int $residentId, int $perPage = 50): object;

    public function createMessage(array $data): ResidentMessage;

    public function markAsRead(int $residentId, int $adminId = null): void;

    public function getActiveResidentThreads(): Collection;
}
