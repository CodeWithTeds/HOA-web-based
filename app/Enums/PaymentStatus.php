<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case PENDING = 'Pending';
    case VERIFIED = 'Verified';
    case REJECTED = 'Rejected';
}
