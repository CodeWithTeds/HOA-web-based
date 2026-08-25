<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\Resident;
use App\Models\Facility;
use App\Models\Announcement;
use App\Models\Complaint;
use App\Models\BillingPeriod;
use App\Models\Invoice;
use App\Models\User;

class ArchiveController extends Controller
{
    public function index(Request $request): Response
    {
        $type = $request->get('type', 'residents');

        $data = match ($type) {
            'facilities' => Facility::onlyTrashed()->latest()->paginate(25),
            'announcements' => Announcement::onlyTrashed()->with('author')->latest()->paginate(25),
            'complaints' => Complaint::onlyTrashed()->with('resident')->latest()->paginate(25),
            'billing' => BillingPeriod::onlyTrashed()->latest()->paginate(25),
            'users' => User::onlyTrashed()->latest()->paginate(25),
            default => Resident::onlyTrashed()->latest()->paginate(25),
        };

        // counts for tabs
        $counts = [
            'residents' => Resident::onlyTrashed()->count(),
            'facilities' => Facility::onlyTrashed()->count(),
            'announcements' => Announcement::onlyTrashed()->count(),
            'complaints' => Complaint::onlyTrashed()->count(),
            'billing' => BillingPeriod::onlyTrashed()->count(),
            'users' => User::onlyTrashed()->count(),
        ];

        return Inertia::render('admin/archive/index', [
            'type' => $type,
            'records' => $data,
            'counts' => $counts,
        ]);
    }

    public function restore(Request $request, string $type, int $id): RedirectResponse
    {
        $model = $this->resolveModel($type, $id);
        $model->restore();

        return redirect()->back()->with('success', ucfirst($type) . ' restored successfully.');
    }

    public function forceDelete(Request $request, string $type, int $id): RedirectResponse
    {
        $model = $this->resolveModel($type, $id);
        $model->forceDelete();

        return redirect()->back()->with('success', ucfirst($type) . ' permanently deleted.');
    }

    protected function resolveModel(string $type, int $id)
    {
        return match ($type) {
            'residents', 'resident' => Resident::onlyTrashed()->findOrFail($id),
            'facilities', 'facility' => Facility::onlyTrashed()->findOrFail($id),
            'announcements', 'announcement' => Announcement::onlyTrashed()->findOrFail($id),
            'complaints', 'complaint' => Complaint::onlyTrashed()->findOrFail($id),
            'billing', 'billing_period', 'billing_periods' => BillingPeriod::onlyTrashed()->findOrFail($id),
            'users', 'user' => User::onlyTrashed()->findOrFail($id),
            default => Resident::onlyTrashed()->findOrFail($id),
        };
    }
}
