<?php

namespace Database\Seeders;

use App\Models\Tenant\Roles;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        Permission::create(['name' => 'manage students']);
        Permission::create(['name' => 'view students']);

        Permission::create(['name' => 'manage fees']);
        Permission::create(['name' => 'view fees']);
        Permission::create(['name' => 'issue invoice']);

        Permission::create(['name' => 'manage academics']);
        Permission::create(['name' => 'view timetable']);

        Permission::create(['name' => 'manage branches']);

        Permission::create(['name' => 'manage attendance']);


        $accountant = Role::create(['name' => 'hr']);
        $accountant->givePermissionTo(['manage attendance']);

        $accountant = Role::create(['name' => 'account']);
        $accountant->givePermissionTo(['view fees', 'manage fees', 'issue invoice']);

        $teacher = Role::create(['name' => 'teacher']);
        $teacher->givePermissionTo(['view students', 'manage attendance', 'view timetable']);

        $admin = Role::create(['name' => 'administrator']);
        $admin->givePermissionTo(Permission::all());
    }
}
