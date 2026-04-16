<?php

namespace App\Enums;

enum ComplaintPriority: string
{
    case LOW = 'low';
    case MEDIUM = 'medium';
    case HIGH = 'high';
    case URGENT = 'urgent';

    public static function default(): string
    {
        return self::LOW->value;
    }
}
