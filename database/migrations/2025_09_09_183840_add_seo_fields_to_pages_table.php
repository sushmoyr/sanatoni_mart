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
        Schema::table('pages', function (Blueprint $table) {
            // Add missing fields for CMS functionality
            $table->text('excerpt')->nullable()->after('content');
            $table->timestamp('published_at')->nullable()->after('status');
            $table->json('sections')->nullable()->after('content');
            
            // Add comprehensive SEO fields
            $table->string('seo_title')->nullable()->after('meta_keywords');
            $table->text('seo_description')->nullable()->after('seo_title');
            $table->text('seo_keywords')->nullable()->after('seo_description');
            $table->string('social_image')->nullable()->after('seo_keywords');
            $table->string('og_title')->nullable()->after('social_image');
            $table->text('og_description')->nullable()->after('og_title');
            $table->string('twitter_title')->nullable()->after('og_description');
            $table->text('twitter_description')->nullable()->after('twitter_title');
            
            // Update status enum to include 'scheduled'
            $table->enum('status', ['draft', 'published', 'scheduled', 'archived'])->default('draft')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn([
                'excerpt',
                'published_at',
                'sections',
                'seo_title',
                'seo_description',
                'seo_keywords',
                'social_image',
                'og_title',
                'og_description',
                'twitter_title',
                'twitter_description'
            ]);
            
            // Revert status enum
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft')->change();
        });
    }
};
