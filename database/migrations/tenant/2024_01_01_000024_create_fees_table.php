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
        Schema::create('fees', function (Blueprint $table) {
            $table->uuid('fee_id')->primary();
            $table->string('fee_label', 100);
            $table->string('fee_code', 20)->unique();
            $table->decimal('fee_amount', 10, 2);
            $table->enum('fee_type', ['monthly', 'semester', 'annual', 'one_time'])->default('monthly');
            $table->string('uom', 50);
            $table->string('tax_id', 3)->nullable();
            $table->string('tax_code', 10)->nullable();
            $table->decimal('tax_rate', 5, 2)->default(0.00);
            $table->string('classification_code', 20)->nullable();
            $table->enum('fee_status', ['active', 'inactive'])->default('active');
            $table->integer('bukku_product_id', 11)->nullable();
            $table->text('bukku_units', 11)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fees');
    }
};
