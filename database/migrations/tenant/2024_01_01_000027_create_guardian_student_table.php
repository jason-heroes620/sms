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
        Schema::create('guardian_student', function (Blueprint $table) {
            $table->uuid('guardian_student_id')->primary();
            $table->uuid('guardian_id');
            $table->uuid('student_id');
            $table->string('relationship', 50);
            $table->timestamps();

            // $table->foreign('guardian_id')->references('guardian_id')->on('guardians')->onDelete('cascade');
            // $table->foreign('student_id')->references('student_id')->on('students')->onDelete('cascade');
            // $table->unique(['guardian_id', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guardian_student');
    }
};
