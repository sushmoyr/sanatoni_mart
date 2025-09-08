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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->enum('type', ['seasonal', 'category', 'product', 'sitewide']); // campaign type
            $table->decimal('discount_percentage', 5, 2)->nullable(); // percentage discount
            $table->json('category_ids')->nullable(); // categories to apply to
            $table->json('product_ids')->nullable(); // specific products
            $table->string('banner_image')->nullable(); // promotional banner
            $table->text('banner_text')->nullable(); // banner text
            $table->string('banner_link')->nullable(); // banner link
            $table->datetime('start_date');
            $table->datetime('end_date');
            $table->enum('status', ['active', 'inactive', 'scheduled', 'expired'])->default('inactive');
            $table->boolean('is_featured')->default(false);
            $table->integer('priority')->default(0); // for ordering multiple campaigns
            $table->timestamps();

            $table->index(['status', 'start_date', 'end_date']);
            $table->index(['slug', 'status']);
            $table->index('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
