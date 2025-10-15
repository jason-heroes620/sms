<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class IdentifyTenant
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Extract subdomain
        $host = $request->getHost();
        $parts = explode('.', $host);

        // For domain like "acme.yourapp.com", subdomain = "acme"
        $subdomain = count($parts) > 2 ? $parts[0] : null;

        if (!$subdomain || $subdomain === 'www') {
            abort(404, 'Tenant not found.');
        }

        // Query landlord DB
        $tenant = Tenant::where('domain', $host)->first();

        if (!$tenant) {
            abort(404, 'Tenant not found.');
        }

        // Switch tenant DB connection
        Config::set('database.connections.tenant.database', $tenant->database);

        // Reconnect to apply changes
        DB::purge('tenant');
        DB::reconnect('tenant');

        // Optional: Bind tenant to app for global access
        App::instance('currentTenant', $tenant);

        return $next($request);
    }
}
