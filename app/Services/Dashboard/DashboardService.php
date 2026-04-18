<?php

namespace App\Services\Dashboard;

use App\Repositories\Dashboard\DashboardRepositoryInterface;

class DashboardService
{
    public function __construct(
        protected DashboardRepositoryInterface $dashboardRepository
    ) {}

    public function getDashboardData(): array
    {
        $counts = $this->dashboardRepository->getCounts();
        $financials = $this->dashboardRepository->getFinancialTotals();
        $activities = $this->dashboardRepository->getRecentActivities();
        $performance = $this->dashboardRepository->getMonthlyPerformance();

        // Format performance data for the chart
        $chartData = $this->formatChartData($performance);

        return [
            'stats' => array_merge($counts, $financials),
            'recentPayments' => $activities['recentPayments'],
            'recentComplaints' => $activities['recentComplaints'],
            'upcomingBookings' => $activities['upcomingBookings'],
            'monthlyRevenue' => $chartData,
        ];
    }

    protected function formatChartData(array $performance): array
    {
        $chartData = [];
        
        // Initialize months for the last 6 months
        for ($i = 5; $i >= 0; $i--) {
            $key = now()->subMonths($i)->format('M');
            $chartData[$key] = [
                'month' => $key,
                'invoiced' => 0,
                'collected' => 0
            ];
        }

        foreach ($performance['invoiced'] as $row) {
            if (isset($chartData[$row->month])) {
                $chartData[$row->month]['invoiced'] = (float) $row->amount;
            }
        }

        foreach ($performance['collected'] as $row) {
            if (isset($chartData[$row->month])) {
                $chartData[$row->month]['collected'] = (float) $row->amount;
            }
        }

        return array_values($chartData);
    }
}
