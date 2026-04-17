<?php

namespace App\Http\Resources\Chat;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'resident_id' => $this->resident_id,
            'admin_id' => $this->admin_id,
            'resident_name' => $this->resident ? $this->resident->name : 'Unknown Resident',
            'admin_name' => $this->admin ? $this->admin->name : 'Support',
            'sender_type' => $this->sender_type,
            'content' => $this->content,
            'is_read' => $this->is_read,
            'read_at' => $this->read_at ? $this->read_at->format('Y-m-d H:i:s') : null,
            'attachments' => $this->attachments,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'human_time' => $this->created_at->diffForHumans(),
        ];
    }
}
