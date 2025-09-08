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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->string('invoice_number')->unique();
            $table->decimal('subtotal', 10, 2);
            $table->decimal('shipping_cost', 8, 2);
            $table->decimal('tax_amount', 8, 2)->default(0); // Future-ready for tax support
            $table->decimal('total', 10, 2);
            $table->string('file_path')->nullable(); // Path to generated PDF
            $table->timestamp('generated_at');
            $table->boolean('is_sent')->default(false); // Email sent status
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
            
            $table->index('invoice_number');
            $table->index(['order_id', 'generated_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
