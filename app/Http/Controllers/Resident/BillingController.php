<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Http\Requests\Resident\StorePaymentProofRequest;
use App\Http\Resources\Resident\BillingPageResource;
use App\Http\Resources\Resident\BillingPaymentResource;
use App\Http\Resources\Billing\InvoiceResource;
use App\Services\Resident\ResidentBillingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    public function __construct(protected ResidentBillingService $billingService) {}

    public function index(Request $request): Response
    {
        $data = $this->billingService->getBillingPageData(
            $request->user()?->email,
            $request->get('month') ? (int) $request->get('month') : null,
            $request->get('year') ? (int) $request->get('year') : null,
        );

        return Inertia::render('Resident/billing/index', [
            ...BillingPageResource::make($data)->resolve($request),
            'filters' => $request->only(['month', 'year']),
        ]);
    }

    public function uploadProof(StorePaymentProofRequest $request): RedirectResponse
    {
        $this->billingService->uploadProof($request->user()?->email, $request->validated());

        return redirect()->route('resident.billing.index')
            ->with('success', 'Proof of payment uploaded. It is now pending verification.');
    }

    public function showReceipt(Request $request, int $payment): BillingPaymentResource
    {
        $paymentModel = $this->billingService->getReceiptData($request->user()?->email, $payment);

        return new BillingPaymentResource($paymentModel);
    }

    public function showInvoiceReceipt(Request $request, int $id): InvoiceResource
    {
        $invoice = $this->billingService->getInvoiceReceiptData($request->user()?->email, $id);

        return new InvoiceResource($invoice);
    }
}
