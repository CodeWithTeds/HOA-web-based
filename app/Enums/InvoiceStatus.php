<?php

namespace App\Enums;

enum InvoiceStatus: string
{
    case UNPAID = 'Unpaid';
    case PARTIALLY_PAID = 'Partially Paid';
    case PAID = 'Paid';
    case OVERDUE = 'Overdue';
    case CANCELLED = 'Cancelled';
}
