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
        Schema::create('review_helpful_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_review_id')->constrained()->onDelete('cascade');
            $table->boolean('is_helpful')->comment('true for helpful, false for not helpful');
            $table->timestamps();
            
            // Prevent duplicate votes from same user on same review
            $table->unique(['user_id', 'product_review_id']);
            
            // Index for better performance
            $table->index(['product_review_id', 'is_helpful']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('review_helpful_votes');
    }
};
