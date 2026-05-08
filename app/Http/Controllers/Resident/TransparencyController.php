<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Services\Report\ReportService;
use Inertia\Inertia;
use Inertia\Response;

class TransparencyController extends Controller
{
    public function __construct(
        protected ReportService $reportService
    ) {}

    public function index(): Response
    {
        return Inertia::render('Resident/transparency/index', [
            'data' => $this->reportService->getFinancialDashboardData(),
        ]);
    }
}
