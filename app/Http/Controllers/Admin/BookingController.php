<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Models\Facility;
use App\Models\FacilityBooking;
use App\Models\Resident;
use App\Services\Facility\FacilityService;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function __construct(
        protected FacilityService $service
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/facilities/bookings', [
            'bookings' => $this->service->getBookings(),
            'facilities' => $this->service->getFacilities(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/facilities/bookings/create', [
            'residents' => Resident::select('id', 'first_name', 'last_name')->get(),
            'facilities' => Facility::all(),
        ]);
    }

    public function store(StoreBookingRequest $request)
    {
        try {
            $this->service->createBooking($request->validated());
            return redirect()->route('admin.bookings.index')->with('success', 'Booking created successfully.');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function updateStatus(int $id, Request $request)
    {
        $request->validate([
            'status' => 'required|string|in:Confirmed,Cancelled,Pending',
        ]);

        FacilityBooking::where('id', $id)->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Booking status updated successfully.');
    }
}
