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
        Schema::create('classes', function (Blueprint $table) {
            $table->uuid('class_id')->primary();
            $table->uuid('academic_year_id');
            $table->string('class_name');
            $table->text('class_description')->nullable();
            $table->enum('class_status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            // $table->foreign('academic_year_id')->references('academic_year_id')->on('academic_years')->onDelete('cascade');
            // $table->index(['class_status', 'academic_year_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};
