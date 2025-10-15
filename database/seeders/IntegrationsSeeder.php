<?php

namespace Database\Seeders;

use App\Models\Tenant\Integrations;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IntegrationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Integrations::create([
            'integration' => 'payroll_panda',
            'api_link' => 'https://web-api.app2.payrollpanda.my',
            'integration_status' => 'disabled',
        ]);

        Integrations::create([
            'integration' => 'jibble',
            'api_link' => 'https://workspace.prod.jibble.io',
            'integration_status' => 'disabled',
        ]);

        Integrations::create([
            'integration' => 'bukku',
            'api_link' => 'https://api.bukku.fyi',
            'integration_status' => 'disabled',
        ]);
    }
}
