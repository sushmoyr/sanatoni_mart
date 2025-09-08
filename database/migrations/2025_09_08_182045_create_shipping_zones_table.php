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
        Schema::create('shipping_zones', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Inside Dhaka", "Outside Dhaka"
            $table->text('description')->nullable();
            $table->json('areas'); // Array of cities, postal codes, or regions
            $table->decimal('shipping_cost', 8, 2);
            $table->boolean('is_active')->default(true);
            $table->integer('delivery_time_min')->nullable(); // Minimum delivery days
            $table->integer('delivery_time_max')->nullable(); // Maximum delivery days
            $table->timestamps();
            
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_zones');
    }
};
