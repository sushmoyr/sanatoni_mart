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
        Schema::table('blog_posts', function (Blueprint $table) {
            // Add missing SEO and content fields
            $table->json('gallery_images')->nullable()->after('featured_image');
            $table->json('tags')->nullable()->after('category_id');
            $table->integer('reading_time')->nullable()->after('views_count');
            
            // Add comprehensive SEO fields
            $table->string('seo_title')->nullable()->after('meta_keywords');
            $table->text('seo_description')->nullable()->after('seo_title');
            $table->text('seo_keywords')->nullable()->after('seo_description');
            $table->string('social_image')->nullable()->after('seo_keywords');
            $table->string('og_title')->nullable()->after('social_image');
            $table->text('og_description')->nullable()->after('og_title');
            $table->string('twitter_title')->nullable()->after('og_description');
            $table->text('twitter_description')->nullable()->after('twitter_title');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropColumn([
                'gallery_images',
                'tags',
                'reading_time',
                'seo_title',
                'seo_description',
                'seo_keywords',
                'social_image',
                'og_title',
                'og_description',
                'twitter_title',
                'twitter_description'
            ]);
        });
    }
};
