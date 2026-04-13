<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case CASH = 'Cash';
    case BANK_TRANSFER = 'Bank Transfer';
    case GCASH = 'GCash';
    case CHECK = 'Check';
}
