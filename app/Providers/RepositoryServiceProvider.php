<?php

namespace App\Providers;

use App\Repositories\TaskRepository;
use App\Repositories\TaskRepositoryInterface;
use App\Repositories\Staff\EloquentStaffRepository;
use App\Repositories\Staff\StaffRepositoryInterface;
use App\Repositories\Resident\ResidentRepositoryInterface;
use App\Repositories\Resident\EloquentResidentRepository;
use App\Repositories\Billing\BillingRepositoryInterface;
use App\Repositories\Billing\EloquentBillingRepository;
use App\Repositories\Report\ReportRepositoryInterface;
use App\Repositories\Report\EloquentReportRepository;
use App\Repositories\Facility\FacilityRepositoryInterface;
use App\Repositories\Facility\EloquentFacilityRepository;
use App\Repositories\Announcement\AnnouncementRepositoryInterface;
use App\Repositories\Announcement\EloquentAnnouncementRepository;
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
        $this->app->singleton(BillingRepositoryInterface::class, EloquentBillingRepository::class);
        $this->app->singleton(ReportRepositoryInterface::class, EloquentReportRepository::class);
        $this->app->singleton(FacilityRepositoryInterface::class, EloquentFacilityRepository::class);
        $this->app->singleton(AnnouncementRepositoryInterface::class, EloquentAnnouncementRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void {}
}
