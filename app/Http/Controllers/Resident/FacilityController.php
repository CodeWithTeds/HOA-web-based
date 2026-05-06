<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Services\Facility\FacilityService;
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

    public function storeBooking(Request $request)
    {
        $request->validate([
            'facility_id' => 'required|exists:facilities,id',
            'start_time' => 'required|date|after_or_equal:now',
            'end_time' => 'required|date|after:start_time',
        ]);

        $data = $request->only(['facility_id', 'start_time', 'end_time']);
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
