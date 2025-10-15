<?php

namespace App\Services;

use App\Models\User;
use App\Models\Tenant;
use App\Models\Tenant\User as TenantUser;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class TenantAuthService
{
    public function authenticateForTenant(string $email, string $password, Tenant $tenant)
    {
        // First, try tenant user authentication
        $tenantUser = TenantUser::where('email', $email)->first();

        if ($tenantUser && Hash::check($password, $tenantUser->password)) {
            Auth::guard('tenant')->login($tenantUser);
            return ['type' => 'tenant', 'user' => $tenantUser];
        }

        // Then, try central user with tenant access
        $centralUser = User::where('email', $email)->first();

        if ($centralUser && Hash::check($password, $centralUser->password)) {
            if ($centralUser->hasAccessToTenant($tenant)) {
                Auth::guard('web')->login($centralUser);
                return ['type' => 'central', 'user' => $centralUser];
            }
        }

        return null;
    }

    public function createTenantUser(array $data, Tenant $tenant): TenantUser
    {
        tenancy()->initialize($tenant);

        return TenantUser::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'] ?? 'user',
            'department' => $data['department'] ?? null,
            'phone' => $data['phone'] ?? null,
            'central_user_id' => $data['central_user_id'] ?? null,
        ]);
    }

    public function inviteCentralUserToTenant(User $user, Tenant $tenant, string $role = 'user'): void
    {
        $tenant->users()->attach($user->id, [
            'role' => $role,
            'is_active' => true,
            'invited_at' => now(),
            'joined_at' => now(),
        ]);
    }

    public function getCurrentUser()
    {
        if (tenancy()->initialized) {
            // Try tenant user first
            if (Auth::guard('tenant')->check()) {
                return [
                    'type' => 'tenant',
                    'user' => Auth::guard('tenant')->user(),
                    'guard' => 'tenant'
                ];
            }

            // Then central user
            if (Auth::guard('web')->check()) {
                $user = Auth::guard('web')->user();
                if ($user->hasAccessToTenant(tenant())) {
                    return [
                        'type' => 'central',
                        'user' => $user,
                        'guard' => 'web',
                        'tenant_role' => $user->getTenantRole(tenant())
                    ];
                }
            }
        } else {
            // Central application
            if (Auth::guard('web')->check()) {
                return [
                    'type' => 'central',
                    'user' => Auth::guard('web')->user(),
                    'guard' => 'web'
                ];
            }
        }

        return null;
    }
}
