<?php

namespace App\Services\Chat;

use App\Events\Chat\MessageSent;
use App\Models\ResidentMessage;
use App\Repositories\Chat\Contracts\ChatRepositoryInterface;
use Illuminate\Support\Collection;

class ChatService
{
    public function __construct(
        protected ChatRepositoryInterface $chatRepository
    ) {}

    public function getThread(int $residentId): object
    {
        return $this->chatRepository->getThreadByResidentId($residentId);
    }

    public function sendMessage(array $data): ResidentMessage
    {
        $message = $this->chatRepository->createMessage($data);

        // Broadcast the message immediately via Laravel Reverb
        broadcast(new MessageSent($message))->toOthers();

        return $message;
    }

    public function markAsRead(int $residentId, int $adminId = null): void
    {
        $this->chatRepository->markAsRead($residentId, $adminId);
    }

    public function getActiveThreads(): Collection
    {
        return $this->chatRepository->getActiveResidentThreads();
    }
}
