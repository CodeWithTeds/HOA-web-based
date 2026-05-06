<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAnnouncementRequest;
use App\Http\Requests\Admin\UpdateAnnouncementRequest;
use App\Http\Resources\AnnouncementResource;
use App\Repositories\Announcement\AnnouncementRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    /**
     * AnnouncementController constructor.
     *
     * @param AnnouncementRepositoryInterface $announcementRepository
     */
    public function __construct(
        protected AnnouncementRepositoryInterface $announcementRepository
    ) {}

    /**
     * Display a listing of the announcements.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'category', 'status', 'priority']);
        $announcements = $this->announcementRepository->getPaginated(10, $filters);

        return Inertia::render('admin/announcements/index', [
            'announcements' => AnnouncementResource::collection($announcements),
            'filters' => $filters,
        ]);
    }   
    

    /**
     * Show the form for creating a new announcement.
     *
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('admin/announcements/create');
    }

    /**
     * Store a newly created announcement in storage.
     *
     * @param StoreAnnouncementRequest $request
     * @return RedirectResponse
     */
    public function store(StoreAnnouncementRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['author_id'] = auth()->id();

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('announcements', 'public');
        }

        $this->announcementRepository->create($data);

        return redirect()->route('admin.announcements.index')
            ->with('success', 'Announcement posted successfully.');
    }

    /**
     * Show the form for editing the specified announcement.
     *
     * @param int $id
     * @return Response
     */
    public function edit(int $id): Response
    {
        $announcement = $this->announcementRepository->find($id);

        return Inertia::render('admin/announcements/edit', [
            'announcement' => new AnnouncementResource($announcement),
        ]);
    }

    /**
     * Update the specified announcement in storage.
     *
     * @param UpdateAnnouncementRequest $request
     * @param int $id
     * @return RedirectResponse
     */
    public function update(UpdateAnnouncementRequest $request, int $id): RedirectResponse
    {
        $announcement = $this->announcementRepository->find($id);
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('announcements', 'public');
        }

        $this->announcementRepository->update($announcement, $data);

        return redirect()->route('admin.announcements.index')
            ->with('success', 'Announcement updated successfully.');
    }

    /**
     * Remove the specified announcement from storage.
     *
     * @param int $id
     * @return RedirectResponse
     */
    public function destroy(int $id): RedirectResponse
    {
        $announcement = $this->announcementRepository->find($id);
        $this->announcementRepository->delete($announcement);

        return redirect()->route('admin.announcements.index')
            ->with('success', 'Announcement deleted successfully.');
    }
}
