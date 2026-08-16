<?php

namespace App\Http\Responses;

use App\Enums\ResidentStatus;
use App\Enums\UserRole;
use App\Models\Resident;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request)
    {
        $user = Auth::user();
        $resident = $user ? Resident::where('email', $user->email)->first() : null;

        if ($resident && $resident->status === ResidentStatus::PENDING) {
            Auth::guard('web')->logout();

            return redirect()->route('login')->with('status', __('Your owner registration is pending verification. The HOA administrator must approve your account before you can sign in.'));
        }

        $home = match ($user?->role) {
            UserRole::ADMIN => '/admin/dashboard',
            UserRole::STAFF => '/staff/dashboard',
            UserRole::HOMEOWNER => '/dashboard',
            default => '/dashboard',
        };

        return $request->wantsJson()
            ? response()->json(['two_factor' => false])
            : redirect($home);
    }
}
