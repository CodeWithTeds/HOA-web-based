<?php

namespace App\Listeners;

use App\Events\BillingPeriodCreated;
use App\Jobs\Billing\GenerateMonthlyInvoicesJob;
use Illuminate\Contracts\Queue\ShouldQueue;

class GenerateBillingInvoices
{
    /**
     * Handle the event.
     */
    public function handle(BillingPeriodCreated $event): void
    {
        GenerateMonthlyInvoicesJob::dispatch(
            $event->billingPeriod->id,
            $event->billingPeriod->amount,
            $event->residentIds
        );
    }
}
