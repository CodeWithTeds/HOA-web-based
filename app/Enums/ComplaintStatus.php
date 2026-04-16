<?php

namespace App\Enums;

enum ComplaintStatus: string
{
    case PENDING = 'pending';
    case IN_PROGRESS = 'in_progress';
    case RESOLVED = 'resolved';
    case CLOSED = 'closed';

    public static function default(): string
    {
        return self::PENDING->value;
    }
}
