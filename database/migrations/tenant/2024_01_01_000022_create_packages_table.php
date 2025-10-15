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
        Schema::create('packages', function (Blueprint $table) {
            $table->uuid('package_id')->primary();
            $table->string('package_name');
            $table->text('package_description')->nullable();
            $table->decimal('package_price', 10, 2);
            $table->enum('package_status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            // $table->index(['package_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
