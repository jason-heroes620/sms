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
        Schema::create('students', function (Blueprint $table) {
            $table->uuid('student_id')->primary();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->enum('gender', ['M', 'F']);
            $table->date('dob');
            $table->string('registration_no', 50);
            $table->date('admission_date');
            $table->string('nic', 20)->nullable();
            $table->string('profile_picture')->nullable();
            $table->string('religion', 20)->nullable();
            $table->string('race', 20)->nullable();
            $table->enum('student_status', ['active', 'inactive', 'graduated', 'transferred'])->default('active');
            $table->timestamps();

            // $table->index(['student_status']);
            // $table->index(['registration_no']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
