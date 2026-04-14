<?php

namespace App\Services\Report;

use App\Repositories\Report\ReportRepositoryInterface;
use Illuminate\Support\Collection;

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
     * Get the full financial dashboard data.
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
}
