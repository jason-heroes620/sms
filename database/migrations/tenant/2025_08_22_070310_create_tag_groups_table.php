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
        Schema::create('tag_groups', function (Blueprint $table) {
            $table->uuid('tag_group_id')->primary();
            $table->string('tag_group', 100);
            $table->string('tag_color', 8);
            $table->string('tag_group_status', ['active', 'inactive'])->default('active');
            $table->enum('by_admin', ['Y', 'N'])->default('N');
            $table->uuid('created_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tag_groups');
    }
};
