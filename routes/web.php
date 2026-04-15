<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\Admin\ResidentController;
use App\Http\Controllers\Admin\BillingController;
use App\Http\Controllers\Admin\ReportController;

Route::inertia('/', 'landing', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::inertia('/landing', 'landing');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard', ['portalType' => 'homeowner'])->name('dashboard');

    Route::middleware('role:admin')->group(function () {
        Route::inertia('admin/dashboard', 'dashboard', ['portalType' => 'admin'])->name('admin.dashboard');
        
        // Residents
        Route::get('admin/residents/export', [ResidentController::class, 'exportCsv'])->name('admin.residents.export');
        Route::get('admin/residents', [ResidentController::class, 'index'])->name('admin.residents.index');
        Route::get('admin/residents/create', [ResidentController::class, 'create'])->name('admin.residents.create');
        Route::post('admin/residents', [ResidentController::class, 'store'])->name('admin.residents.store');
        Route::get('admin/residents/{resident}', [ResidentController::class, 'show'])->name('admin.residents.show');
        Route::get('admin/residents/{resident}/edit', [ResidentController::class, 'edit'])->name('admin.residents.edit');
        Route::put('admin/residents/{resident}', [ResidentController::class, 'update'])->name('admin.residents.update');
        Route::delete('admin/residents/{resident}', [ResidentController::class, 'destroy'])->name('admin.residents.destroy');
        
        // Billing & Collection
        Route::get('admin/billing/export', [BillingController::class, 'exportCsv'])->name('admin.billing.export');
        Route::get('admin/billing', [BillingController::class, 'index'])->name('admin.billing.index');
        Route::get('admin/billing/create-period', [BillingController::class, 'createPeriod'])->name('admin.billing.create-period');
        Route::post('admin/billing/periods', [BillingController::class, 'storePeriod'])->name('admin.billing.periods.store');
        Route::post('admin/billing/periods/{id}/generate', [BillingController::class, 'generateInvoices'])->name('admin.billing.periods.generate');
        Route::post('admin/billing/payments', [BillingController::class, 'recordPayment'])->name('admin.billing.payments.store');
        Route::get('admin/billing/invoices/{id}', [BillingController::class, 'showInvoice'])->name('admin.billing.invoices.show');

        // Reports & Analytics
        Route::get('admin/reports/export', [ReportController::class, 'exportCsv'])->name('admin.reports.export');
        Route::get('admin/reports', [ReportController::class, 'index'])->name('admin.reports.index');
        
        Route::get('admin/user/export', [StaffController::class, 'exportCsv'])->name('admin.user.export');
        Route::get('admin/user', [StaffController::class, 'index'])->name('admin.user.index');
        Route::get('admin/user/create', [StaffController::class, 'create'])->name('admin.user.create');
        Route::post('admin/user', [StaffController::class, 'store'])->name('admin.user.store');
        Route::get('admin/user/{user}', [StaffController::class, 'show'])->name('admin.user.show');
        Route::get('admin/user/{user}/edit', [StaffController::class, 'edit'])->name('admin.user.edit');
        Route::put('admin/user/{user}', [StaffController::class, 'update'])->name('admin.user.update');
        Route::patch('admin/user/{user}/status', [StaffController::class, 'toggleStatus'])->name('admin.user.status');
        Route::delete('admin/user/{user}', [StaffController::class, 'destroy'])->name('admin.user.destroy');

        // Facility Management
        Route::get('admin/facilities', [\App\Http\Controllers\Admin\FacilityController::class, 'index'])->name('admin.facilities.index');
        Route::post('admin/facilities', [\App\Http\Controllers\Admin\FacilityController::class, 'store'])->name('admin.facilities.store');
        Route::put('admin/facilities/{id}', [\App\Http\Controllers\Admin\FacilityController::class, 'update'])->name('admin.facilities.update');
        Route::delete('admin/facilities/{id}', [\App\Http\Controllers\Admin\FacilityController::class, 'destroy'])->name('admin.facilities.destroy');

        // Facility Bookings
        Route::get('admin/bookings', [\App\Http\Controllers\Admin\BookingController::class, 'index'])->name('admin.bookings.index');
        Route::post('admin/bookings', [\App\Http\Controllers\Admin\BookingController::class, 'store'])->name('admin.bookings.store');
    });

    Route::middleware('role:staff')->group(function () {
        Route::inertia('staff/dashboard', 'dashboard', ['portalType' => 'staff'])->name('staff.dashboard');
    });
});

require __DIR__ . '/settings.php';
