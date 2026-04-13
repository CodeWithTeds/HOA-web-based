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
}
