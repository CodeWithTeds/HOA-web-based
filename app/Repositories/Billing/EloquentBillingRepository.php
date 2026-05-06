<?php

namespace App\Repositories\Billing;

use App\Enums\PaymentStatus;
use App\Models\BillingPeriod;
use App\Models\Invoice;
use App\Models\Payment;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class EloquentBillingRepository extends BaseRepository implements BillingRepositoryInterface
{
    /**
     * EloquentBillingRepository constructor.
     *
     * @param Invoice $model
     */
    public function __construct(Invoice $model)
    {
        parent::__construct($model);
    }

    /**
     * @inheritDoc
     */
    public function getPaginatedInvoices(array $filters = [], int $perPage = 25): LengthAwarePaginator
    {
        $query = $this->model->newQuery()->with(['resident', 'billingPeriod', 'payments']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->whereHas('resident', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            })->orWhere('invoice_number', 'like', "%{$search}%");
        }

        if (!empty($filters['billing_period_id'])) {
            $query->where('billing_period_id', $filters['billing_period_id']);
        }

        if (!empty($filters['status'])) {
            if ($filters['status'] === PaymentStatus::PENDING->value) {
                $query->whereHas('payments', fn ($paymentQuery) => $paymentQuery->where('status', PaymentStatus::PENDING->value));
            } else {
                $query->where('status', $filters['status']);
            }
        }

        return $query->latest()->paginate($perPage);
    }

    /**
     * @inheritDoc
     */
    public function getSummaries(?int $billingPeriodId = null): array
    {
        $invoiceQuery = $this->model->newQuery();
        $paymentQuery = Payment::query()->where('status', PaymentStatus::VERIFIED->value);
        $pendingPaymentQuery = Payment::query()->where('status', PaymentStatus::PENDING->value);

        if ($billingPeriodId) {
            $invoiceQuery->where('billing_period_id', $billingPeriodId);
            $paymentQuery->whereHas('invoice', function ($q) use ($billingPeriodId) {
                $q->where('billing_period_id', $billingPeriodId);
            });
            $pendingPaymentQuery->whereHas('invoice', function ($q) use ($billingPeriodId) {
                $q->where('billing_period_id', $billingPeriodId);
            });
        }

        return [
            'total_dues' => (float) $invoiceQuery->sum('total_amount'),
            'total_collections' => (float) $paymentQuery->sum('amount'),
            'outstanding_balance' => (float) $invoiceQuery->sum('balance'),
            'pending_proofs' => $pendingPaymentQuery->count(),
        ];
    }

    /**
     * @inheritDoc
     */
    public function getAllBillingPeriods(): Collection
    {
        return BillingPeriod::latest()->get();
    }

    /**
     * @inheritDoc
     */
    public function findBillingPeriod(int $id): BillingPeriod
    {
        return BillingPeriod::findOrFail($id);
    }

    /**
     * @inheritDoc
     */
    public function createBillingPeriod(array $data): BillingPeriod
    {
        return BillingPeriod::create($data);
    }

    /**
     * @inheritDoc
     */
    public function createInvoice(array $data): Invoice
    {
        return $this->model->create($data);
    }

    /**
     * @inheritDoc
     */
    public function invoiceExists(int $residentId, int $billingPeriodId): bool
    {
        return $this->model->newQuery()
            ->where('resident_id', $residentId)
            ->where('billing_period_id', $billingPeriodId)
            ->exists();
    }

    /**
     * @inheritDoc
     */
    public function findInvoice(int $id, array $relations = []): Invoice
    {
        return $this->model->newQuery()->with($relations)->findOrFail($id);
    }

    /**
     * @inheritDoc
     */
    public function updateInvoice(Invoice $invoice, array $data): Invoice
    {
        $invoice->update($data);

        return $invoice->refresh();
    }

    /**
     * @inheritDoc
     */
    public function createPayment(array $data): Payment
    {
        return Payment::create($data);
    }

    /**
     * @inheritDoc
     */
    public function findPayment(int $id, array $relations = []): Payment
    {
        return Payment::query()->with($relations)->findOrFail($id);
    }

    /**
     * @inheritDoc
     */
    public function updatePayment(Payment $payment, array $data): Payment
    {
        $payment->update($data);

        return $payment->refresh();
    }

    /**
     * @inheritDoc
     */
    public function getResidentInvoices(int $residentId): Collection
    {
        return $this->model->newQuery()
            ->with(['billingPeriod', 'payments'])
            ->where('resident_id', $residentId)
            ->latest('due_date')
            ->get();
    }

    /**
     * @inheritDoc
     */
    public function getResidentPayments(int $residentId): Collection
    {
        return Payment::query()
            ->with(['invoice.billingPeriod'])
            ->whereHas('invoice', fn ($query) => $query->where('resident_id', $residentId))
            ->latest('payment_date')
            ->latest()
            ->get();
    }

    /**
     * @inheritDoc
     */
    public function findResidentInvoice(int $invoiceId, int $residentId): Invoice
    {
        return $this->model->newQuery()
            ->where('resident_id', $residentId)
            ->findOrFail($invoiceId);
    }

    /**
     * @inheritDoc
     */
    public function hasPendingPaymentForInvoice(int $invoiceId): bool
    {
        return Payment::query()
            ->where('invoice_id', $invoiceId)
            ->where('status', PaymentStatus::PENDING->value)
            ->exists();
    }

    /**
     * @inheritDoc
     */
    public function getInvoicesForExport(array $filters): Collection
    {
        $query = $this->model->newQuery()->with(['resident', 'billingPeriod']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->whereHas('resident', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            })->orWhere('invoice_number', 'like', "%{$search}%");
        }

        if (!empty($filters['billing_period_id'])) {
            $query->where('billing_period_id', $filters['billing_period_id']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->get();
    }
}
