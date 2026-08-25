<?php

namespace App\Models;

use App\Enums\StaffRole;
use App\Enums\StaffStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Staff extends Authenticatable
{
    use HasFactory, HasUuids, Notifiable, SoftDeletes;

    protected $fillable = [
        'profile_picture',
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'role',
        'department',
        'status',
        'hire_date',
        'created_by',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'role' => StaffRole::class,
        'status' => StaffStatus::class,
        'hire_date' => 'datetime',
        'password' => 'hashed',
    ];
}
