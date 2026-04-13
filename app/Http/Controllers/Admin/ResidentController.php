<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GetResidentsRequest;
use App\Http\Requests\Admin\StoreResidentRequest;
use App\Http\Requests\Admin\UpdateResidentRequest;
use App\Services\Resident\ResidentService;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ResidentController extends Controller
{
    /**
     * ResidentController constructor.
     *
     * @param ResidentService $residentService
     */
    public function __construct(
        protected ResidentService $residentService
    ) {}

    /**
     * Display a listing of the residents.
     *
     * @param GetResidentsRequest $request
     * @return Response
     */
    public function index(GetResidentsRequest $request): Response
    {
        $filters = $request->validated();
        $residents = $this->residentService->getPaginatedResidents($filters);

        return Inertia::render('admin/residents/index', [
            'residents' => $residents,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resident.
     *
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('admin/residents/create');
    }

    /**
     * Store a newly created resident in storage.
     *
     * @param StoreResidentRequest $request
     * @return RedirectResponse
     */
    public function store(StoreResidentRequest $request): RedirectResponse
    {
        $this->residentService->storeResident($request->validated());

        return redirect()->route('admin.residents.index')
            ->with('success', 'Resident registered successfully.');
    }

    /**
     * Display the specified resident.
     *
     * @param mixed $resident
     * @return Response
     */
    public function show(mixed $resident): Response
    {
        $residentModel = $this->residentService->findResident($resident);

        return Inertia::render('admin/residents/show', [
            'resident' => $residentModel,
        ]);
    }

    /**
     * Show the form for editing the specified resident.
     *
     * @param mixed $resident
     * @return Response
     */
    public function edit(mixed $resident): Response
    {
        $residentModel = $this->residentService->findResident($resident);

        return Inertia::render('admin/residents/edit', [
            'resident' => $residentModel,
        ]);
    }

    /**
     * Update the specified resident in storage.
     *
     * @param UpdateResidentRequest $request
     * @param mixed $resident
     * @return RedirectResponse
     */
    public function update(UpdateResidentRequest $request, mixed $resident): RedirectResponse
    {
        $this->residentService->updateResident($resident, $request->validated());

        return redirect()->route('admin.residents.index')
            ->with('success', 'Resident updated successfully.');
    }

    /**
     * Remove the specified resident from storage.
     *
     * @param mixed $resident
     * @return RedirectResponse
     */
    public function destroy(mixed $resident): RedirectResponse
    {
        $this->residentService->deleteResident($resident);

        return redirect()->route('admin.residents.index')
            ->with('success', 'Resident deleted successfully.');
    }
}
