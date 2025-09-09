<?php

namespace App\Services;

use App\Models\SeoSetting;
use App\Models\Page;
use App\Models\Product;
use App\Models\BlogPost;
use App\Models\BlogCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class SeoService
{
    /**
     * Generate meta tags for a model
     */
    public function generateMetaTags(Model $model, array $overrides = []): array
    {
        $seoSetting = $this->getSeoSetting($model);
        
        return [
            'title' => $overrides['title'] ?? $seoSetting?->effective_meta_title ?? $this->getDefaultTitle($model),
            'description' => $overrides['description'] ?? $seoSetting?->effective_meta_description ?? $this->getDefaultDescription($model),
            'keywords' => $overrides['keywords'] ?? $seoSetting?->meta_keywords ?? $this->getDefaultKeywords($model),
            'canonical' => $overrides['canonical'] ?? $seoSetting?->canonical_url ?? $this->getCanonicalUrl($model),
            'og:title' => $overrides['og_title'] ?? $seoSetting?->effective_og_title ?? $seoSetting?->effective_meta_title ?? $this->getDefaultTitle($model),
            'og:description' => $overrides['og_description'] ?? $seoSetting?->effective_og_description ?? $seoSetting?->effective_meta_description ?? $this->getDefaultDescription($model),
            'og:image' => $overrides['og_image'] ?? $seoSetting?->og_image ?? $this->getDefaultImage($model),
            'og:type' => $overrides['og_type'] ?? $seoSetting?->og_type ?? $this->getDefaultOgType($model),
            'og:url' => $overrides['og_url'] ?? $this->getCanonicalUrl($model),
            'twitter:card' => $overrides['twitter_card'] ?? $seoSetting?->twitter_card ?? 'summary_large_image',
            'twitter:title' => $overrides['twitter_title'] ?? $seoSetting?->effective_twitter_title ?? $seoSetting?->effective_meta_title ?? $this->getDefaultTitle($model),
            'twitter:description' => $overrides['twitter_description'] ?? $seoSetting?->effective_twitter_description ?? $seoSetting?->effective_meta_description ?? $this->getDefaultDescription($model),
            'twitter:image' => $overrides['twitter_image'] ?? $seoSetting?->twitter_image ?? $seoSetting?->og_image ?? $this->getDefaultImage($model),
        ];
    }

    /**
     * Generate structured data for a model
     */
    public function generateStructuredData(Model $model): array
    {
        $seoSetting = $this->getSeoSetting($model);
        
        if ($seoSetting && $seoSetting->structured_data) {
            return $seoSetting->structured_data;
        }

        return $this->getDefaultStructuredData($model);
    }

    /**
     * Update or create SEO settings for a model
     */
    public function updateSeoSettings(Model $model, array $data): SeoSetting
    {
        return SeoSetting::updateOrCreateForModel($model, $data);
    }

    /**
     * Get SEO setting for a model
     */
    public function getSeoSetting(Model $model): ?SeoSetting
    {
        return SeoSetting::where('model_type', get_class($model))
                         ->where('model_id', $model->id)
                         ->first();
    }

    /**
     * Optimize meta title length
     */
    public function optimizeTitle(string $title, int $maxLength = 60): string
    {
        if (strlen($title) <= $maxLength) {
            return $title;
        }

        // Try to cut at word boundary
        $optimized = Str::limit($title, $maxLength - 3, '');
        $lastSpace = strrpos($optimized, ' ');
        
        if ($lastSpace !== false && $lastSpace > $maxLength * 0.7) {
            return substr($optimized, 0, $lastSpace) . '...';
        }

        return Str::limit($title, $maxLength, '...');
    }

    /**
     * Optimize meta description length
     */
    public function optimizeDescription(string $description, int $maxLength = 160): string
    {
        if (strlen($description) <= $maxLength) {
            return $description;
        }

        // Try to cut at sentence boundary
        $optimized = Str::limit($description, $maxLength - 3, '');
        $lastPeriod = strrpos($optimized, '.');
        $lastExclamation = strrpos($optimized, '!');
        $lastQuestion = strrpos($optimized, '?');
        
        $lastSentenceEnd = max($lastPeriod, $lastExclamation, $lastQuestion);
        
        if ($lastSentenceEnd !== false && $lastSentenceEnd > $maxLength * 0.7) {
            return substr($optimized, 0, $lastSentenceEnd + 1);
        }

        // Try to cut at word boundary
        $lastSpace = strrpos($optimized, ' ');
        
        if ($lastSpace !== false && $lastSpace > $maxLength * 0.7) {
            return substr($optimized, 0, $lastSpace) . '...';
        }

        return Str::limit($description, $maxLength, '...');
    }

    /**
     * Generate keywords from content
     */
    public function generateKeywords(string $content, int $maxKeywords = 10): array
    {
        // Strip HTML and get plain text
        $text = strip_tags($content);
        $text = strtolower($text);
        
        // Remove common stop words
        $stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'this', 'that', 'these', 'those'];
        
        // Extract words
        preg_match_all('/\b[a-z]{3,}\b/', $text, $matches);
        $words = $matches[0];
        
        // Filter out stop words
        $words = array_filter($words, function($word) use ($stopWords) {
            return !in_array($word, $stopWords);
        });
        
        // Count word frequency
        $wordCounts = array_count_values($words);
        
        // Sort by frequency
        arsort($wordCounts);
        
        // Return top keywords
        return array_slice(array_keys($wordCounts), 0, $maxKeywords);
    }

    /**
     * Analyze SEO score for a model
     */
    public function analyzeSeoScore(Model $model): array
    {
        $score = 0;
        $maxScore = 100;
        $issues = [];
        $suggestions = [];

        $seoSetting = $this->getSeoSetting($model);
        $metaTags = $this->generateMetaTags($model);

        // Title analysis (20 points)
        $title = $metaTags['title'];
        if (empty($title)) {
            $issues[] = 'Meta title is missing';
        } elseif (strlen($title) < 30) {
            $issues[] = 'Meta title is too short (less than 30 characters)';
        } elseif (strlen($title) > 60) {
            $issues[] = 'Meta title is too long (more than 60 characters)';
        } else {
            $score += 20;
        }

        // Description analysis (20 points)
        $description = $metaTags['description'];
        if (empty($description)) {
            $issues[] = 'Meta description is missing';
        } elseif (strlen($description) < 120) {
            $issues[] = 'Meta description is too short (less than 120 characters)';
        } elseif (strlen($description) > 160) {
            $issues[] = 'Meta description is too long (more than 160 characters)';
        } else {
            $score += 20;
        }

        // Keywords analysis (10 points)
        if (!empty($metaTags['keywords'])) {
            $score += 10;
        } else {
            $suggestions[] = 'Consider adding meta keywords';
        }

        // Open Graph analysis (15 points)
        if (!empty($metaTags['og:image'])) {
            $score += 10;
        } else {
            $suggestions[] = 'Add Open Graph image for better social media sharing';
        }

        if (!empty($metaTags['og:title']) && !empty($metaTags['og:description'])) {
            $score += 5;
        }

        // Canonical URL analysis (10 points)
        if (!empty($metaTags['canonical'])) {
            $score += 10;
        } else {
            $suggestions[] = 'Set canonical URL to avoid duplicate content issues';
        }

        // Structured data analysis (15 points)
        $structuredData = $this->generateStructuredData($model);
        if (!empty($structuredData)) {
            $score += 15;
        } else {
            $suggestions[] = 'Add structured data markup for better search engine understanding';
        }

        // Content analysis (10 points)
        if ($model instanceof Page || $model instanceof BlogPost) {
            $content = $model->content ?? '';
            $wordCount = str_word_count(strip_tags($content));
            
            if ($wordCount >= 300) {
                $score += 10;
            } elseif ($wordCount > 0) {
                $score += 5;
                $suggestions[] = 'Content should be at least 300 words for better SEO';
            } else {
                $issues[] = 'Content is empty or too short';
            }
        } else {
            $score += 10; // Give full points for non-content models
        }

        // Calculate percentage
        $percentage = ($score / $maxScore) * 100;

        return [
            'score' => $score,
            'max_score' => $maxScore,
            'percentage' => round($percentage, 1),
            'grade' => $this->getGrade($percentage),
            'issues' => $issues,
            'suggestions' => $suggestions,
        ];
    }

    /**
     * Get SEO grade based on percentage
     */
    protected function getGrade(float $percentage): string
    {
        if ($percentage >= 90) return 'A+';
        if ($percentage >= 80) return 'A';
        if ($percentage >= 70) return 'B';
        if ($percentage >= 60) return 'C';
        if ($percentage >= 50) return 'D';
        return 'F';
    }

    /**
     * Get default title for a model
     */
    protected function getDefaultTitle(Model $model): string
    {
        if (isset($model->title)) {
            return $model->title;
        }
        
        if (isset($model->name)) {
            return $model->name;
        }

        return class_basename($model) . ' #' . $model->id;
    }

    /**
     * Get default description for a model
     */
    protected function getDefaultDescription(Model $model): string
    {
        if ($model instanceof Page || $model instanceof BlogPost) {
            $content = $model->content ?? $model->excerpt ?? '';
            return Str::limit(strip_tags($content), 160);
        }

        if ($model instanceof Product) {
            return Str::limit(strip_tags($model->description ?? ''), 160);
        }

        if ($model instanceof BlogCategory) {
            return $model->description ?? '';
        }

        return '';
    }

    /**
     * Get default keywords for a model
     */
    protected function getDefaultKeywords(Model $model): string
    {
        $content = '';
        
        if ($model instanceof Page || $model instanceof BlogPost) {
            $content = $model->content ?? '';
        } elseif ($model instanceof Product) {
            $content = $model->description ?? '';
        }

        if (empty($content)) {
            return '';
        }

        $keywords = $this->generateKeywords($content, 5);
        return implode(', ', $keywords);
    }

    /**
     * Get canonical URL for a model
     */
    protected function getCanonicalUrl(Model $model): string
    {
        if ($model instanceof Page) {
            return url('/' . $model->slug);
        }

        if ($model instanceof BlogPost) {
            return url('/blog/' . $model->slug);
        }

        if ($model instanceof Product) {
            return url('/products/' . $model->slug);
        }

        if ($model instanceof BlogCategory) {
            return url('/blog/category/' . $model->slug);
        }

        return url('/');
    }

    /**
     * Get default image for a model
     */
    protected function getDefaultImage(Model $model): ?string
    {
        if ($model instanceof Product && $model->images->isNotEmpty()) {
            return $model->images->first()->image_url ?? null;
        }

        if ($model instanceof BlogPost && $model->featured_image) {
            return $model->featured_image;
        }

        // Return site default image
        return asset('images/default-og-image.jpg');
    }

    /**
     * Get default Open Graph type for a model
     */
    protected function getDefaultOgType(Model $model): string
    {
        if ($model instanceof Product) {
            return 'product';
        }

        if ($model instanceof BlogPost) {
            return 'article';
        }

        return 'website';
    }

    /**
     * Get default structured data for a model
     */
    protected function getDefaultStructuredData(Model $model): array
    {
        $baseData = [
            '@context' => 'https://schema.org/',
        ];

        if ($model instanceof Product) {
            return array_merge($baseData, [
                '@type' => 'Product',
                'name' => $model->name,
                'description' => strip_tags($model->description ?? ''),
                'image' => $this->getDefaultImage($model),
                'offers' => [
                    '@type' => 'Offer',
                    'price' => $model->price,
                    'priceCurrency' => 'BDT',
                    'availability' => $model->stock_quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                ],
            ]);
        }

        if ($model instanceof BlogPost) {
            return array_merge($baseData, [
                '@type' => 'Article',
                'headline' => $model->title,
                'description' => $model->excerpt ?? strip_tags(Str::limit($model->content, 200)),
                'image' => $model->featured_image,
                'author' => [
                    '@type' => 'Person',
                    'name' => $model->author->name ?? 'Anonymous',
                ],
                'publisher' => [
                    '@type' => 'Organization',
                    'name' => config('app.name'),
                ],
                'datePublished' => $model->published_at?->toISOString(),
                'dateModified' => $model->updated_at->toISOString(),
            ]);
        }

        if ($model instanceof Page) {
            return array_merge($baseData, [
                '@type' => 'WebPage',
                'name' => $model->title,
                'description' => strip_tags(Str::limit($model->content ?? '', 200)),
                'url' => $this->getCanonicalUrl($model),
            ]);
        }

        return $baseData;
    }

    /**
     * Generate XML sitemap data
     */
    public function generateSitemapData(): array
    {
        $urls = [];

        // Add pages
        $pages = Page::where('status', 'published')->get();
        foreach ($pages as $page) {
            $urls[] = [
                'url' => $this->getCanonicalUrl($page),
                'lastmod' => $page->updated_at->toISOString(),
                'changefreq' => 'weekly',
                'priority' => $page->is_homepage ? '1.0' : '0.8',
            ];
        }

        // Add blog posts
        $posts = BlogPost::published()->get();
        foreach ($posts as $post) {
            $urls[] = [
                'url' => $this->getCanonicalUrl($post),
                'lastmod' => $post->updated_at->toISOString(),
                'changefreq' => 'monthly',
                'priority' => '0.7',
            ];
        }

        // Add products
        $products = Product::where('is_active', true)->get();
        foreach ($products as $product) {
            $urls[] = [
                'url' => $this->getCanonicalUrl($product),
                'lastmod' => $product->updated_at->toISOString(),
                'changefreq' => 'weekly',
                'priority' => '0.9',
            ];
        }

        return $urls;
    }
}
