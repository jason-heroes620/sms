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
        Schema::create('tags', function (Blueprint $table) {
            $table->uuid('tag_id')->primary();
            $table->string('tag', 100);
            $table->enum('by_admin', ['yes', 'no'])->default('no');
            $table->uuid('tag_group_id');
            $table->uuid('parent_id')->nullable();
            $table->enum('tag_status', ['active', 'inactive'])->default('active');
            $table->uuid('created_by');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tags');
    }
};
