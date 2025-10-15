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
        Schema::create('subjects', function (Blueprint $table) {
            $table->uuid('subject_id')->primary();
            $table->string('subject_name');
            $table->text('subject_description')->nullable();
            $table->enum('subject_status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            // $table->index(['subject_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subjects');
    }
};
