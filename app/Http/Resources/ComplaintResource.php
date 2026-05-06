<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComplaintResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'subject' => $this->subject,
            'description' => $this->description,
            'resident' => [
                'id' => $this->resident?->id,
                'name' => $this->resident?->full_name,
                'type' => $this->resident?->resident_type?->value,
            ],
            'assigned_staff' => [
                'id' => $this->assignedStaff?->id,
                'name' => $this->assignedStaff?->name,
            ],
            'category' => $this->category,
            'priority' => $this->priority,
            'status' => $this->status,
            'attachment_url' => $this->attachment_path ? asset('storage/' . $this->attachment_path) : null,
            'resolution_notes' => $this->resolution_notes,
            'resolved_at' => $this->resolved_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
