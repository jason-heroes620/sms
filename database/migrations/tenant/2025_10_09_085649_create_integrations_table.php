<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('integrations', function (Blueprint $table) {
            $table->uuid('integration_id')->primary();
            $table->string('integration', 50);
            $table->string('api_link', 150);
            $table->string('client_id', 200)->nullable();
            $table->string('client_secret', 200)->nullable();
            $table->text('token')->nullable();
            $table->string('subdomain', 100)->nullable();
            $table->enum('integration_status', ['enabled', 'disabled'])->default('enabled');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('integrations');
    }
};
