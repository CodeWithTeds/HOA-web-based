<?php

namespace App\Enums;

enum ResidentType: string
{
    case OWNER = 'Owner';
    case TENANT = 'Tenant';
    case FAMILY_MEMBER = 'Family Member';
    case HELPER = 'Helper';
}
