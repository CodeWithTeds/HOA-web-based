<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreComplaintRequest;
use App\Http\Requests\Admin\UpdateComplaintRequest;
use App\Http\Resources\ComplaintResource;
use App\Repositories\Complaint\ComplaintRepositoryInterface;
use App\Enums\ComplaintStatus;
use App\Enums\UserRole;
use App\Models\Resident;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    protected $complaintRepository;

    public function __construct(ComplaintRepositoryInterface $complaintRepository)
    {
        $this->complaintRepository = $complaintRepository;
    }

    public function index(Request $request)
    {
        $complaints = $this->complaintRepository->getPaginated(10, $request->all());

        return Inertia::render('admin/complaints/index', [
            'complaints' => ComplaintResource::collection($complaints),
            'filters' => $request->only(['search', 'status', 'category', 'priority']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/complaints/create', [
            'residents' => $this->residentOptions(),
            'staff' => User::whereIn('role', [UserRole::ADMIN, UserRole::STAFF])->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreComplaintRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['attachment_path'] = $request->file('image')->store('complaints', 'public');
        }

        $this->complaintRepository->create($data);

        return redirect()->route('admin.complaints.index')->with('success', 'Complaint recorded successfully.');
    }

    public function edit($id)
    {
        $complaint = $this->complaintRepository->find($id);
        
        return Inertia::render('admin/complaints/edit', [
            'complaint' => new ComplaintResource($complaint),
            'residents' => $this->residentOptions(),
            'staff' => User::whereIn('role', [UserRole::ADMIN, UserRole::STAFF])->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateComplaintRequest $request, $id)
    {
        $data = $request->validated();
        $complaint = $this->complaintRepository->find($id);

        if ($request->hasFile('image')) {
            if ($complaint->attachment_path) {
                Storage::disk('public')->delete($complaint->attachment_path);
            }
            $data['attachment_path'] = $request->file('image')->store('complaints', 'public');
        }

        // Handle resolved_at timestamp
        if (isset($data['status']) && $data['status'] === ComplaintStatus::RESOLVED->value && $complaint->status !== ComplaintStatus::RESOLVED) {
            $data['resolved_at'] = now();
        }

        $this->complaintRepository->update($complaint, $data);

        return redirect()->route('admin.complaints.index')->with('success', 'Complaint updated successfully.');
    }

    public function show($id)
    {
        $complaint = $this->complaintRepository->find($id);

        return Inertia::render('admin/complaints/show', [
            'complaint' => new ComplaintResource($complaint),
        ]);
    }

    public function destroy($id)
    {
        $complaint = $this->complaintRepository->find($id);
        if ($complaint->attachment_path) {
            Storage::disk('public')->delete($complaint->attachment_path);
        }
        
        $this->complaintRepository->delete($complaint);

        return redirect()->route('admin.complaints.index')->with('success', 'Complaint deleted successfully.');
    }

    private function residentOptions()
    {
        return Resident::query()
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'middle_name', 'last_name', 'suffix', 'resident_type'])
            ->map(fn (Resident $resident) => [
                'id' => $resident->id,
                'name' => $resident->full_name,
                'type' => $resident->resident_type?->value,
            ]);
    }
}
