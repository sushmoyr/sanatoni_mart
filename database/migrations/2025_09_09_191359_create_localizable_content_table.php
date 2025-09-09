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
        Schema::create('localizable_content', function (Blueprint $table) {
            $table->id();
            $table->morphs('localizable'); // Model type and ID
            $table->string('locale', 10); // Language code
            $table->string('field'); // Field name (title, description, etc.)
            $table->longText('content'); // Translated content
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['localizable_type', 'localizable_id', 'locale']);
            $table->index(['locale', 'field']);
            $table->unique(['localizable_type', 'localizable_id', 'field', 'locale'], 'unique_localizable_content');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('localizable_content');
    }
};
