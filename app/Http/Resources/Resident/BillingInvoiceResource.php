<?php

namespace App\Http\Resources\Resident;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BillingInvoiceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'invoice_number' => $this->invoice_number,
            'period' => $this->billingPeriod?->name,
            'total_amount' => (float) $this->total_amount,
            'paid_amount' => (float) $this->paid_amount,
            'balance' => (float) $this->balance,
            'status' => $this->status?->value ?? $this->status,
            'due_date' => $this->due_date?->toDateString(),
        ];
    }
}
