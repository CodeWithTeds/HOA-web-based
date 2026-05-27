<?php

namespace App\Repositories\Billing;

use App\Models\BillingPeriod;
use App\Models\Invoice;
use App\Models\Payment;
use App\Repositories\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface BillingRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get paginated invoices with optional filters.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginatedInvoices(array $filters = [], int $perPage = 25): LengthAwarePaginator;

    /**
     * Get summaries for a billing period.
     *
     * @param int|null $billingPeriodId
     * @return array
     */
    public function getSummaries(?int $billingPeriodId = null): array;

    /**
     * Get all billing periods.
     *
     * @return Collection
     */
    public function getAllBillingPeriods(): Collection;

    /**
     * Find a billing period by ID.
     *
     * @param int $id
     * @return BillingPeriod
     */
    public function findBillingPeriod(int $id): BillingPeriod;

    /**
     * Create a new billing period.
     *
     * @param array $data
     * @return BillingPeriod
     */
    public function createBillingPeriod(array $data): BillingPeriod;

    /**
     * Create a new invoice.
     *
     * @param array $data
     * @return Invoice
     */
    public function createInvoice(array $data): Invoice;

    /**
     * Check if an invoice exists for a resident and billing period.
     *
     * @param int $residentId
     * @param int $billingPeriodId
     * @return bool
     */
    public function invoiceExists(int $residentId, int $billingPeriodId): bool;

    /**
     * Find an invoice by ID with relations.
     *
     * @param int $id
     * @param array $relations
     * @return Invoice
     */
    public function findInvoice(int $id, array $relations = []): Invoice;

    /**
     * Update an invoice.
     *
     * @param Invoice $invoice
     * @param array $data
     * @return Invoice
     */
    public function updateInvoice(Invoice $invoice, array $data): Invoice;

    /**
     * Create a payment record.
     *
     * @param array $data
     * @return Payment
     */
    public function createPayment(array $data): Payment;

    /**
     * Find a payment by ID with relations.
     *
     * @param int $id
     * @param array $relations
     * @return Payment
     */
    public function findPayment(int $id, array $relations = []): Payment;

    /**
     * Update a payment.
     *
     * @param Payment $payment
     * @param array $data
     * @return Payment
     */
    public function updatePayment(Payment $payment, array $data): Payment;

    /**
     * Get all invoices owned by a resident.
     *
     * @param int $residentId
     * @param int|null $month
     * @param int|null $year
     * @return Collection
     */
    public function getResidentInvoices(int $residentId, ?int $month = null, ?int $year = null): Collection;

    /**
     * Get all payments attached to a resident's invoices.
     *
     * @param int $residentId
     * @param int|null $month
     * @param int|null $year
     * @return Collection
     */
    public function getResidentPayments(int $residentId, ?int $month = null, ?int $year = null): Collection;

    /**
     * Find an invoice that belongs to a resident.
     *
     * @param int $invoiceId
     * @param int $residentId
     * @return Invoice
     */
    public function findResidentInvoice(int $invoiceId, int $residentId): Invoice;

    /**
     * Check if an invoice already has a pending payment proof.
     *
     * @param int $invoiceId
     * @return bool
     */
    public function hasPendingPaymentForInvoice(int $invoiceId): bool;

    /**
     * Get invoices for export.
     *
     * @param array $filters
     * @return Collection
     */
    public function getInvoicesForExport(array $filters): Collection;
}
