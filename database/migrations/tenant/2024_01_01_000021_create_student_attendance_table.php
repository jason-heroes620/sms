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
        Schema::create('student_attendance', function (Blueprint $table) {
            $table->uuid('attendance_id')->primary();
            $table->uuid('student_id');
            $table->uuid('class_id');
            $table->date('attendance_date');
            $table->enum('status', ['present', 'absent', 'late', 'excused'])->default('present');
            $table->text('remarks')->nullable();
            $table->uuid('recorded_by');
            $table->timestamps();

            // $table->foreign('student_id')->references('student_id')->on('students')->onDelete('cascade');
            // $table->foreign('class_id')->references('class_id')->on('classes')->onDelete('cascade');
            // $table->foreign('recorded_by')->references('id')->on('users')->onDelete('cascade');

            // $table->unique(['student_id', 'class_id', 'attendance_date']);
            // $table->index(['attendance_date', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_attendance');
    }
};
