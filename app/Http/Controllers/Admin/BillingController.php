<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RecordPaymentRequest;
use App\Http\Requests\Admin\StoreBillingPeriodRequest;
use App\Http\Resources\Billing\InvoiceResource;
use App\Services\Billing\BillingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class BillingController extends Controller
{
    /**
     * BillingController constructor.
     */
    public function __construct(
        protected BillingService $billingService
    ) {}

    /**
     * Display the billing overview.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('admin/billing/index', [
            'invoices' => $this->billingService->getPaginatedInvoices($request->all()),
            'summaries' => $this->billingService->getFinancialSummaries($request->get('billing_period_id')),
            'periods' => $this->billingService->getAllBillingPeriods(),
            'filters' => $request->only(['search', 'billing_period_id', 'status', 'month', 'year']),
        ]);
    }

    /**
     * Show the form for creating a new billing period.
     */
    public function createPeriod(): Response
    {
        return Inertia::render('admin/billing/create-period', [
            'residents' => $this->billingService->getActiveResidents(),
        ]);
    }

    /**
     * Store a newly created billing period and generate invoices.
     */
    public function storePeriod(StoreBillingPeriodRequest $request): RedirectResponse
    {
        // Use synchronous generation for immediate data availability on the index page
        $this->billingService->createBillingPeriod($request->validated(), true);

        return redirect()->route('admin.billing.index')
            ->with('success', "Billing period created and invoices generated.");
    }

    /**
     * Generate invoices for an existing period manually.
     */
    public function generateInvoices(int $id): RedirectResponse
    {
        $count = $this->billingService->generateMonthlyInvoices($id);

        return redirect()->back()
            ->with('success', "{$count} new invoices generated successfully.");
    }

    /**
     * Record a payment for an invoice.
     */
    public function recordPayment(RecordPaymentRequest $request): RedirectResponse
    {
        $this->billingService->recordPayment($request->validated());

        return redirect()->back()->with('success', 'Payment recorded and balance updated.');
    }

    /**
     * Verify a pending homeowner payment proof.
     */
    public function verifyPayment(int $payment): RedirectResponse
    {
        $this->billingService->verifyPayment($payment);

        return redirect()->back()->with('success', 'Payment proof verified and invoice balance updated.');
    }

    /**
     * Reject a pending homeowner payment proof.
     */
    public function rejectPayment(int $payment): RedirectResponse
    {
        $this->billingService->rejectPayment($payment);

        return redirect()->back()->with('success', 'Payment proof rejected. The homeowner can upload a new proof.');
    }

    /**
     * Get invoice details as JSON.
     */
    public function showInvoice(int $id): InvoiceResource
    {
        return new InvoiceResource($this->billingService->getInvoiceDetails($id));
    }

    /**
     * Export billing registry to CSV.
     */
    public function exportCsv(Request $request): StreamedResponse
    {
        $invoices = $this->billingService->getInvoicesForExport($request->all());

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="billing_registry_' . date('Y-m-d') . '.csv"',
        ];

        return response()->stream(function () use ($invoices) {
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
        }, 200, $headers);
    }
}
