<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Services\Facility\FacilityService;
use App\Http\Requests\StoreResidentBookingRequest;
use App\Models\FacilityBooking;
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
        $hasPendingBooking = FacilityBooking::where('resident_id', Auth::id())
            ->where('status', 'Pending')
            ->exists();
        
        return Inertia::render('Resident/facilities/index', [
            'facilities' => $facilities,
            'hasPendingBooking' => $hasPendingBooking,
        ]);
    }

    public function storeBooking(StoreResidentBookingRequest $request)
    {
        $hasPendingBooking = FacilityBooking::where('resident_id', Auth::id())
            ->where('status', 'Pending')
            ->exists();

        if ($hasPendingBooking) {
            return back()->withErrors(['conflict' => 'You already have a pending facility booking. You can only book once your previous booking is approved or completed.']);
        }

        $data = $request->validated();
        $data['resident_id'] = Auth::id();
        $data['status'] = 'Pending';
        $data['admin_notes'] = '';

        try {
            $this->facilityService->createBooking($data);
            return back()->with('success', 'Facility booking request submitted successfully! Please proceed to the billing page to complete your payment.');
        } catch (\Exception $e) {
            return back()->withErrors(['conflict' => $e->getMessage()]);
        }
    }
}
