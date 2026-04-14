<?php

namespace App\Repositories\Report;

use Illuminate\Support\Collection;

interface ReportRepositoryInterface
{
    /**
     * Get overall financial totals.
     *
     * @return array
     */
    public function getFinancialTotals(): array;

    /**
     * Get revenue trends (monthly) for a specific period.
     *
     * @param int $months
     * @return Collection
     */
    public function getRevenueTrends(int $months = 12): Collection;

    /**
     * Get collection distribution by status.
     *
     * @return Collection
     */
    public function getCollectionDistribution(): Collection;

    /**
     * Get summarized data for all billing periods.
     *
     * @return Collection
     */
    public function getBillingPeriodSummaries(): Collection;

    /**
     * Get collections group by Phase.
     *
     * @return Collection
     */
    public function getCollectionsByPhase(): Collection;

    /**
     * Get collections group by Resident Type.
     *
     * @return Collection
     */
    public function getCollectionsByType(): Collection;
}
