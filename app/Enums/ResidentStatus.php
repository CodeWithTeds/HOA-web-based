<?php

namespace App\Enums;

enum ResidentStatus: string
{
    case PENDING = 'Pending';
    case ACTIVE = 'Active';
    case INACTIVE = 'Inactive';
    case BLACKLISTED = 'Blacklisted';
}
