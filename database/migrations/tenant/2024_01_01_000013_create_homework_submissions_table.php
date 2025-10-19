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
        Schema::create('homework_submissions', function (Blueprint $table) {
            $table->uuid('homework_submission_id')->primary();
            $table->uuid('homework_id');
            $table->uuid('student_id');
            $table->text('comments')->nullable();
            $table->decimal('marks', 5, 2)->nullable();
            $table->uuid('commented_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('homework_submissions');
    }
};
