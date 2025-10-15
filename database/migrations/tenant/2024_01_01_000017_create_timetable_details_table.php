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
        Schema::create('timetable_details', function (Blueprint $table) {
            $table->uuid('timetable_detail_id')->primary();
            $table->uuid('timetable_id');
            $table->uuid('class_id');
            $table->uuid('section_id')->nullable();
            $table->uuid('subject_id');
            $table->enum('recurrence', ['once', 'daily', 'weekly', 'monthly'])->default('weekly');
            $table->json('days')->nullable(); // Store days of week as JSON
            $table->time('start_time');
            $table->time('end_time');
            $table->string('color')->default('#3498db');
            $table->uuid('created_by');
            $table->timestamps();

            // $table->foreign('timetable_id')->references('timetable_id')->on('timetables')->onDelete('cascade');
            // $table->foreign('class_id')->references('class_id')->on('classes')->onDelete('cascade');
            // $table->foreign('section_id')->references('section_id')->on('sections')->onDelete('set null');
            // $table->foreign('subject_id')->references('subject_id')->on('subjects')->onDelete('cascade');
            // $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');

            // $table->index(['class_id', 'subject_id']);
            // $table->index(['start_time', 'end_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timetable_details');
    }
};
