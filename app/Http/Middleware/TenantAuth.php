<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\TenantAuthService;

class TenantAuth
{
    protected $authService;

    public function __construct(TenantAuthService $authService)
    {
        $this->authService = $authService;
    }

    public function handle(Request $request, Closure $next, $role = null)
    {
        if (!tenancy()->initialized) {
            return redirect()->route('login');
        }

        $currentUser = $this->authService->getCurrentUser();

        if (!$currentUser) {
            // return redirect()->route('tenant.login');
            return redirect('/login');
        }

        // Check role if specified
        if ($role) {
            $userRole = $currentUser['type'] === 'tenant'
                ? $currentUser['user']->role
                : ($currentUser['tenant_role'] ?? 'user');

            if (!$this->hasRole($userRole, $role)) {
                abort(403, 'Insufficient permissions');
            }
        }

        return $next($request);
    }

    private function hasRole(string $userRole, string $requiredRole): bool
    {
        $hierarchy = ['user' => 1, 'manager' => 2, 'admin' => 3];

        return ($hierarchy[$userRole] ?? 0) >= ($hierarchy[$requiredRole] ?? 0);
    }
}
