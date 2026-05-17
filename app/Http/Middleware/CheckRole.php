<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! $request->user()) {
            return redirect()->route('login');
        }

        if (! in_array($request->user()->role->value, $roles, true)) {
            if (! $request->isMethod('get')) {
                abort(403);
            }

            $dashboard = match ($request->user()->role) {
                UserRole::ADMIN => route('admin.dashboard'),
                UserRole::STAFF => route('staff.dashboard'),
                default => route('dashboard'),
            };

            return redirect($dashboard);
        }

        return $next($request);
    }
}
