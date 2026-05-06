<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Http\Requests\Resident\StoreComplaintRequest;
use App\Http\Resources\ComplaintResource;
use App\Models\Resident;
use App\Enums\ComplaintStatus;
use App\Repositories\Complaint\ComplaintRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ComplaintController extends Controller
{
    public function __construct(
        protected ComplaintRepositoryInterface $complaintRepository
    ) {}

    public function index(): Response
    {
        $resident = Resident::where('email', Auth::user()->email)->first();

        $complaints = $resident
            ? $this->complaintRepository->getByResident($resident->id, 10)
            : collect()->paginate(10);

        return Inertia::render('Resident/complaints/index', [
            'complaints'       => ComplaintResource::collection($complaints),
            'residentNotLinked' => !$resident,
        ]);
    }

    public function store(StoreComplaintRequest $request)
    {
        $resident = Resident::where('email', Auth::user()->email)->first();

        if (!$resident) {
            return back()->withErrors(['resident' => 'Your account is not linked to a resident profile.']);
        }

        $data = $request->validated();
        $data['resident_id'] = $resident->id;
        $data['status']      = ComplaintStatus::PENDING->value;

        if ($request->hasFile('image')) {
            $data['attachment_path'] = $request->file('image')->store('complaints', 'public');
        }

        $this->complaintRepository->create($data);

        return back()->with('success', 'Your complaint has been submitted successfully. Our team will review it shortly.');
    }
}
