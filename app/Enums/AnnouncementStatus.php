<?php

namespace App\Enums;

enum AnnouncementStatus: string
{
    case DRAFT = 'draft';
    case PUBLISHED = 'published';
    case ARCHIVED = 'archived';

    public static function default(): string
    {
        return self::DRAFT->value;
    }
}
