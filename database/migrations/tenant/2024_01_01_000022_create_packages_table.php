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
            $table->string('package_name', 100);
            $table->text('package_description')->nullable();
            $table->decimal('package_price', 10, 2);
            $table->date('effective_start_date');
            $table->date('effective_end_date')->nullable();
            $table->boolean('package_type')->default(false);
            $table->string('frequency', 20)->nullable();
            $table->enum('package_status', ['active', 'inactive'])->default('active');
            $table->string('created_by', 36);
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
