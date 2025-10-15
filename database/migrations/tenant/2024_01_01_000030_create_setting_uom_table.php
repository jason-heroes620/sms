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
        Schema::create('setting_uom', function (Blueprint $table) {
            $table->uuid('setting_uom_id')->primary();
            $table->string('uom_name'); // Unit of Measurement name
            $table->string('uom_symbol')->nullable(); // Unit symbol (e.g., kg, cm, etc.)
            $table->text('description')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            // $table->index(['status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('setting_uom');
    }
};
