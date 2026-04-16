<?php

namespace App\Enums;

enum ComplaintCategory: string
{
    case MAINTENANCE = 'maintenance';
    case NOISE = 'noise';
    case SECURITY = 'security';
    case PETS = 'pets';
    case OTHERS = 'others';

    public static function default(): string
    {
        return self::MAINTENANCE->value;
    }
}
