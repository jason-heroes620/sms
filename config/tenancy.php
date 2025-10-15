<?php

return [
    'tenant_model' => \App\Models\Tenant::class,
    'id_generator' => Stancl\Tenancy\UUIDGenerator::class,

    'domain_model' => \Stancl\Tenancy\Database\Models\Domain::class,

    'central_domains' => [
        'localhost',
        '127.0.0.1',
        env('APP_DOMAIN', 'central.localhost'),
    ],

    'database' => [
        'central_connection' => env('DB_CONNECTION', 'mysql'),
        'template_tenant_connection' => 'tenant',
        'prefix' => 'tenant',
        'suffix' => '',
    ],

    'cache' => [
        'tag_base' => 'tenant',
    ],

    'features' => [
        Stancl\Tenancy\Features\UserImpersonation::class,
        Stancl\Tenancy\Features\CrossDomainRedirect::class,
        Stancl\Tenancy\Features\UniversalRoutes::class,
        Stancl\Tenancy\Features\TenantConfig::class,
    ],

    'migration_parameters' => [
        '--force' => true,
    ],
];
