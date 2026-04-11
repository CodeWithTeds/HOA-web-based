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
    });

    Route::middleware('role:staff')->group(function () {
        Route::inertia('staff/dashboard', 'dashboard', ['portalType' => 'staff'])->name('staff.dashboard');
    });
});

require __DIR__ . '/settings.php';
