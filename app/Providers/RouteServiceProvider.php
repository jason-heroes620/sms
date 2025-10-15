<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    public const HOME = '/home';

    public function boot(): void
    {


        $this->routes(function () {
            // Central routes
            // Route::middleware('api')
            //     ->prefix('api')
            //     ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->group(base_path('routes/web.php'));

            // Tenant routes
            Route::middleware([
                'web',
                \App\Http\Middleware\IdentifyTenant::class,
            ])
                ->group(base_path('routes/tenant.php'));
        });
    }
}
