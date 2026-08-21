<?php

namespace App\Http\Resources\Billing;

use App\Enums\PaymentStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $hasPendingPayment = $this->relationLoaded('payments')
            && $this->payments->contains(fn ($payment) => $payment->status === PaymentStatus::PENDING);

        $booking = $this->whenLoaded('booking');

        return [
            'id' => $this->id,
            'invoice_number' => $this->invoice_number,
            'resident' => $this->whenLoaded('resident'),
            'billing_period' => $this->whenLoaded('billingPeriod'),
            'total_amount' => $this->total_amount,
            'paid_amount' => $this->paid_amount,
            'balance' => $this->balance,
            'status' => $this->status?->value ?? $this->status,
            'display_status' => $hasPendingPayment ? PaymentStatus::PENDING->value : ($this->status?->value ?? $this->status),
            'due_date' => $this->due_date,
            'items' => $this->whenLoaded('items'),
            'payments' => PaymentResource::collection($this->whenLoaded('payments'))->resolve($request),
            'booking' => $booking,
            'is_reservation' => str_starts_with($this->invoice_number, 'FB-'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
