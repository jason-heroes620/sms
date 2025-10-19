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
        Schema::create('grades', function (Blueprint $table) {
            $table->uuid('grade_id')->primary();
            $table->string('grade_name', 20);
            $table->decimal('min_mark', 5, 2);
            $table->decimal('max_mark', 5, 2);
            $table->text('grade_remark')->nullable();
            $table->integer('grade_order')->default(0);
            $table->timestamps();

            // $table->index(['grade_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
