<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\Admin\StaffController;

Route::inertia('/', 'landing', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::inertia('/landing', 'landing');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard', ['portalType' => 'homeowner'])->name('dashboard');

    Route::middleware('role:admin')->group(function () {
        Route::inertia('admin/dashboard', 'dashboard', ['portalType' => 'admin'])->name('admin.dashboard');
        Route::get('admin/staff', [StaffController::class, 'index'])->name('admin.staff.index');
        Route::get('admin/staff/create', [StaffController::class, 'create'])->name('admin.staff.create');
        Route::post('admin/staff', [StaffController::class, 'store'])->name('admin.staff.store');
        Route::get('admin/staff/{staff}', [StaffController::class, 'show'])->name('admin.staff.show');
        Route::get('admin/staff/{staff}/edit', [StaffController::class, 'edit'])->name('admin.staff.edit');
        Route::put('admin/staff/{staff}', [StaffController::class, 'update'])->name('admin.staff.update');
        Route::patch('admin/staff/{staff}/status', [StaffController::class, 'toggleStatus'])->name('admin.staff.status');
        Route::delete('admin/staff/{staff}', [StaffController::class, 'destroy'])->name('admin.staff.destroy');
    });

    Route::middleware('role:staff')->group(function () {
        Route::inertia('staff/dashboard', 'dashboard', ['portalType' => 'staff'])->name('staff.dashboard');
    });
});

require __DIR__ . '/settings.php';
