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
        Schema::create('language_settings', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 10)->unique(); // Language code
            $table->string('name'); // English name
            $table->string('native_name'); // Native name
            $table->string('flag', 10)->nullable(); // Flag emoji or code
            $table->enum('direction', ['ltr', 'rtl'])->default('ltr'); // Text direction
            $table->string('date_format')->default('M j, Y'); // Date format
            $table->string('currency_code', 3)->default('USD'); // Currency code
            $table->string('currency_symbol', 5)->default('$'); // Currency symbol
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false);
            $table->integer('sort_order')->default(0);
            $table->json('meta_data')->nullable(); // Additional settings
            $table->timestamps();
            
            // Indexes
            $table->index(['is_active', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('language_settings');
    }
};
