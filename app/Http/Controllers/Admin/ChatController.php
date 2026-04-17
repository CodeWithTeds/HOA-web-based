<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Chat\StoreMessageRequest;
use App\Http\Resources\Chat\MessageResource;
use App\Services\Chat\ChatService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Enums\Chat\MessageSenderType;

class ChatController extends Controller
{
    public function __construct(
        protected ChatService $chatService
    ) {}

    public function index()
    {
        return Inertia::render('admin/Chat/Index', [
            'threads' => $this->chatService->getActiveThreads(),
        ]);
    }

    public function show(int $residentId)
    {
        // Mark as read when admin opens the thread
        $this->chatService->markAsRead($residentId, auth()->id());

        return response()->json([
            'messages' => MessageResource::collection($this->chatService->getThread($residentId))
        ]);
    }

    public function store(StoreMessageRequest $request)
    {
        $data = $request->validated();
        $data['admin_id'] = auth()->id();
        $data['sender_type'] = MessageSenderType::ADMIN;

        $message = $this->chatService->sendMessage($data);

        return response()->json([
            'message' => new MessageResource($message)
        ], 201);
    }
}
