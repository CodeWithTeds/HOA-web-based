<?php

namespace App\Enums;

enum FacilityStatus: string
{
    case ACTIVE = 'Active';
    case UNDER_MAINTENANCE = 'Under Maintenance';
    case DEACTIVATED = 'Deactivated';
}
