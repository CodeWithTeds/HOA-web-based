<?php

namespace App\Http\Resources\Billing;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'amount' => (float) $this->amount,
            'payment_date' => $this->payment_date?->toDateString(),
            'payment_method' => $this->payment_method?->value ?? $this->payment_method,
            'reference_number' => $this->reference_number,
            'status' => $this->status?->value ?? $this->status,
            'proof_url' => $this->payment_proof_path ? asset('storage/' . $this->payment_proof_path) : null,
            'verified_by' => $this->whenLoaded('verifiedBy', fn () => $this->verifiedBy ? [
                'id' => $this->verifiedBy->id,
                'name' => $this->verifiedBy->name,
                'email' => $this->verifiedBy->email,
            ] : null),
            'verified_at' => $this->verified_at?->toDateTimeString(),
            'verified_at_human' => $this->verified_at?->format('M d, Y h:i A'),
            'rejected_by' => $this->whenLoaded('rejectedBy', fn () => $this->rejectedBy ? [
                'id' => $this->rejectedBy->id,
                'name' => $this->rejectedBy->name,
                'email' => $this->rejectedBy->email,
            ] : null),
            'rejected_at' => $this->rejected_at?->toDateTimeString(),
            'rejected_at_human' => $this->rejected_at?->format('M d, Y h:i A'),
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
            'invoice' => $this->whenLoaded('invoice', function () {
                $inv = $this->invoice;
                return $inv ? [
                    'id' => $inv->id,
                    'invoice_number' => $inv->invoice_number,
                    'total_amount' => (float) $inv->total_amount,
                    'paid_amount' => (float) $inv->paid_amount,
                    'balance' => (float) $inv->balance,
                    'status' => $inv->status?->value ?? $inv->status,
                    'due_date' => $inv->due_date?->toDateString(),
                    'resident' => $inv->relationLoaded('resident') && $inv->resident ? [
                        'id' => $inv->resident->id,
                        'name' => $inv->resident->full_name,
                        'email' => $inv->resident->email,
                        'address' => trim("Phase {$inv->resident->phase} Block {$inv->resident->block} Lot {$inv->resident->lot}"),
                    ] : null,
                    'items' => $inv->relationLoaded('items') ? $inv->items->map(fn ($it) => [
                        'description' => $it->description,
                        'amount' => (float) $it->amount,
                        'type' => $it->type,
                    ])->values()->all() : [],
                    'booking' => $inv->relationLoaded('booking') && $inv->booking ? [
                        'id' => $inv->booking->id,
                        'facility' => $inv->booking->relationLoaded('facility') ? [
                            'id' => $inv->booking->facility->id,
                            'name' => $inv->booking->facility->name,
                            'base_price' => (float) $inv->booking->facility->base_price,
                            'price_type' => $inv->booking->facility->price_type,
                            'capacity' => $inv->booking->facility->capacity,
                        ] : null,
                        'start_time' => $inv->booking->start_time?->toDateTimeString(),
                        'end_time' => $inv->booking->end_time?->toDateTimeString(),
                        'total_fee' => (float) $inv->booking->total_fee,
                        'status' => $inv->booking->status,
                        'purpose' => $inv->booking->purpose,
                        'attendees' => $inv->booking->attendees,
                    ] : null,
                ] : null;
            }),
        ];
    }
}
