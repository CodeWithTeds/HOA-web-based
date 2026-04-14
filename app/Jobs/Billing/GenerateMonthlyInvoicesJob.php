<?php

namespace App\Jobs\Billing;

use App\Services\Billing\BillingService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateMonthlyInvoicesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        protected int $billingPeriodId,
        protected ?float $amount = null,
        protected ?array $residentIds = null
    ) {}

    /**
     * Execute the job.
     */
    public function handle(BillingService $billingService): void
    {
        $billingService->generateMonthlyInvoices(
            $this->billingPeriodId,
            $this->amount,
            $this->residentIds
        );
    }
}
