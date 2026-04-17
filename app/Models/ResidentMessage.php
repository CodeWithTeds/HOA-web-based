<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Enums\Chat\MessageSenderType;
use App\Enums\Chat\MessageStatus;

class ResidentMessage extends Model
{
    protected $fillable = [
        'resident_id',
        'admin_id',
        'sender_type',
        'content',
        'is_read',
        'read_at',
        'attachments',
    ];

    protected function casts(): array
    {
        return [
            'sender_type' => MessageSenderType::class,
            'is_read' => 'boolean',
            'read_at' => 'datetime',
            'attachments' => 'array',
        ];
    }

    /**
     * The resident associated with the message.
     */
    public function resident(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resident_id');
    }

    /**
     * The admin associated with the message.
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
