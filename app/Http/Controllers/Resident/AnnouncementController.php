<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Http\Resources\AnnouncementResource;
use App\Repositories\Announcement\AnnouncementRepositoryInterface;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function __construct(
        protected AnnouncementRepositoryInterface $announcementRepository
    ) {}

    public function index(): Response
    {
        $announcements = $this->announcementRepository->getForResidents(15);

        return Inertia::render('Resident/announcements/index', [
            'announcements' => AnnouncementResource::collection($announcements),
        ]);
    }
}
