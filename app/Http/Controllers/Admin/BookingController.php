<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Services\Facility\FacilityService;
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

    public function store(StoreBookingRequest $request)
    {
        try {
            $this->service->createBooking($request->validated());
            return redirect()->back()->with('success', 'Booking created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
