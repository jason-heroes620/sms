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
        Schema::create('assessments', function (Blueprint $table) {
            $table->uuid('assessment_id')->primary();
            $table->uuid('class_student_id');
            $table->text('comments');
            $table->date('assessment_date');
            $table->enum('assessment_status', ['scheduled', 'completed', 'cancelled'])->default('completed');
            $table->uuid('created_by');
            $table->timestamps();

            // $table->foreign('class_id')->references('class_id')->on('classes')->onDelete('cascade');
            // $table->foreign('subject_id')->references('subject_id')->on('subjects')->onDelete('cascade');
            // $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');

            // $table->index(['class_id', 'subject_id']);
            // $table->index(['assessment_date']);
            // $table->index(['assessment_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessments');
    }
};
