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
            $table->datetime('submission_date');
            $table->string('homework_path')->nullable();
            $table->text('comments')->nullable();
            $table->decimal('marks', 5, 2)->nullable();
            $table->uuid('commented_by')->nullable();
            $table->timestamps();

            // $table->foreign('homework_id')->references('homework_id')->on('homeworks')->onDelete('cascade');
            // $table->foreign('student_id')->references('student_id')->on('students')->onDelete('cascade');
            // $table->foreign('commented_by')->references('id')->on('users')->onDelete('set null');

            // $table->index(['homework_id', 'student_id']);
            // $table->index(['submission_date']);
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
