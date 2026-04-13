<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreStaffRequest;
use App\Services\Staff\StaffService;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    public function __construct(
        protected StaffService $staffService
    ) {}

    /**
     * Display a listing of staff.
     */
    public function index(\Illuminate\Http\Request $request): Response
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
    public function store(StoreStaffRequest $request): \Illuminate\Http\RedirectResponse
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
    public function update(\App\Http\Requests\Admin\UpdateStaffRequest $request, string $id): \Illuminate\Http\RedirectResponse
    {
        $this->staffService->updateStaff($id, $request->validated());
        return redirect()->route('admin.user.index')->with('success', 'Staff member updated successfully.');
    }

    /**
     * Toggle the status of the specified staff member.
     */
    public function toggleStatus(string $id): \Illuminate\Http\RedirectResponse
    {
        $this->staffService->toggleStaffStatus($id);
        return redirect()->back()->with('success', 'Staff status updated successfully.');
    }

    /**
     * Remove the specified staff member from storage.
     */
    public function destroy(string $id): \Illuminate\Http\RedirectResponse
    {
        $this->staffService->deleteStaff($id);
        return redirect()->route('admin.user.index')->with('success', 'Staff member removed successfully.');
    }
}
