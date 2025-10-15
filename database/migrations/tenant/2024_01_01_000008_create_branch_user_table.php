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
        Schema::create('branch_user', function (Blueprint $table) {
            $table->id('branch_user_id')->primary();
            $table->uuid('branch_id');
            $table->uuid('user_id');
            $table->unsignedBigInteger('role_id')->nullable();
            $table->string('created_by', 36);
            $table->timestamps();

            // $table->foreign('branch_id')->references('branch_id')->on('branches')->onDelete('cascade');
            // $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            // $table->unique(['branch_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('branch_user');
    }
};
