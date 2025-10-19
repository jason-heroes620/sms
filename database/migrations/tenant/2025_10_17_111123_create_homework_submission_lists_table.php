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
        Schema::create('homework_submission_lists', function (Blueprint $table) {
            $table->uuid('homework_submission_list_id')->primary();
            $table->uuid('homework_submission_id');
            $table->string('file_path');
            $table->enum('submission_status', ['pending', 'approved', 'rejected']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('homework_submission_lists');
    }
};
