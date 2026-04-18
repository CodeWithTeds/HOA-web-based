<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Dashboard\DashboardService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    /**
     * Display the admin dashboard.
     *
     * @return Response
     */
    public function index(): Response
    {
        return Inertia::render('dashboard', array_merge(
            ['portalType' => 'admin'],
            $this->dashboardService->getDashboardData()
        ));
    }
}
