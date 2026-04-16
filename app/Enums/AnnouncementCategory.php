<?php

namespace App\Enums;

enum AnnouncementCategory: string
{
    case GENERAL = 'general';
    case MAINTENANCE = 'maintenance';
    case EMERGENCY = 'emergency';
    case EVENT = 'event';

    public static function default(): string
    {
        return self::GENERAL->value;
    }
}
