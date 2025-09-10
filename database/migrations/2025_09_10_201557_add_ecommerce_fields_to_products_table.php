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
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('is_featured')->default(false)->after('featured');
            $table->integer('featured_order')->default(0)->after('is_featured');
            $table->integer('views_count')->default(0)->after('featured_order');
            $table->timestamp('featured_at')->nullable()->after('views_count');
            
            // Add indexes for better performance
            $table->index(['is_featured', 'featured_order']);
            $table->index('views_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['is_featured', 'featured_order']);
            $table->dropIndex(['views_count']);
            $table->dropColumn(['is_featured', 'featured_order', 'views_count', 'featured_at']);
        });
    }
};
