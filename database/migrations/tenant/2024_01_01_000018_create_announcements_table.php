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
        Schema::create('announcements', function (Blueprint $table) {
            $table->uuid('announcement_id')->primary();
            $table->string('title');
            $table->text('short_description')->nullable();
            $table->longText('description');
            $table->string('image_path')->nullable();
            $table->enum('announcement_status', ['draft', 'published', 'archived'])->default('draft');
            $table->uuid('created_by');
            $table->timestamps();

            // $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');

            // $table->index(['announcement_status']);
            // $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
