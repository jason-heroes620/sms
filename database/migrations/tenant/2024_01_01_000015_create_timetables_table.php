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
        Schema::create('timetables', function (Blueprint $table) {
            $table->uuid('timetable_id')->primary();
            $table->uuid('academic_year_id');
            $table->uuid('branch_id');
            $table->boolean('is_publish')->default('false');
            $table->uuid('created_by');
            $table->timestamps();

            // $table->foreign('class_id')->references('class_id')->on('classes')->onDelete('cascade');
            // $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');

            // $table->index(['class_id']);
            // $table->index(['status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timetables');
    }
};
