<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Services\Facility\FacilityService;
use App\Http\Requests\StoreResidentBookingRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class FacilityController extends Controller
{
    public function __construct(
        protected FacilityService $facilityService
    ) {}

    public function index()
    {
        $facilities = $this->facilityService->getFacilities();
        
        return Inertia::render('Resident/facilities/index', [
            'facilities' => $facilities,
        ]);
    }

    public function storeBooking(StoreResidentBookingRequest $request)
    {
        $data = $request->validated();
        $data['resident_id'] = Auth::id();
        $data['status'] = 'Pending';
        $data['admin_notes'] = '';

        try {
            $this->facilityService->createBooking($data);
            return back()->with('success', 'Facility booking request submitted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['conflict' => $e->getMessage()]);
        }
    }
}
