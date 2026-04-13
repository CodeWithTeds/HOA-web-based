<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GetResidentsRequest;
use App\Services\Resident\ResidentService;
use Inertia\Inertia;
use Inertia\Response;

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
}
