<?php

namespace App\Enums\Chat;

enum MessageSenderType: string
{
    case HOMEOWNER = 'homeowner';
    case ADMIN = 'admin';
    case STAFF = 'staff';
}
