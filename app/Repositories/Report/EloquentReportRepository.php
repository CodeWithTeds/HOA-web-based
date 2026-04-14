<?php

namespace App\Repositories\Report;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\BillingPeriod;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class EloquentReportRepository implements ReportRepositoryInterface
{
    /**
     * Get overall financial totals.
     *
     * @return array
     */
    public function getFinancialTotals(): array
    {
        $stats = Invoice::query()
            ->selectRaw('SUM(total_amount) as total_expected, SUM(paid_amount) as total_collected, SUM(balance) as total_outstanding')
            ->first();

        return [
            'total_expected' => (float) ($stats->total_expected ?? 0),
            'total_collected' => (float) ($stats->total_collected ?? 0),
            'total_outstanding' => (float) ($stats->total_outstanding ?? 0),
            'collection_rate' => $stats->total_expected > 0 
                ? round(($stats->total_collected / $stats->total_expected) * 100, 2) 
                : 0
        ];
    }

    /**
     * Get revenue trends (monthly) for charts.
     *
     * @param int $months
     * @return Collection
     */
    public function getRevenueTrends(int $months = 12): Collection
    {
        return Payment::query()
            ->selectRaw("DATE_FORMAT(payment_date, '%b %Y') as month, SUM(amount) as total, payment_date")
            ->where('payment_date', '>=', now()->subMonths($months))
            ->groupBy('month', 'payment_date')
            ->orderBy('payment_date')
            ->get();
    }

    /**
     * Get collection distribution by status.
     *
     * @return Collection
     */
    public function getCollectionDistribution(): Collection
    {
        return Invoice::query()
            ->select('status', DB::raw('COUNT(*) as count'), DB::raw('SUM(total_amount) as amount'))
            ->groupBy('status')
            ->get();
    }

    /**
     * Get summarized data for all billing periods.
     *
     * @return Collection
     */
    public function getBillingPeriodSummaries(): Collection
    {
        return BillingPeriod::query()
            ->withCount('invoices')
            ->get()
            ->map(function ($period) {
                $stats = Invoice::where('billing_period_id', $period->id)
                    ->selectRaw('SUM(total_amount) as billed, SUM(paid_amount) as collected')
                    ->first();

                return [
                    'id' => $period->id,
                    'name' => $period->name,
                    'invoices_count' => $period->invoices_count,
                    'total_billed' => (float) ($stats->billed ?? 0),
                    'total_collected' => (float) ($stats->collected ?? 0),
                    'balance' => (float) (($stats->billed ?? 0) - ($stats->collected ?? 0)),
                    'collection_percentage' => $stats->billed > 0 
                        ? round(($stats->collected / $stats->billed) * 100, 2) 
                        : 0
                ];
            });
    }

    /**
     * Get collections group by Phase.
     *
     * @return Collection
     */
    public function getCollectionsByPhase(): Collection
    {
        return Invoice::query()
            ->join('residents', 'invoices.resident_id', '=', 'residents.id')
            ->select('residents.phase', DB::raw('SUM(total_amount) as billed'), DB::raw('SUM(paid_amount) as collected'))
            ->groupBy('residents.phase')
            ->orderBy('residents.phase')
            ->get();
    }

    /**
     * Get collections group by Resident Type.
     *
     * @return Collection
     */
    public function getCollectionsByType(): Collection
    {
        return Invoice::query()
            ->join('residents', 'invoices.resident_id', '=', 'residents.id')
            ->select('residents.resident_type', DB::raw('SUM(total_amount) as billed'), DB::raw('SUM(paid_amount) as collected'))
            ->groupBy('residents.resident_type')
            ->get();
    }
}
