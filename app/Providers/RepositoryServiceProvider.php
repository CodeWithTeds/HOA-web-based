<?php

namespace App\Providers;

use App\Repositories\TaskRepository;
use App\Repositories\TaskRepositoryInterface;
use App\Repositories\Staff\EloquentStaffRepository;
use App\Repositories\Staff\StaffRepositoryInterface;
use App\Repositories\Resident\ResidentRepositoryInterface;
use App\Repositories\Resident\EloquentResidentRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{

    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(TaskRepositoryInterface::class, TaskRepository::class);
        $this->app->singleton(StaffRepositoryInterface::class, EloquentStaffRepository::class);
        $this->app->singleton(ResidentRepositoryInterface::class, EloquentResidentRepository::class);
        $this->app->singleton(
            \App\Repositories\Billing\BillingRepositoryInterface::class,
            \App\Repositories\Billing\EloquentBillingRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void {}
}
