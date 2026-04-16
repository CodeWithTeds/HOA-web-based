<?php

namespace App\Enums;

enum AnnouncementPriority: string
{
    case NORMAL = 'normal';
    case IMPORTANT = 'important';
    case URGENT = 'urgent';

    public static function default(): string
    {
        return self::NORMAL->value;
    }
}
