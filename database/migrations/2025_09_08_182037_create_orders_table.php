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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('guest_email')->nullable(); // For guest checkout
            $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])->default('pending');
            $table->decimal('subtotal', 10, 2);
            $table->decimal('shipping_cost', 8, 2);
            $table->decimal('total', 10, 2);
            $table->json('shipping_address'); // Store complete shipping address
            $table->json('billing_address')->nullable(); // Store complete billing address
            $table->text('notes')->nullable(); // Order notes/comments
            $table->enum('payment_method', ['cod'])->default('cod'); // Cash on Delivery only
            $table->timestamp('estimated_delivery_date')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'status']);
            $table->index(['guest_email', 'status']);
            $table->index('order_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
