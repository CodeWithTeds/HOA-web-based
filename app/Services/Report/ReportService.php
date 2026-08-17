<?php

namespace App\Services\Report;

use App\Models\Resident;
use App\Repositories\Report\ReportRepositoryInterface;
use Illuminate\Support\Collection;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportService
{
    /**
     * ReportService constructor.
     *
     * @param ReportRepositoryInterface $reportRepository
     */
    public function __construct(
        protected ReportRepositoryInterface $reportRepository
    ) {}

    /**
     * Get the full financial dashboard data (admin/staff only).
     *
     * @return array
     */
    public function getFinancialDashboardData(): array
    {
        return [
            'stats' => $this->reportRepository->getFinancialTotals(),
            'trends' => $this->formatTrendsForChart($this->reportRepository->getRevenueTrends()),
            'distribution' => $this->formatDistributionForChart($this->reportRepository->getCollectionDistribution()),
            'period_summaries' => $this->reportRepository->getBillingPeriodSummaries(),
        ];
    }

    /**
     * Get limited transparency data for residents (no sensitive financial amounts).
     *
     * @return array
     */
    public function getResidentTransparencyData(): array
    {
        $activeResidents = Resident::where('status', 'Active')->count();
        $distribution = $this->reportRepository->getCollectionDistribution();
        $periods = $this->reportRepository->getBillingPeriodSummaries();

        $totalInvoices = $distribution->sum('count');

        $statusBreakdown = $distribution->map(fn($item) => [
            'status' => $item->status->value ?? $item->status,
            'count' => (int) $item->count,
            'percentage' => $totalInvoices > 0
                ? round(($item->count / $totalInvoices) * 100, 2)
                : 0,
        ])->toArray();

        $overallCollectionRate = $periods->count() > 0
            ? round($periods->avg('collection_percentage'), 2)
            : 0;

        $periodSummaries = $periods->map(fn($period) => [
            'id' => $period['id'],
            'name' => $period['name'],
            'invoices_count' => $period['invoices_count'],
            'collection_percentage' => $period['collection_percentage'],
        ])->toArray();

        return [
            'community_stats' => [
                'active_residents' => $activeResidents,
                'total_billing_periods' => $periods->count(),
                'overall_collection_rate' => $overallCollectionRate,
            ],
            'status_breakdown' => $statusBreakdown,
            'period_summaries' => $periodSummaries,
        ];
    }

    /**
     * Format trends data for Recharts AreaChart.
     *
     * @param Collection $trends
     * @return array
     */
    protected function formatTrendsForChart(Collection $trends): array
    {
        return $trends->map(fn($item) => [
            'name' => $item->month,
            'amount' => (float) $item->total,
        ])->toArray();
    }

    /**
     * Format distribution data for Recharts PieChart.
     *
     * @param Collection $distribution
     * @return array
     */
    protected function formatDistributionForChart(Collection $distribution): array
    {
        $colors = [
            'Paid' => '#10b981',      // Emerald 500
            'Unpaid' => '#f59e0b',    // Amber 500
            'Overdue' => '#ef4444',   // Red 500
            'Partial' => '#3b82f6',   // Blue 500
        ];

        return $distribution->map(fn($item) => [
            'name' => $item->status->value ?? $item->status,
            'value' => (int) $item->count,
            'amount' => (float) $item->amount,
            'fill' => $colors[$item->status->value ?? $item->status] ?? '#94a3b8',
        ])->toArray();
    }

    /**
     * Export all financial data to CSV.
     *
     * @return StreamedResponse
     */
    public function exportFinancialData(): StreamedResponse
    {
        $stats = $this->reportRepository->getFinancialTotals();
        $trends = $this->reportRepository->getRevenueTrends();
        $periods = $this->reportRepository->getBillingPeriodSummaries();

        return new StreamedResponse(function () use ($stats, $trends, $periods) {
            $handle = fopen('php://output', 'w');

            // Header Section
            fputcsv($handle, ['HOA FINANCIAL INTELLIGENCE REPORT']);
            fputcsv($handle, ['Generated At:', now()->toDateTimeString()]);
            fputcsv($handle, []);

            // Summary Stats
            fputcsv($handle, ['--- OVERALL SUMMARY ---']);
            fputcsv($handle, ['Metric', 'Value']);
            fputcsv($handle, ['Total Expected Revenue', $stats['total_expected']]);
            fputcsv($handle, ['Total Collected', $stats['total_collected']]);
            fputcsv($handle, ['Total Outstanding', $stats['total_outstanding']]);
            fputcsv($handle, ['Collection Rate (%)', $stats['collection_rate']]);
            fputcsv($handle, []);

            // Revenue Trends
            fputcsv($handle, ['--- MONTHLY REVENUE TRENDS ---']);
            fputcsv($handle, ['Month', 'Amount Collected']);
            foreach ($trends as $trend) {
                fputcsv($handle, [$trend->month, $trend->total]);
            }
            fputcsv($handle, []);

            // Billing Period Performance
            fputcsv($handle, ['--- BILLING CYCLE PERFORMANCE ---']);
            fputcsv($handle, ['Cycle Name', 'Invoices', 'Billed', 'Collected', 'Balance', 'Success Rate (%)']);
            foreach ($periods as $period) {
                fputcsv($handle, [
                    $period['name'],
                    $period['invoices_count'],
                    $period['total_billed'],
                    $period['total_collected'],
                    $period['balance'],
                    $period['collection_percentage']
                ]);
            }

            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="financial_report_' . date('Y-m-d') . '.csv"',
        ]);
    }
}
