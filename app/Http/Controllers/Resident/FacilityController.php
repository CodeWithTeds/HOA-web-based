<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Services\Facility\FacilityService;
use App\Http\Requests\StoreResidentBookingRequest;
use App\Models\FacilityBooking;
use App\Models\Resident;
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

        // Look up the Resident record by the logged-in user's email
        $resident = Resident::where('email', Auth::user()->email)->first();

        $hasPendingBooking = $resident
            ? FacilityBooking::where('resident_id', $resident->id)
                ->where('status', 'Pending')
                ->exists()
            : false;
        
        return Inertia::render('Resident/facilities/index', [
            'facilities' => $facilities,
            'hasPendingBooking' => $hasPendingBooking,
            'residentNotLinked' => !$resident,
        ]);
    }

    public function storeBooking(StoreResidentBookingRequest $request)
    {
        // Look up the Resident record by the logged-in user's email
        $resident = Resident::where('email', Auth::user()->email)->first();

        if (!$resident) {
            return back()->withErrors(['conflict' => 'Your account is not linked to a resident profile. Please contact the HOA office.']);
        }

        $hasPendingBooking = FacilityBooking::where('resident_id', $resident->id)
            ->where('status', 'Pending')
            ->exists();

        if ($hasPendingBooking) {
            return back()->withErrors(['conflict' => 'You already have a pending facility booking. You can only book once your previous booking is approved or completed.']);
        }

        $data = $request->validated();
        $data['resident_id'] = $resident->id;  // Use actual Resident ID, not User ID
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
