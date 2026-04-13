<?php

namespace App\Models;

use App\Enums\BillingPeriodStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BillingPeriod extends Model
{
    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'due_date',
        'amount',
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
