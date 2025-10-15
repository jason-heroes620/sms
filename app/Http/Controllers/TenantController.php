<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Artisan;

class TenantController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:tenants',
            'subdomain' => 'required|string|max:255|unique:domains,domain',
            'plan' => 'nullable|string',
        ]);

        // Create tenant
        $tenant = Tenant::create([
            'id' => Str::uuid(),
            'name' => $request->name,
            'email' => $request->email,
            'plan' => $request->plan ?? 'basic',
            'data' => [
                'created_at' => now(),
            ],
        ]);

        // Create domain
        $tenant->domains()->create([
            'domain' => $request->subdomain . '.' . config('app.domain'),
        ]);

        // Run tenant migrations
        tenancy()->initialize($tenant);
        Artisan::call('migrate', ['--database' => 'tenant']);

        return response()->json([
            'message' => 'Tenant created successfully',
            'tenant' => $tenant,
            'url' => 'https://' . $request->subdomain . '.' . config('app.domain'),
        ]);
    }

    public function index()
    {
        $tenants = Tenant::with('domains')->get();
        return response()->json($tenants);
    }

    public function destroy(Tenant $tenant)
    {
        tenancy()->initialize($tenant);

        // Drop tenant database
        Artisan::call('tenants:drop-database', ['--tenant' => $tenant->id]);

        // Delete tenant
        $tenant->delete();

        return response()->json(['message' => 'Tenant deleted successfully']);
    }
}
