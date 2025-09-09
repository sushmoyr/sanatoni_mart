<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Str;

class BlogCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'meta_title',
        'meta_description',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });

        static::updating(function ($category) {
            if ($category->isDirty('name') && empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    /**
     * Get the blog posts for this category
     */
    public function posts(): HasMany
    {
        return $this->hasMany(BlogPost::class, 'category_id');
    }

    /**
     * Get published posts for this category
     */
    public function publishedPosts(): HasMany
    {
        return $this->posts()->where('status', 'published')->whereNotNull('published_at');
    }

    /**
     * Get the SEO settings for this category
     */
    public function seoSetting(): MorphOne
    {
        return $this->morphOne(SeoSetting::class, 'model');
    }

    /**
     * Scope for active categories
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the route key for the model
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Get the category's effective meta title
     */
    public function getEffectiveMetaTitleAttribute(): string
    {
        return $this->meta_title ?: $this->name;
    }

    /**
     * Get the category's effective meta description
     */
    public function getEffectiveMetaDescriptionAttribute(): ?string
    {
        return $this->meta_description ?: $this->description;
    }

    /**
     * Get the posts count for this category
     */
    public function getPostsCountAttribute(): int
    {
        return $this->publishedPosts()->count();
    }
}
