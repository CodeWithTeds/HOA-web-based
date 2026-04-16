<?php

namespace App\Enums;

enum AnnouncementStatus: string
{
    case PRIVATE = 'private';
    case PUBLISHED = 'published';
    case ARCHIVED = 'archived';

    public static function default(): string
    {
        return self::PRIVATE->value;
    }
}
