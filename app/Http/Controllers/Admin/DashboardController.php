<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Services\Dashboard\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    /**
     * Display the management dashboard.
     */
    public function index(Request $request): Response
    {
        $portalType = $request->user()?->role === UserRole::STAFF ? 'staff' : 'admin';

        return Inertia::render('dashboard', array_merge(
            ['portalType' => $portalType],
            $this->dashboardService->getDashboardData()
        ));
    }
}
