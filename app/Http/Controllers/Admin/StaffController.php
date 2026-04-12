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
    public function index(): Response
    {
        $staff = $this->staffService->getPaginatedStaff(10);
        return Inertia::render('admin/staff/index', ['staff' => $staff]);
    }

    /**
     * Show the form for creating a new staff member.
     */
    public function create(): Response
    {
        return Inertia::render('admin/staff/create');
    }

    /**
     * Store a newly created staff member in storage.
     */
    public function store(StoreStaffRequest $request): \Illuminate\Http\RedirectResponse
    {
        $this->staffService->createStaff($request->validated());

        return redirect()->route('admin.staff.index')->with('success', 'Staff member registered successfully.');
    }
}
