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
        Schema::create('flash_sales', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('discount_percentage', 5, 2); // Max 999.99%
            $table->json('product_ids'); // Array of product IDs
            $table->datetime('start_date');
            $table->datetime('end_date');
            $table->enum('status', ['active', 'inactive', 'scheduled', 'expired'])->default('inactive');
            $table->boolean('is_featured')->default(false);
            $table->integer('max_usage')->nullable(); // Optional usage limit
            $table->integer('used_count')->default(0);
            $table->timestamps();

            $table->index(['status', 'start_date', 'end_date']);
            $table->index('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flash_sales');
    }
};
