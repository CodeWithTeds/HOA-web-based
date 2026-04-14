<?php

namespace App\Services\Billing;

use App\Enums\InvoiceStatus;
use App\Models\BillingPeriod;
use App\Models\Invoice;
use App\Models\Resident;
use App\Models\Payment;
use App\Enums\PaymentStatus;
use App\Events\BillingPeriodCreated;
use App\Repositories\Billing\BillingRepositoryInterface;
use App\Repositories\Resident\ResidentRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
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
    public function createBillingPeriod(array $data, bool $sync = false): BillingPeriod
    {
        $period = $this->billingRepository->createBillingPeriod($data);

        if ($sync) {
            $this->generateMonthlyInvoices($period->id, $period->amount, $data['resident_ids'] ?? []);
        } else {
            BillingPeriodCreated::dispatch($period, $data['resident_ids'] ?? []);
        }

        return $period;
    }

    /**
     * Get all active residents for billing selection.
     *
     * @return Collection
     */
    public function getActiveResidents(): Collection
    {
        return $this->residentRepository->getActiveResidents();
    }

    /**
     * Get all billing periods.
     *
     * @return Collection
     */
    public function getAllBillingPeriods(): Collection
    {
        return $this->billingRepository->getAllBillingPeriods();
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
        $billingPeriod = $this->billingRepository->findBillingPeriod($billingPeriodId);
        $amount = $amount ?? $billingPeriod->amount;
        
        $residents = !empty($residentIds) 
            ? $this->residentRepository->getByIds($residentIds)
            : $this->residentRepository->getActiveResidents();
        
        $count = 0;

        DB::transaction(function () use ($billingPeriod, $residents, $amount, &$count) {
            foreach ($residents as $resident) {
                // Skip if invoice already exists for this resident and period
                if ($this->billingRepository->invoiceExists($resident->id, $billingPeriod->id)) {
                    continue;
                }

                $invoice = $this->billingRepository->createInvoice([
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
     * @return Payment
     */
    public function recordPayment(array $data): Payment
    {
        return DB::transaction(function () use ($data) {
            $invoice = $this->billingRepository->findInvoice($data['invoice_id']);
            
            // Create the payment record
            $payment = $this->billingRepository->createPayment([
                'invoice_id' => $invoice->id,
                'amount' => $data['amount'],
                'payment_date' => $data['payment_date'],
                'payment_method' => $data['payment_method'],
                'reference_number' => $data['reference_number'] ?? null,
                'status' => PaymentStatus::VERIFIED,
            ]);

            // Update invoice balances
            $paidAmount = $invoice->paid_amount + $data['amount'];
            $balance = $invoice->total_amount - $paidAmount;
            
            $status = InvoiceStatus::UNPAID;
            // Determine status
            if ($balance <= 0) {
                $status = InvoiceStatus::PAID;
                $balance = 0;
            } elseif ($paidAmount > 0) {
                $status = InvoiceStatus::PARTIALLY_PAID;
            }

            $invoice->update([
                'paid_amount' => $paidAmount,
                'balance' => $balance,
                'status' => $status
            ]);

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
        return $this->billingRepository->findInvoice($id, ['resident', 'billingPeriod', 'items', 'payments']);
    }

    /**
     * Get invoices for export.
     *
     * @param array $filters
     * @return Collection
     */
    public function getInvoicesForExport(array $filters): Collection
    {
        return $this->billingRepository->getInvoicesForExport($filters);
    }
}
