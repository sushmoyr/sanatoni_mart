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
        Schema::create('recently_viewed_products', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->nullable(); // For guest users
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade'); // For authenticated users
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->timestamp('viewed_at');
            $table->timestamps();
            
            // Indexes for efficient querying
            $table->index(['user_id', 'viewed_at']);
            $table->index(['session_id', 'viewed_at']);
            $table->unique(['user_id', 'product_id']);
            $table->unique(['session_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recently_viewed_products');
    }
};
