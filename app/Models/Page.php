<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Str;

class Page extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'status',
        'published_at',
        'template',
        'sections',
        'settings',
        'is_homepage',
        'sort_order',
        'created_by',
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
        'settings' => 'array',
        'sections' => 'array',
        'is_homepage' => 'boolean',
        'sort_order' => 'integer',
        'published_at' => 'datetime',
    ];

    /**
     * The attributes that should be mutated to dates.
     */
    protected $dates = [
        'created_at',
        'updated_at',
    ];

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($page) {
            if (empty($page->slug)) {
                $page->slug = Str::slug($page->title);
            }
        });

        static::updating(function ($page) {
            if ($page->isDirty('title') && empty($page->slug)) {
                $page->slug = Str::slug($page->title);
            }
        });
    }

    /**
     * Get the creator of this page
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the page sections
     */
    public function sections(): HasMany
    {
        return $this->hasMany(PageSection::class)->orderBy('sort_order');
    }

    /**
     * Get the SEO settings for this page
     */
    public function seoSetting(): MorphOne
    {
        return $this->morphOne(SeoSetting::class, 'model');
    }

    /**
     * Scope for published pages
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Scope for homepage
     */
    public function scopeHomepage($query)
    {
        return $query->where('is_homepage', true);
    }

    /**
     * Get the route key for the model
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Get the page's effective meta title
     */
    public function getEffectiveMetaTitleAttribute(): string
    {
        return $this->meta_title ?: $this->title;
    }

    /**
     * Get the page's effective meta description
     */
    public function getEffectiveMetaDescriptionAttribute(): ?string
    {
        return $this->meta_description ?: Str::limit(strip_tags($this->content), 160);
    }
}
