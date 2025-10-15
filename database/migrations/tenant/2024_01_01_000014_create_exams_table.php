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
        Schema::create('exams', function (Blueprint $table) {
            $table->uuid('exam_id')->primary();
            $table->string('exam_name');
            $table->text('exam_description')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->uuid('class_id')->nullable();
            $table->uuid('subject_id')->nullable();
            $table->string('created_by');
            $table->timestamps();

            // $table->foreign('class_id')->references('class_id')->on('classes')->onDelete('set null');
            // $table->foreign('subject_id')->references('subject_id')->on('subjects')->onDelete('set null');
            // $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');

            // $table->index(['start_date', 'end_date']);
            // $table->index(['class_id', 'subject_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
