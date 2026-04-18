<?php

namespace App\Repositories\Dashboard;

use App\Repositories\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

interface DashboardRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get counts for dashboard stats.
     *
     * @return array
     */
    public function getCounts(): array;

    /**
     * Get financial totals.
     *
     * @return array
     */
    public function getFinancialTotals(): array;

    /**
     * Get recent activities.
     *
     * @return array
     */
    public function getRecentActivities(): array;

    /**
     * Get monthly financial performance for the last N months.
     *
     * @param int $months
     * @return array
     */
    public function getMonthlyPerformance(int $months = 6): array;
}
