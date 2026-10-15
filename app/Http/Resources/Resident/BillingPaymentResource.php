<?php

namespace App\Http\Resources\Resident;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BillingPaymentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $invoice = $this->invoice;
        $booking = $invoice?->booking;

        return [
            'id' => $this->id,
            'invoice_id' => $this->invoice_id,
            'invoice_number' => $invoice?->invoice_number,
            'period' => $invoice?->billingPeriod?->name,
            'amount' => (float) $this->amount,
            'payment_date' => $this->payment_date?->toDateString(),
            'payment_method' => $this->payment_method?->value ?? $this->payment_method,
            'reference_number' => $this->reference_number,
            'status' => $this->status?->value ?? $this->status,
            'proof_url' => $this->payment_proof_path ? asset('storage/' . $this->payment_proof_path) : null,
            'invoice_total' => (float) ($invoice?->total_amount ?? 0),
            'invoice_balance' => (float) ($invoice?->balance ?? 0),
            'invoice_paid' => (float) ($invoice?->paid_amount ?? 0),
            'invoice_due_date' => $invoice?->due_date?->toDateString(),
            'invoice_items' => $invoice?->relationLoaded('items') ? $invoice->items->map(fn ($item) => [
                'description' => $item->description,
                'amount' => (float) $item->amount,
                'type' => $item->type,
            ])->values()->all() : [],
            'verified_by' => $this->relationLoaded('verifiedBy') && $this->verifiedBy ? [
                'id' => $this->verifiedBy->id,
                'name' => $this->verifiedBy->name,
                'email' => $this->verifiedBy->email,
            ] : null,
            'verified_at' => $this->verified_at?->toDateTimeString(),
            'verified_at_human' => $this->verified_at?->format('M d, Y h:i A'),
            'rejected_by' => $this->relationLoaded('rejectedBy') && $this->rejectedBy ? [
                'id' => $this->rejectedBy->id,
                'name' => $this->rejectedBy->name,
                'email' => $this->rejectedBy->email,
            ] : null,
            'rejected_at' => $this->rejected_at?->toDateTimeString(),
            'rejected_at_human' => $this->rejected_at?->format('M d, Y h:i A'),
            'rejection_reason' => $this->rejection_reason,
            'created_at' => $this->created_at?->toDateTimeString(),
            'booking' => $booking ? [
                'id' => $booking->id,
                'facility' => $booking->relationLoaded('facility') ? [
                    'id' => $booking->facility->id,
                    'name' => $booking->facility->name,
                    'base_price' => (float) $booking->facility->base_price,
                    'price_type' => $booking->facility->price_type,
                    'capacity' => $booking->facility->capacity,
                ] : null,
                'start_time' => $booking->start_time?->toDateTimeString(),
                'end_time' => $booking->end_time?->toDateTimeString(),
                'total_fee' => (float) $booking->total_fee,
                'status' => $booking->status,
                'purpose' => $booking->purpose,
                'attendees' => $booking->attendees,
            ] : null,
        ];
    }
}
