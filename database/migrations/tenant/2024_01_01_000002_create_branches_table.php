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
        Schema::create('branches', function (Blueprint $table) {
            $table->uuid('branch_id')->primary();
            $table->string('branch_name', 150);
            $table->text('branch_address')->nullable();
            $table->string('branch_contact_no', 20)->nullable();
            $table->string('branch_email', 150)->nullable();
            $table->enum('branch_status', ['active', 'inactive'])->default('active');
            $table->string('created_by', 36);
            $table->string('payroll_location_id', 36)->nullable();
            $table->string('jibble_location_id', 36)->nullable();
            $table->text('location')->nullable();
            $table->timestamps();

            // $table->index(['branch_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('branches');
    }
};
