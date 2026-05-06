<?php

namespace App\Http\Resources\Resident;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BillingPageResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'resident' => $this->resource['resident']
                ? BillingResidentResource::make($this->resource['resident'])->resolve($request)
                : null,
            'summary' => $this->resource['summary'],
            'invoices' => BillingInvoiceResource::collection($this->resource['invoices'])->resolve($request),
            'payments' => BillingPaymentResource::collection($this->resource['payments'])->resolve($request),
        ];
    }
}
