<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat.resident.{residentId}', function ($user, $residentId) {
    // Resident can listen to their own channel
    if ((int) $user->id === (int) $residentId) {
        return true;
    }

    // Admin and Staff can listen to any resident channel
    return in_array($user->role->value, ['admin', 'staff']);
});
