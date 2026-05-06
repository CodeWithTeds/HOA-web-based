<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreStaffRequest;
use App\Http\Requests\Admin\UpdateStaffRequest;
use App\Models\User;
use App\Services\Staff\StaffService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Enums\UserRole;

class StaffController extends Controller
{
    public function __construct(
        protected StaffService $staffService
    ) {}

    /**
     * Display a listing of staff.
     */
    public function index(Request $request): Response
    {
        $staff = $this->staffService->getPaginatedStaff(10, $request->input('search'));
        return Inertia::render('admin/user/index', [
            'staff' => $staff,
            'filters' => $request->only('search')
        ]);
    }

    /**
     * Show the form for creating a new staff member.
     */
    public function create(): Response
    {
        return Inertia::render('admin/user/create');
    }

    /**
     * Store a newly created staff member in storage.
     */
    public function store(StoreStaffRequest $request): RedirectResponse
    {
        $this->staffService->createStaff($request->validated());

        return redirect()->route('admin.user.index')->with('success', 'Staff member registered successfully.');
    }

    /**
     * Show the specified staff member.
     */
    public function show(string $id): Response
    {
        $staff = $this->staffService->getStaffById($id);
        return Inertia::render('admin/user/show', ['staff' => $staff]);
    }

    /**
     * Show the form for editing the specified staff member.
     */
    public function edit(string $id): Response
    {
        $staff = $this->staffService->getStaffById($id);
        return Inertia::render('admin/user/edit', ['staff' => $staff]);
    }

    /**
     * Update the specified staff member.
     */
    public function update(UpdateStaffRequest $request, string $id): RedirectResponse
    {
        $this->staffService->updateStaff($id, $request->validated());
        return redirect()->route('admin.user.index')->with('success', 'Staff member updated successfully.');
    }

    /**
     * Toggle the status of the specified staff member.
     */
    public function toggleStatus(string $id): RedirectResponse
    {
        $this->staffService->toggleStaffStatus($id);
        return redirect()->back()->with('success', 'Staff status updated successfully.');
    }

    /**
     * Remove the specified staff member from storage.
     */
    public function destroy(string $id): RedirectResponse
    {
        $this->staffService->deleteStaff($id);
        return redirect()->route('admin.user.index')->with('success', 'Staff member removed successfully.');
    }

    /**
     * Export staff list to CSV.
     */
    public function exportCsv(Request $request): StreamedResponse
    {
        $staff = User::where('role', UserRole::STAFF)
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->latest()
            ->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="staff_list_' . date('Y-m-d') . '.csv"',
        ];

        $callback = function () use ($staff) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Name', 'Email', 'Role', 'Status', 'Registered At']);

            foreach ($staff as $user) {
                fputcsv($file, [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->role->value,
                    $user->status ?? 'Active',
                    $user->created_at->format('Y-m-d H:i'),
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
