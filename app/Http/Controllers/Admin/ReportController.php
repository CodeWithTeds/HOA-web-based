<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Report\ReportService;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    /**
     * ReportController constructor.
     *
     * @param ReportService $reportService
     */
    public function __construct(
        protected ReportService $reportService
    ) {}

    /**
     * Display the financial reports dashboard.
     *
     * @return Response
     */
    public function index(): Response
    {
        return Inertia::render('admin/reports/index', [
            'data' => $this->reportService->getFinancialDashboardData()
        ]);
    }
}
