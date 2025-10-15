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
        Schema::create('branch_class', function (Blueprint $table) {
            $table->id('branch_class_id')->primary();
            $table->uuid('branch_id');
            $table->uuid('class_id');
            $table->uuid('created_by');
            $table->timestamps();

            // $table->foreign('branch_id')->references('branch_id')->on('branches')->onDelete('cascade');
            // $table->foreign('class_id')->references('class_id')->on('classes')->onDelete('cascade');
            // $table->unique(['branch_id', 'class_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('branch_class');
    }
};
