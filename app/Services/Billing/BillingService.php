<?php

namespace App\Services\Billing;

use App\Enums\InvoiceStatus;
use App\Models\BillingPeriod;
use App\Models\Invoice;
use App\Models\Resident;
use App\Models\Payment;
use App\Enums\PaymentStatus;
use App\Repositories\Billing\BillingRepositoryInterface;
use App\Repositories\Resident\ResidentRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BillingService
{
    /**
     * BillingService constructor.
     *
     * @param BillingRepositoryInterface $billingRepository
     * @param ResidentRepositoryInterface $residentRepository
     */
    public function __construct(
        protected BillingRepositoryInterface $billingRepository,
        protected ResidentRepositoryInterface $residentRepository
    ) {}

    /**
     * Get paginated invoices.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getPaginatedInvoices(array $filters): LengthAwarePaginator
    {
        return $this->billingRepository->getPaginatedInvoices($filters, 25);
    }

    /**
     * Get financial summaries.
     *
     * @param int|null $billingPeriodId
     * @return array
     */
    public function getFinancialSummaries(int $billingPeriodId = null): array
    {
        return $this->billingRepository->getSummaries($billingPeriodId);
    }

    /**
     * Create a new billing period.
     *
     * @param array $data
     * @return BillingPeriod
     */
    public function createBillingPeriod(array $data): BillingPeriod
    {
        return BillingPeriod::create($data);
    }

    /**
     * Generate monthly invoices for residents.
     *
     * @param int $billingPeriodId
     * @param float|null $amount The billing amount for this period. Fallbacks to period stored amount.
     * @param array|null $residentIds If null, generate for all active residents (bulk).
     * @return int Number of invoices generated
     */
    public function generateMonthlyInvoices(int $billingPeriodId, ?float $amount = null, array $residentIds = null): int
    {
        $billingPeriod = BillingPeriod::findOrFail($billingPeriodId);
        $amount = $amount ?? $billingPeriod->amount;
        
        $query = Resident::where('status', 'Active');
        if (!empty($residentIds)) {
            $query->whereIn('id', $residentIds);
        }
        
        $residents = $query->get();
        $count = 0;

        DB::transaction(function () use ($billingPeriod, $residents, $amount, &$count) {
            foreach ($residents as $resident) {
                // Skip if invoice already exists for this resident and period
                if (Invoice::where('resident_id', $resident->id)
                    ->where('billing_period_id', $billingPeriod->id)
                    ->exists()) {
                    continue;
                }

                $invoice = Invoice::create([
                    'resident_id' => $resident->id,
                    'billing_period_id' => $billingPeriod->id,
                    'invoice_number' => 'INV-' . date('Ym') . '-' . Str::upper(Str::random(6)),
                    'total_amount' => $amount,
                    'paid_amount' => 0,
                    'balance' => $amount,
                    'status' => InvoiceStatus::UNPAID,
                    'due_date' => $billingPeriod->due_date,
                ]);

                $invoice->items()->create([
                    'description' => 'Monthly Association Dues - ' . $billingPeriod->name,
                    'amount' => $amount,
                    'type' => 'Dues',
                ]);

                $count++;
            }
        });

        return $count;
    }

    /**
     * Record a payment for an invoice.
     *
     * @param array $data
     * @return \App\Models\Payment
     */
    public function recordPayment(array $data): \App\Models\Payment
    {
        return DB::transaction(function () use ($data) {
            $invoice = Invoice::findOrFail($data['invoice_id']);
            
            // Create the payment record
            $payment = Payment::create([
                'invoice_id' => $invoice->id,
                'amount' => $data['amount'],
                'payment_date' => $data['payment_date'],
                'payment_method' => $data['payment_method'],
                'reference_number' => $data['reference_number'] ?? null,
                'status' => PaymentStatus::VERIFIED,
            ]);

            // Update invoice balances
            $invoice->paid_amount += $data['amount'];
            $invoice->balance = $invoice->total_amount - $invoice->paid_amount;
            
            // Determine status
            if ($invoice->balance <= 0) {
                $invoice->status = InvoiceStatus::PAID;
                $invoice->balance = 0;
            } elseif ($invoice->paid_amount > 0) {
                $invoice->status = InvoiceStatus::PARTIALLY_PAID;
            }

            $invoice->save();

            return $payment;
        });
    }

    /**
     * Get invoice details with items and payments.
     *
     * @param int $id
     * @return Invoice
     */
    public function getInvoiceDetails(int $id): Invoice
    {
        return Invoice::with(['resident', 'billingPeriod', 'items', 'payments'])->findOrFail($id);
    }
}
