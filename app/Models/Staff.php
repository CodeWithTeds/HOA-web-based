<?php

namespace App\Models;

use App\Enums\StaffRole;
use App\Enums\StaffStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'profile_picture',
        'first_name',
        'last_name',
        'email',
        'phone',
        'role',
        'department',
        'status',
        'hire_date',
        'created_by',
    ];

    protected $casts = [
        'role' => StaffRole::class,
        'status' => StaffStatus::class,
        'hire_date' => 'datetime',
    ];
}
