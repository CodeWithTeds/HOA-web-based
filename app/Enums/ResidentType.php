<?php

namespace App\Enums;

enum ResidentType: string
{
    case OWNER = 'Owner';
    case TENANT = 'Tenant';
}
