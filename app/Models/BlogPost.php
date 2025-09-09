<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Str;
use Carbon\Carbon;

class BlogPost extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'featured_image',
        'gallery_images',
        'category_id',
        'tags',
        'status',
        'published_at',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'views_count',
        'reading_time',
        'is_featured',
        'allow_comments',
        'author_id',
        'seo_title',
        'seo_description',
        'seo_keywords',
        'social_image',
        'og_title',
        'og_description',
        'twitter_title',
        'twitter_description',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'gallery_images' => 'array',
        'tags' => 'array',
        'views_count' => 'integer',
        'reading_time' => 'integer',
        'is_featured' => 'boolean',
        'allow_comments' => 'boolean',
    ];

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($post) {
            if (empty($post->slug)) {
                $post->slug = Str::slug($post->title);
            }
            
            if (empty($post->excerpt) && $post->content) {
                $post->excerpt = Str::limit(strip_tags($post->content), 200);
            }
        });

        static::updating(function ($post) {
            if ($post->isDirty('title') && empty($post->slug)) {
                $post->slug = Str::slug($post->title);
            }
            
            if ($post->isDirty('content') && empty($post->excerpt)) {
                $post->excerpt = Str::limit(strip_tags($post->content), 200);
            }
        });
    }

    /**
     * Get the author of this post
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Get the category for this post
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'category_id');
    }

    /**
     * Get the tags for this post
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(BlogTag::class, 'blog_post_tags', 'blog_post_id', 'blog_tag_id');
    }

    /**
     * Get the SEO settings for this post
     */
    public function seoSetting(): MorphOne
    {
        return $this->morphOne(SeoSetting::class, 'model');
    }

    /**
     * Scope for published posts
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                    ->whereNotNull('published_at')
                    ->where('published_at', '<=', now());
    }

    /**
     * Scope for featured posts
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope for posts by category
     */
    public function scopeInCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    /**
     * Scope for posts with tag
     */
    public function scopeWithTag($query, $tagId)
    {
        return $query->whereHas('tags', function ($q) use ($tagId) {
            $q->where('blog_tags.id', $tagId);
        });
    }

    /**
     * Get the route key for the model
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Get the post's effective meta title
     */
    public function getEffectiveMetaTitleAttribute(): string
    {
        return $this->meta_title ?: $this->title;
    }

    /**
     * Get the post's effective meta description
     */
    public function getEffectiveMetaDescriptionAttribute(): ?string
    {
        return $this->meta_description ?: $this->excerpt;
    }

    /**
     * Get the reading time estimate
     */
    public function getReadingTimeAttribute(): int
    {
        $wordCount = str_word_count(strip_tags($this->content));
        return max(1, ceil($wordCount / 200)); // Assuming 200 words per minute
    }

    /**
     * Check if the post is published
     */
    public function isPublished(): bool
    {
        return $this->status === 'published' 
               && $this->published_at 
               && $this->published_at <= now();
    }

    /**
     * Increment the views count
     */
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    /**
     * Get the previous published post
     */
    public function getPreviousPost()
    {
        return self::published()
                   ->where('published_at', '<', $this->published_at)
                   ->orderBy('published_at', 'desc')
                   ->first();
    }

    /**
     * Get the next published post
     */
    public function getNextPost()
    {
        return self::published()
                   ->where('published_at', '>', $this->published_at)
                   ->orderBy('published_at', 'asc')
                   ->first();
    }
}
