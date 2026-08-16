<?php

namespace App\Models;

use App\Enums\CivilStatus;
use App\Enums\Gender;
use App\Enums\ResidentStatus;
use App\Enums\ResidentType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resident extends Model
{
    use HasFactory;

    protected $appends = [
        'full_name',
        'name',
    ];

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'gender',
        'birth_date',
        'age',
        'civil_status',
        'nationality',
        'mobile_number',
        'alternate_number',
        'email',
        'phase',
        'block',
        'lot',
        'street',
        'unit',
        'resident_type',
        'move_in_date',
        'move_out_date',
        'emergency_contact_name',
        'emergency_contact_number',
        'status',
        'remarks',
    ];

    protected $casts = [
        'gender' => Gender::class,
        'civil_status' => CivilStatus::class,
        'resident_type' => ResidentType::class,
        'status' => ResidentStatus::class,
        'birth_date' => 'date',
        'move_in_date' => 'date',
        'move_out_date' => 'date',
    ];

    public function getFullNameAttribute(): string
    {
        return collect([
            $this->first_name,
            $this->middle_name,
            $this->last_name,
            $this->suffix,
        ])->filter()->implode(' ');
    }

    public function getNameAttribute(): string
    {
        return $this->full_name;
    }
}
