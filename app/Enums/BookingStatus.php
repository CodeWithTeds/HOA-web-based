<?php

namespace App\Enums;

enum BookingStatus: string
{
    case PENDING = 'Pending';
    case CONFIRMED = 'Confirmed';
    case CANCELLED = 'Cancelled';
    case COMPLETED = 'Completed';
}
