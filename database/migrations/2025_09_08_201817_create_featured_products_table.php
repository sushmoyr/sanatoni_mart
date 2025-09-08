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
        Schema::create('featured_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->enum('section', ['homepage_featured', 'homepage_trending', 'category_featured', 'deals', 'new_arrivals']); // different featured sections
            $table->integer('sort_order')->default(0); // for ordering within section
            $table->datetime('start_date')->nullable(); // when to start featuring
            $table->datetime('end_date')->nullable(); // when to stop featuring (null = indefinite)
            $table->boolean('is_active')->default(true);
            $table->text('note')->nullable(); // admin note
            $table->timestamps();

            $table->unique(['product_id', 'section']); // product can only be featured once per section
            $table->index(['section', 'is_active', 'sort_order']);
            $table->index(['start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('featured_products');
    }
};
