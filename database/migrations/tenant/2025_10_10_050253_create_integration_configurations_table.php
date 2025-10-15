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
        Schema::create('integration_configurations', function (Blueprint $table) {
            $table->uuid('configuration_id')->primary();
            $table->string('configuration_name', 50)->unique();
            $table->string('configuration_code', 20);
            $table->string('configuration_value', 20);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('integration_configurations');
    }
};
