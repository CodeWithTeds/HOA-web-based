<?php

namespace App\Events;

use App\Models\BillingPeriod;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BillingPeriodCreated
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public BillingPeriod $billingPeriod,
        public array $residentIds = []
    ) {}
}
