<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Http\Requests\Chat\StoreMessageRequest;
use App\Http\Resources\Chat\MessageResource;
use App\Services\Chat\ChatService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Enums\Chat\MessageSenderType;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function __construct(
        protected ChatService $chatService
    ) {}

    public function index()
    {
        return Inertia::render('Resident/Chat/Index', [
            'messages' => MessageResource::collection($this->chatService->getThread(Auth::id())),
        ]);
    }

    public function store(StoreMessageRequest $request)
    {
        $data = $request->validated();
        $data['resident_id'] = Auth::id();
        $data['sender_type'] = MessageSenderType::HOMEOWNER;

        $message = $this->chatService->sendMessage($data);

        return response()->json([
            'message' => new MessageResource($message)
        ], 201);
    }
}
