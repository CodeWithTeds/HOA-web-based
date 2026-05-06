<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacilityBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'resident_id',
        'facility_id',
        'start_time',
        'end_time',
        'total_fee',
        'status',
        'admin_notes',
        'purpose',
        'attendees',
        'special_requests',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class);
    }
}
