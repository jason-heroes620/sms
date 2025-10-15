<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration {

    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('name');           // Tenant name (e.g., Acme Inc)
            $table->string('domain')->unique(); // e.g., acme.yourapp.com
            $table->string('database');       // e.g., tenant_acme
            $table->string('db_username');
            $table->string('db_password');
            $table->json('data')->nullable(); // extra config
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
