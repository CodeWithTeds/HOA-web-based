<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Http\Resources\AnnouncementResource;
use App\Http\Resources\Resident\BillingPageResource;
use App\Repositories\Announcement\AnnouncementRepositoryInterface;
use App\Services\Resident\ResidentBillingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected ResidentBillingService $billingService,
        protected AnnouncementRepositoryInterface $announcementRepository
    ) {}

    public function index(Request $request): Response
    {
        $billingData = $this->billingService->getBillingPageData($request->user()?->email);
        $updates = $this->announcementRepository->getForResidents(4);

        return Inertia::render('dashboard', [
            'portalType' => 'homeowner',
            ...BillingPageResource::make($billingData)->resolve($request),
            'updates' => AnnouncementResource::collection($updates->getCollection())->resolve($request),
        ]);
    }
}
