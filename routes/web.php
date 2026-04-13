<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\Admin\ResidentController;

Route::inertia('/', 'landing', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::inertia('/landing', 'landing');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard', ['portalType' => 'homeowner'])->name('dashboard');

    Route::middleware('role:admin')->group(function () {
        Route::inertia('admin/dashboard', 'dashboard', ['portalType' => 'admin'])->name('admin.dashboard');
        
        // Residents
        Route::get('admin/residents', [ResidentController::class, 'index'])->name('admin.residents.index');
        Route::get('admin/residents/create', [ResidentController::class, 'create'])->name('admin.residents.create');
        Route::post('admin/residents', [ResidentController::class, 'store'])->name('admin.residents.store');
        Route::get('admin/residents/{resident}', [ResidentController::class, 'show'])->name('admin.residents.show');
        Route::get('admin/residents/{resident}/edit', [ResidentController::class, 'edit'])->name('admin.residents.edit');
        Route::put('admin/residents/{resident}', [ResidentController::class, 'update'])->name('admin.residents.update');
        Route::delete('admin/residents/{resident}', [ResidentController::class, 'destroy'])->name('admin.residents.destroy');
        
        Route::get('admin/user', [StaffController::class, 'index'])->name('admin.user.index');
        Route::get('admin/user/create', [StaffController::class, 'create'])->name('admin.user.create');
        Route::post('admin/user', [StaffController::class, 'store'])->name('admin.user.store');
        Route::get('admin/user/{user}', [StaffController::class, 'show'])->name('admin.user.show');
        Route::get('admin/user/{user}/edit', [StaffController::class, 'edit'])->name('admin.user.edit');
        Route::put('admin/user/{user}', [StaffController::class, 'update'])->name('admin.user.update');
        Route::patch('admin/user/{user}/status', [StaffController::class, 'toggleStatus'])->name('admin.user.status');
        Route::delete('admin/user/{user}', [StaffController::class, 'destroy'])->name('admin.user.destroy');
    });

    Route::middleware('role:staff')->group(function () {
        Route::inertia('staff/dashboard', 'dashboard', ['portalType' => 'staff'])->name('staff.dashboard');
    });
});

require __DIR__ . '/settings.php';
