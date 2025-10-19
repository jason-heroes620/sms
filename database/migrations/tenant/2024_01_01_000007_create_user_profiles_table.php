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
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->uuid('user_profile_id')->primary();
            $table->string('user_id', 36);
            $table->uuid('payroll_id')->nullable();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('email', 150);
            $table->string('contact_no', 20);
            $table->json('address');
            $table->string('profile_picture')->nullable();
            $table->enum('gender', ['M', 'F']);
            $table->string('race', 50);
            $table->date('dob');
            $table->string('residential_status', 50);
            $table->string('nic', 20);
            $table->string('passport', 50)->nullable();
            $table->string('marital_status', 20);
            $table->string('ability_status')->nullable();
            $table->date('employment_date');
            $table->json('spouse_info')->nullable();
            $table->enum('user_status', ['active', 'inactive'])->default('active');
            $table->uuid('payroll_employee_id')->nullable();
            $table->uuid('position_id')->nullable();
            $table->uuid('branch_id');
            $table->timestamps();

            // // $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            // $table->index(['user_id']);
            // $table->index(['user_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
