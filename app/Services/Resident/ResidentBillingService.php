<?php

namespace App\Services\Resident;

use App\Enums\PaymentStatus;
use App\Repositories\Billing\BillingRepositoryInterface;
use App\Repositories\Resident\ResidentRepositoryInterface;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class ResidentBillingService
{
    public function __construct(
        protected BillingRepositoryInterface $billingRepository,
        protected ResidentRepositoryInterface $residentRepository
    ) {}

    public function getBillingPageData(?string $email, ?string $period = null, ?int $year = null): array
    {
        $resident = $email ? $this->residentRepository->findByEmail($email) : null;

        if (!$resident) {
            return $this->emptyBillingData();
        }

        $invoices = $this->billingRepository->getResidentInvoices($resident->id, $period, $year);
        $payments = $this->billingRepository->getResidentPayments($resident->id, $period, $year);
        $allInvoices = $this->billingRepository->getResidentInvoices($resident->id);
        $billingPeriods = $this->billingRepository->getAllBillingPeriods();

        // Extract available years from all invoices for the year filter
        $availableYears = $allInvoices
            ->filter(fn ($invoice) => $invoice->due_date)
            ->map(fn ($invoice) => $invoice->due_date->year)
            ->unique()
            ->sort()
            ->values()
            ->toArray();

        return [
            'resident' => $resident,
            'summary' => $this->buildSummary($allInvoices, $this->billingRepository->getResidentPayments($resident->id)),
            'invoices' => $invoices,
            'payments' => $payments,
            'billing_periods' => $billingPeriods,
            'available_years' => $availableYears,
        ];
    }

    /**
     * @throws AuthorizationException
     * @throws ValidationException
     */
    public function uploadProof(?string $email, array $data): void
    {
        $resident = $email ? $this->residentRepository->findByEmail($email) : null;

        if (!$resident) {
            throw new AuthorizationException();
        }

        $invoice = $this->billingRepository->findResidentInvoice((int) $data['invoice_id'], $resident->id);

        if ($this->billingRepository->hasPendingPaymentForInvoice($invoice->id)) {
            throw ValidationException::withMessages([
                'invoice_id' => 'This invoice already has a pending proof of payment. Please wait for admin approval or rejection before uploading again.',
            ]);
        }

        $proofPath = $data['proof']->store('payment-proofs', 'public');

        $this->billingRepository->createPayment([
            'invoice_id' => $invoice->id,
            'amount' => $data['amount'],
            'payment_date' => $data['payment_date'],
            'payment_method' => $data['payment_method'],
            'reference_number' => $data['reference_number'] ?? null,
            'payment_proof_path' => $proofPath,
            'status' => PaymentStatus::PENDING,
        ]);
    }

    private function emptyBillingData(): array
    {
        return [
            'resident' => null,
            'summary' => [
                'current_balance' => 0,
                'total_billed' => 0,
                'total_paid' => 0,
                'pending_proofs' => 0,
            ],
            'invoices' => new Collection(),
            'payments' => new Collection(),
            'billing_periods' => new Collection(),
            'available_years' => [],
        ];
    }

    private function buildSummary(Collection $invoices, Collection $payments): array
    {
        return [
            'current_balance' => (float) $invoices->sum('balance'),
            'total_billed' => (float) $invoices->sum('total_amount'),
            'total_paid' => (float) $invoices->sum('paid_amount'),
            'pending_proofs' => $payments->where('status', PaymentStatus::PENDING)->count(),
        ];
    }
}
