<?php

namespace App\Models;

use App\Enums\AnnouncementCategory;
use App\Enums\AnnouncementPriority;
use App\Enums\AnnouncementStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Announcement extends Model
{
    /** @use HasFactory<\Database\Factories\AnnouncementFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'author_id',
        'category',
        'priority',
        'status',
        'published_at',
        'image_path',
    ];

    protected function casts(): array
    {
        return [
            'category' => AnnouncementCategory::class,
            'priority' => AnnouncementPriority::class,
            'status' => AnnouncementStatus::class,
            'published_at' => 'datetime',
        ];
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
