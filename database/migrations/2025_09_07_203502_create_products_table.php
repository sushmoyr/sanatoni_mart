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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('short_description')->nullable();
            $table->string('sku')->unique();
            $table->decimal('price', 10, 2);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->boolean('manage_stock')->default(true);
            $table->integer('stock_quantity')->default(0);
            $table->boolean('allow_backorders')->default(false);
            $table->enum('stock_status', ['in_stock', 'out_of_stock', 'on_backorder'])->default('in_stock');
            $table->boolean('featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->string('status')->default('published'); // draft, published, archived
            $table->decimal('weight', 8, 3)->nullable();
            $table->string('dimensions')->nullable(); // JSON string for length, width, height
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('main_image')->nullable();
            $table->json('gallery_images')->nullable();
            $table->json('specifications')->nullable(); // JSON for size, color, material, etc.
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();

            $table->index(['category_id', 'is_active']);
            $table->index(['stock_status', 'is_active']);
            $table->index(['featured', 'is_active']);
            $table->index('price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
