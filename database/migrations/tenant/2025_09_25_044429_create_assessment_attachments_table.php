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
        Schema::create('assessment_attachments', function (Blueprint $table) {
            $table->uuid('assessment_attachment_id')->primary();
            $table->uuid('assessment_id');
            $table->string('file_path', 200);
            $table->string('file_name', 100);
            $table->string('extension', 20);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessment_attachments');
    }
};
