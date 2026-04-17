<?php

namespace App\Enums\Chat;

enum MessageStatus: string
{
    case SENT = 'sent';
    case READ = 'read';
    case FAILED = 'failed';
}
