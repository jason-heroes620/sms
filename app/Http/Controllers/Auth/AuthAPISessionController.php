<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Tenant\User;
use Illuminate\Http\Request;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Tenant\Integrations;
use App\Models\Tenant\UserProfiles;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthAPISessionController extends Controller
{
    public function store(Request $request)
    {
        Log::info($request);
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        $payroll = Integrations::where('integration', 'payroll_panda')->first();
        $jibble = Integrations::where('integration', 'jibble')->first();
        $user['payroll_employee_id'] = UserProfiles::where('user_id', $user->id)->first()->payroll_employee_id;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'payroll' => $payroll,
            'jibble' => $jibble,
        ]);
    }

    public function destroy(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
