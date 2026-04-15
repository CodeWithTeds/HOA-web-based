<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFacilityRequest;
use App\Services\Facility\FacilityService;
use Inertia\Inertia;
use Inertia\Response;

class FacilityController extends Controller
{
    public function __construct(
        protected FacilityService $service
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/facilities/index', [
            'facilities' => $this->service->getFacilities(),
        ]);
    }

    public function store(StoreFacilityRequest $request)
    {
        $this->service->createFacility($request->validated());
        return redirect()->back()->with('success', 'Facility created successfully.');
    }

    public function update(StoreFacilityRequest $request, int $id)
    {
        $this->service->updateFacility($id, $request->validated());
        return redirect()->back()->with('success', 'Facility updated successfully.');
    }

    public function destroy(int $id)
    {
        $this->service->deleteFacility($id);
        return redirect()->back()->with('success', 'Facility deleted successfully.');
    }
}
