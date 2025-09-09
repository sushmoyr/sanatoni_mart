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
        Schema::create('translations', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 10); // Language code (en, bn)
            $table->string('key'); // Translation key (e.g., 'common.save')
            $table->text('value'); // Translated text
            $table->string('group')->nullable(); // Group name (e.g., 'common', 'navigation')
            $table->text('description')->nullable(); // Description for translators
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['locale', 'group']);
            $table->index(['locale', 'key']);
            $table->unique(['locale', 'key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('translations');
    }
};
