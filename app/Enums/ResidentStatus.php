<?php

namespace App\Enums;

enum ResidentStatus: string
{
    case ACTIVE = 'Active';
    case INACTIVE = 'Inactive';
    case BLACKLISTED = 'Blacklisted';
}
