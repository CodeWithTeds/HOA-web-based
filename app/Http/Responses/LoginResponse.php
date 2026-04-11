<?php

namespace App\Http\Responses;

use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use App\Enums\UserRole;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $role = Auth::user()->role;
        
        $home = match ($role) {
            UserRole::ADMIN => '/admin/dashboard',
            UserRole::STAFF => '/staff/dashboard',
            UserRole::HOMEOWNER => '/dashboard',
            default => '/dashboard',
        };

        return $request->wantsJson()
                    ? response()->json(['two_factor' => false])
                    : redirect()->intended($home);
    }
}
