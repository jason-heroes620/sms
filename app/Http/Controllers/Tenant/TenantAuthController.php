<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Services\TenantAuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(TenantAuthService $authService)
    {
        $this->authService = $authService;
    }

    public function showLoginForm()
    {
        $tenant = tenant();
        return view('tenant.auth.login', compact('tenant'));
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $tenant = tenant();
        $auth = $this->authService->authenticateForTenant(
            $request->email,
            $request->password,
            $tenant
        );

        if ($auth) {
            $request->session()->regenerate();

            return redirect()->intended(route('tenant.dashboard'));
        }

        return back()->withErrors([
            'email' => 'Invalid credentials or no access to this tenant.',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('tenant')->logout();
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('tenant.login');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:tenant.users',
            'password' => 'required|string|min:8|confirmed',
            'department' => 'nullable|string|max:255',
        ]);

        $user = $this->authService->createTenantUser([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'department' => $request->department,
        ], tenant());

        Auth::guard('tenant')->login($user);

        return redirect()->route('tenant.dashboard');
    }
}
