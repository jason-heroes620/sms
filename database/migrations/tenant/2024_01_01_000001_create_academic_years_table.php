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
        Schema::create('academic_years', function (Blueprint $table) {
            $table->uuid('academic_year_id')->primary();
            $table->string('academic_year', 30);
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('is_current', ['true', 'false'])->default('false');
            $table->string('created_by', 36);
            $table->timestamps();

            // $table->index(['is_current']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_years');
    }
};
