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
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // User foreign key
            $table->string('locale', 10); // Language code (removed unique since multiple users can have same locale)
            $table->boolean('is_default')->default(false); // Default language for this user
            $table->string('timezone')->default('UTC'); // User timezone
            $table->string('date_format')->default('M j, Y'); // Date format preference
            $table->string('currency', 3)->default('USD'); // Currency preference
            $table->boolean('rtl')->default(false); // Right-to-left text direction
            $table->timestamps();
            
            // Indexes
            $table->index(['user_id', 'locale']);
            $table->index(['user_id', 'is_default']);
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
