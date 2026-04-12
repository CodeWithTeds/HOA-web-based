<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'landing', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::inertia('/landing', 'landing');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard', ['portalType' => 'homeowner'])->name('dashboard');

    Route::middleware('role:admin')->group(function () {
        Route::inertia('admin/dashboard', 'dashboard', ['portalType' => 'admin'])->name('admin.dashboard');
        Route::get('admin/staff', [\App\Http\Controllers\Admin\StaffController::class, 'index'])->name('admin.staff.index');
        Route::get('admin/staff/create', [\App\Http\Controllers\Admin\StaffController::class, 'create'])->name('admin.staff.create');
        Route::post('admin/staff', [\App\Http\Controllers\Admin\StaffController::class, 'store'])->name('admin.staff.store');
    });

    Route::middleware('role:staff')->group(function () {
        Route::inertia('staff/dashboard', 'dashboard', ['portalType' => 'staff'])->name('staff.dashboard');
    });
});

require __DIR__ . '/settings.php';
