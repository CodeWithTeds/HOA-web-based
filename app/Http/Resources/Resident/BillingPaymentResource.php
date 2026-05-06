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
        return [
            'id' => $this->id,
            'invoice_number' => $this->invoice?->invoice_number,
            'period' => $this->invoice?->billingPeriod?->name,
            'amount' => (float) $this->amount,
            'payment_date' => $this->payment_date?->toDateString(),
            'payment_method' => $this->payment_method?->value ?? $this->payment_method,
            'reference_number' => $this->reference_number,
            'status' => $this->status?->value ?? $this->status,
            'proof_url' => $this->payment_proof_path ? asset('storage/' . $this->payment_proof_path) : null,
        ];
    }
}
