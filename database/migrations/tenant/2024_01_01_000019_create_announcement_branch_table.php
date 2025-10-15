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
        Schema::create('announcement_branch', function (Blueprint $table) {
            $table->uuid('announcement_branch_id')->primary();
            $table->uuid('announcement_id');
            $table->uuid('branch_id');
            $table->timestamps();

            // $table->foreign('announcement_id')->references('announcement_id')->on('announcements')->onDelete('cascade');
            // $table->foreign('branch_id')->references('branch_id')->on('branches')->onDelete('cascade');
            // $table->unique(['announcement_id', 'branch_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcement_branch');
    }
};
