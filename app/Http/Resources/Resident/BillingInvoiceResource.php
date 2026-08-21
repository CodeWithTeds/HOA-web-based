<?php

namespace App\Http\Resources\Resident;

use App\Enums\PaymentStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BillingInvoiceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $hasPendingPayment = $this->relationLoaded('payments')
            && $this->payments->contains(fn ($payment) => $payment->status === PaymentStatus::PENDING);

        $booking = $this->relationLoaded('booking') ? $this->booking : null;

        return [
            'id' => $this->id,
            'invoice_number' => $this->invoice_number,
            'period' => $this->billingPeriod?->name,
            'total_amount' => (float) $this->total_amount,
            'paid_amount' => (float) $this->paid_amount,
            'balance' => (float) $this->balance,
            'status' => $this->status?->value ?? $this->status,
            'display_status' => $hasPendingPayment ? PaymentStatus::PENDING->value : ($this->status?->value ?? $this->status),
            'has_pending_payment' => $hasPendingPayment,
            'due_date' => $this->due_date?->toDateString(),
            'created_at' => $this->created_at?->toDateTimeString(),
            'items' => $this->relationLoaded('items')
                ? $this->items->map(fn ($item) => [
                    'description' => $item->description,
                    'amount' => (float) $item->amount,
                    'type' => $item->type,
                ])->values()->all()
                : [],
            'payments' => $this->relationLoaded('payments')
                ? $this->payments->map(fn ($p) => [
                    'id' => $p->id,
                    'amount' => (float) $p->amount,
                    'payment_date' => $p->payment_date?->toDateString(),
                    'payment_method' => $p->payment_method?->value ?? $p->payment_method,
                    'reference_number' => $p->reference_number,
                    'status' => $p->status?->value ?? $p->status,
                    'verified_by' => $p->relationLoaded('verifiedBy') && $p->verifiedBy ? ['name' => $p->verifiedBy->name, 'email' => $p->verifiedBy->email] : null,
                    'verified_at' => $p->verified_at?->toDateTimeString(),
                    'verified_at_human' => $p->verified_at?->format('M d, Y h:i A'),
                    'created_at' => $p->created_at?->toDateTimeString(),
                ])->values()->all()
                : [],
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
                'special_requests' => $booking->special_requests,
            ] : null,
            'is_reservation' => str_starts_with($this->invoice_number, 'FB-'),
        ];
    }
}
