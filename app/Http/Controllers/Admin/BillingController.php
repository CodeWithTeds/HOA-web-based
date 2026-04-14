<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBillingPeriodRequest;
use App\Models\BillingPeriod;
use App\Services\Billing\BillingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class BillingController extends Controller
{
    /**
     * BillingController constructor.
     *
     * @param BillingService $billingService
     */
    public function __construct(
        protected BillingService $billingService
    ) {}

    /**
     * Display the billing overview.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'billing_period_id', 'status']);
        $periodId = $request->get('billing_period_id');

        $invoices = $this->billingService->getPaginatedInvoices($filters);
        $summaries = $this->billingService->getFinancialSummaries($periodId);
        $periods = BillingPeriod::latest()->get();

        return Inertia::render('admin/billing/index', [
            'invoices' => $invoices,
            'summaries' => $summaries,
            'periods' => $periods,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new billing period.
     *
     * @return Response
     */
    public function createPeriod(): Response
    {
        $residents = \App\Models\Resident::where('status', 'Active')
            ->orderBy('last_name')
            ->get(['id', 'first_name', 'last_name', 'phase', 'block', 'lot']);

        return Inertia::render('admin/billing/create-period', [
            'residents' => $residents,
        ]);
    }

    /**
     * Store a newly created billing period and generate invoices.
     *
     * @param StoreBillingPeriodRequest $request
     * @return RedirectResponse
     */
    public function storePeriod(StoreBillingPeriodRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $period = $this->billingService->createBillingPeriod($validated);
        
        // Auto-generate invoices for the selected or all residents
        $generatedCount = $this->billingService->generateMonthlyInvoices(
            $period->id, 
            $validated['amount'],
            $validated['resident_ids'] ?? null
        );

        return redirect()->route('admin.billing.index', ['billing_period_id' => $period->id])
            ->with('success', "Billing period created and {$generatedCount} invoices generated.");
    }

    /**
     * Generate invoices for an existing period manually.
     *
     * @param int $id
     * @return RedirectResponse
     */
    public function generateInvoices(int $id): RedirectResponse
    {
        $count = $this->billingService->generateMonthlyInvoices($id);

        return redirect()->back()
            ->with('success', "{$count} new invoices generated successfully.");
    }

    /**
     * Record a payment for an invoice.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function recordPayment(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'invoice_id' => ['required', 'exists:invoices,id'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'payment_date' => ['required', 'date'],
            'payment_method' => ['required', 'string'],
            'reference_number' => ['nullable', 'string', 'max:50'],
        ]);

        $this->billingService->recordPayment($validated);

        return redirect()->back()->with('success', 'Payment recorded and balance updated.');
    }

    /**
     * Get invoice details as JSON.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function showInvoice(int $id): \Illuminate\Http\JsonResponse
    {
        $details = $this->billingService->getInvoiceDetails($id);
        return response()->json($details);
    }

    /**
     * Export billing registry to CSV.
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function exportCsv(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $filters = $request->only(['search', 'billing_period_id', 'status']);
        $invoices = \App\Models\Invoice::with(['resident', 'billingPeriod'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->whereHas('resident', function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%");
                })->orWhere('invoice_number', 'like', "%{$search}%");
            })
            ->when($filters['billing_period_id'] ?? null, fn($q, $id) => $q->where('billing_period_id', $id))
            ->when($filters['status'] ?? null, fn($q, $status) => $q->where('status', $status))
            ->latest()
            ->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="billing_registry_' . date('Y-m-d') . '.csv"',
        ];

        $callback = function () use ($invoices) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Invoice #', 'Last Name', 'First Name', 'Phase', 'Block', 'Lot', 'Period', 'Status', 'Total Amount', 'Paid', 'Balance']);

            foreach ($invoices as $invoice) {
                fputcsv($file, [
                    $invoice->invoice_number,
                    $invoice->resident->last_name,
                    $invoice->resident->first_name,
                    $invoice->resident->phase,
                    $invoice->resident->block,
                    $invoice->resident->lot,
                    $invoice->billingPeriod->name,
                    $invoice->status->value,
                    $invoice->total_amount,
                    $invoice->paid_amount,
                    $invoice->balance,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
