<?php

namespace App\Models;

use App\Enums\BillingPeriodStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class BillingPeriod extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'due_date',
        'amount',
        'description',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'due_date' => 'date',
        'amount' => 'decimal:2',
        'status' => BillingPeriodStatus::class,
    ];

    /**
     * Get the invoices for the billing period.
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }
}
