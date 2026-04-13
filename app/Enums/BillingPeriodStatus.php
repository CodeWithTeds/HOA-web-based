<?php

namespace App\Enums;

enum BillingPeriodStatus: string
{
    case OPEN = 'Open';
    case CLOSED = 'Closed';
}
