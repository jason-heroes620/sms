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
        Schema::create('guardians', function (Blueprint $table) {
            $table->uuid('guardian_id')->primary();
            $table->string('designation', 30);
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('contact_no', 20);
            $table->string('email', 150);
            $table->string('occupation', 100);
            $table->timestamps();

            // $table->index(['guardian_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guardians');
    }
};
