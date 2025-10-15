<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // public function up(): void
    // {
    //     Schema::create('taxes', function (Blueprint $table) {
    //         $table->uuid('tax_id')->primary();
    //         $table->string('tax_name');
    //         $table->decimal('tax_rate', 5, 2); // e.g., 6.00 for 6%
    //         $table->enum('tax_type', ['percentage', 'fixed'])->default('percentage');
    //         $table->enum('tax_status', ['active', 'inactive'])->default('active');
    //         $table->timestamps();

    //         // $table->index(['tax_status']);
    //     });
    // }

    // /**
    //  * Reverse the migrations.
    //  */
    // public function down(): void
    // {
    //     Schema::dropIfExists('taxes');
    // }
};
