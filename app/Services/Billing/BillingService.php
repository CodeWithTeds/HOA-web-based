<?php

namespace App\Services\Billing;

use App\Enums\InvoiceStatus;
use App\Models\BillingPeriod;
use App\Models\Invoice;
use App\Models\Payment;
use App\Enums\PaymentStatus;
use App\Events\BillingPeriodCreated;
use App\Repositories\Billing\BillingRepositoryInterface;
use App\Repositories\Resident\ResidentRepositoryInterface;
use Illuminate\Auth\Access\AuthorizationException;
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
    public function getFinancialSummaries(?int $billingPeriodId = null): array
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
    public function generateMonthlyInvoices(int $billingPeriodId, ?float $amount = null, ?array $residentIds = null): int
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
     * @param int|null $verifiedBy
     * @return Payment
     */
    public function recordPayment(array $data, ?int $verifiedBy = null): Payment
    {
        return DB::transaction(function () use ($data, $verifiedBy) {
            $invoice = $this->billingRepository->findInvoice($data['invoice_id']);
            
            // Create the payment record
            $payment = $this->billingRepository->createPayment([
                'invoice_id' => $invoice->id,
                'amount' => $data['amount'],
                'payment_date' => $data['payment_date'],
                'payment_method' => $data['payment_method'],
                'reference_number' => $data['reference_number'] ?? null,
                'status' => PaymentStatus::VERIFIED,
                'verified_by' => $verifiedBy,
                'verified_at' => now(),
            ]);

            // Update invoice balances
            $this->applyVerifiedPaymentToInvoice($invoice, (float) $data['amount']);

            return $payment;
        });
    }

    /**
     * Verify a homeowner-uploaded proof of payment.
     *
     * @param int $paymentId
     * @param int|null $verifiedBy
     * @return Payment
     *
     * @throws AuthorizationException
     */
    public function verifyPayment(int $paymentId, ?int $verifiedBy = null, ?string $notes = null): Payment
    {
        return DB::transaction(function () use ($paymentId, $verifiedBy, $notes) {
            $payment = $this->billingRepository->findPayment($paymentId, ['invoice']);

            if ($payment->status !== PaymentStatus::PENDING) {
                throw new AuthorizationException('Only pending payments can be verified.');
            }

            $verifiedPayment = $this->billingRepository->updatePayment($payment, [
                'status' => PaymentStatus::VERIFIED,
                'verified_by' => $verifiedBy,
                'verified_at' => now(),
                'verification_notes' => $notes,
                'rejected_by' => null,
                'rejected_at' => null,
            ]);

            $this->applyVerifiedPaymentToInvoice($payment->invoice, (float) $payment->amount);

            return $verifiedPayment;
        });
    }

    /**
     * Reject a homeowner-uploaded proof of payment.
     *
     * @param int $paymentId
     * @param int|null $rejectedBy
     * @return Payment
     *
     * @throws AuthorizationException
     */
    public function rejectPayment(int $paymentId, ?int $rejectedBy = null, ?string $reason = null): Payment
    {
        $payment = $this->billingRepository->findPayment($paymentId);

        if ($payment->status !== PaymentStatus::PENDING) {
            throw new AuthorizationException('Only pending payments can be rejected.');
        }

        return $this->billingRepository->updatePayment($payment, [
            'status' => PaymentStatus::REJECTED,
            'rejected_by' => $rejectedBy,
            'rejected_at' => now(),
            'rejection_reason' => $reason,
            'verified_by' => null,
            'verified_at' => null,
        ]);
    }

    /**
     * Get invoice details with items and payments.
     *
     * @param int $id
     * @return Invoice
     */
    public function getInvoiceDetails(int $id): Invoice
    {
        return $this->billingRepository->findInvoice($id, ['resident', 'billingPeriod', 'items', 'payments', 'booking.facility']);
    }

    public function getPaymentDetails(int $id): Payment
    {
        return $this->billingRepository->findPayment($id, ['invoice.resident', 'invoice.billingPeriod', 'invoice.items', 'invoice.booking.facility']);
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

    private function applyVerifiedPaymentToInvoice(Invoice $invoice, float $amount): Invoice
    {
        $paidAmount = (float) $invoice->paid_amount + $amount;
        $balance = (float) $invoice->total_amount - $paidAmount;
        $status = InvoiceStatus::UNPAID;

        if ($balance <= 0) {
            $status = InvoiceStatus::PAID;
            $balance = 0;
        } elseif ($paidAmount > 0) {
            $status = InvoiceStatus::PARTIALLY_PAID;
        }

        return $this->billingRepository->updateInvoice($invoice, [
            'paid_amount' => $paidAmount,
            'balance' => $balance,
            'status' => $status,
        ]);
    }
}
