<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Facility extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'capacity',
        'base_price',
        'price_type',
        'status',
        'image_path',
    ];

    public function bookings(): HasMany
    {
        return $this->hasMany(FacilityBooking::class);
    }

    public function amenities(): HasMany
    {
        return $this->hasMany(FacilityAmenity::class);
    }
}
