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
        Schema::create('package_fees', function (Blueprint $table) {
            $table->uuid('package_fee_id')->primary();
            $table->uuid('package_id');
            $table->uuid('fee_id');
            $table->timestamps();

            // $table->foreign('package_id')->references('package_id')->on('packages')->onDelete('cascade');
            // $table->foreign('fee_id')->references('fee_id')->on('fees')->onDelete('cascade');
            // $table->unique(['package_id', 'fee_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('package_fees');
    }
};
