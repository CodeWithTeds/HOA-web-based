<?php

namespace App\Repositories\Dashboard;

use App\Models\Resident;
use App\Models\Payment;
use App\Models\Complaint;
use App\Models\FacilityBooking;
use App\Models\Invoice;
use App\Repositories\BaseRepository;
use Illuminate\Support\Facades\DB;

class EloquentDashboardRepository extends BaseRepository implements DashboardRepositoryInterface
{
    public function __construct(Invoice $model)
    {
        parent::__construct($model);
    }

    public function getCounts(): array
    {
        return [
            'totalResidents' => Resident::count(),
            'pendingComplaints' => Complaint::where('status', 'pending')->count(),
            'pendingBookings' => FacilityBooking::where('status', 'pending')->count(),
        ];
    }

    public function getFinancialTotals(): array
    {
        $totalInvoiced = Invoice::sum('total_amount');
        $totalPaid = Payment::sum('amount');
        
        return [
            'totalInvoiced' => $totalInvoiced,
            'totalPaid' => $totalPaid,
            'outstandingBalance' => $totalInvoiced - $totalPaid,
        ];
    }

    public function getRecentActivities(): array
    {
        return [
            'recentPayments' => Payment::with('invoice.resident')
                ->latest()
                ->limit(5)
                ->get(),
            'recentComplaints' => Complaint::with('resident')
                ->latest()
                ->limit(5)
                ->get(),
            'upcomingBookings' => FacilityBooking::with(['resident', 'facility'])
                ->where('start_time', '>=', now())
                ->orderBy('start_time', 'asc')
                ->limit(5)
                ->get(),
        ];
    }

    public function getMonthlyPerformance(int $months = 6): array
    {
        $startDate = now()->subMonths($months)->startOfMonth();

        $invoicedData = Invoice::select(
            DB::raw('SUM(total_amount) as amount'),
            DB::raw("DATE_FORMAT(created_at, '%b') as month"),
            DB::raw("MONTH(created_at) as month_num"),
            DB::raw("YEAR(created_at) as year")
        )
        ->where('created_at', '>=', $startDate)
        ->groupBy('year', 'month', 'month_num')
        ->orderBy('year')
        ->orderBy('month_num')
        ->get();

        $collectedData = Payment::select(
            DB::raw('SUM(amount) as amount'),
            DB::raw("DATE_FORMAT(payment_date, '%b') as month"),
            DB::raw("MONTH(payment_date) as month_num"),
            DB::raw("YEAR(payment_date) as year")
        )
        ->where('payment_date', '>=', $startDate)
        ->groupBy('year', 'month', 'month_num')
        ->orderBy('year')
        ->orderBy('month_num')
        ->get();

        return [
            'invoiced' => $invoicedData,
            'collected' => $collectedData
        ];
    }
}
