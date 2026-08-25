<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GetResidentsRequest;
use App\Http\Requests\Admin\StoreResidentRequest;
use App\Http\Requests\Admin\UpdateResidentRequest;
use App\Services\Resident\ResidentService;
use App\Models\Resident;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

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
        $streetOptions = Resident::whereNotNull('street')
            ->where('street', '!=', '')
            ->distinct()
            ->pluck('street')
            ->filter()
            ->values()
            ->toArray();

        $unitOptions = Resident::whereNotNull('unit')
            ->where('unit', '!=', '')
            ->distinct()
            ->pluck('unit')
            ->filter()
            ->values()
            ->toArray();

        // Also provide composite address options for Street/Unit dropdown
        $addressOptions = Resident::whereNotNull('street')
            ->where('street', '!=', '')
            ->select('street', 'unit')
            ->distinct()
            ->get()
            ->map(fn ($r) => [
                'value' => $r->street . ($r->unit ? '|' . $r->unit : ''),
                'label' => $r->street . ($r->unit ? ' (' . $r->unit . ')' : ''),
                'street' => $r->street,
                'unit' => $r->unit,
            ])
            ->values()
            ->toArray();

        return Inertia::render('admin/residents/create', [
            'streetOptions' => $streetOptions,
            'unitOptions' => $unitOptions,
            'addressOptions' => $addressOptions,
        ]);
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

        $streetOptions = Resident::whereNotNull('street')
            ->where('street', '!=', '')
            ->distinct()
            ->pluck('street')
            ->filter()
            ->values()
            ->toArray();

        $unitOptions = Resident::whereNotNull('unit')
            ->where('unit', '!=', '')
            ->distinct()
            ->pluck('unit')
            ->filter()
            ->values()
            ->toArray();

        $addressOptions = Resident::whereNotNull('street')
            ->where('street', '!=', '')
            ->select('street', 'unit')
            ->distinct()
            ->get()
            ->map(fn ($r) => [
                'value' => $r->street . ($r->unit ? '|' . $r->unit : ''),
                'label' => $r->street . ($r->unit ? ' (' . $r->unit . ')' : ''),
                'street' => $r->street,
                'unit' => $r->unit,
            ])
            ->values()
            ->toArray();

        return Inertia::render('admin/residents/edit', [
            'resident' => $residentModel,
            'streetOptions' => $streetOptions,
            'unitOptions' => $unitOptions,
            'addressOptions' => $addressOptions,
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
     * Approve a resident whose registration is pending verification.
     *
     * @param mixed $resident
     * @return RedirectResponse
     */
    public function approve(mixed $resident): RedirectResponse
    {
        $this->residentService->approveResident($resident);

        return redirect()->back()
            ->with('success', 'Resident verified and account approved.');
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

    /**
     * Export residents to CSV.
     *
     * @param GetResidentsRequest $request
     * @return StreamedResponse
     */
    public function exportCsv(GetResidentsRequest $request): StreamedResponse
    {
        $filters = $request->validated();
        $residents = Resident::when($filters['search'] ?? null, function ($query, $search) {
                $query->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%");
            })
            ->when($filters['resident_type'] ?? null, fn($q, $type) => $q->where('resident_type', $type))
            ->when($filters['status'] ?? null, fn($q, $status) => $q->where('status', $status))
            ->latest()
            ->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="resident_registry_' . date('Y-m-d') . '.csv"',
        ];

        $callback = function () use ($residents) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Last Name', 'First Name', 'Type', 'Phase', 'Block', 'Lot', 'Status', 'Email', 'Phone']);

            foreach ($residents as $res) {
                fputcsv($file, [
                    $res->id,
                    $res->last_name,
                    $res->first_name,
                    $res->resident_type->value,
                    $res->phase,
                    $res->block,
                    $res->lot,
                    $res->status->value,
                    $res->email,
                    $res->phone_number,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
