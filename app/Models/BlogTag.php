<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class BlogTag extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'color',
    ];

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($tag) {
            if (empty($tag->slug)) {
                $tag->slug = Str::slug($tag->name);
            }
        });

        static::updating(function ($tag) {
            if ($tag->isDirty('name') && empty($tag->slug)) {
                $tag->slug = Str::slug($tag->name);
            }
        });
    }

    /**
     * Get the blog posts that have this tag
     */
    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(BlogPost::class, 'blog_post_tags', 'blog_tag_id', 'blog_post_id');
    }

    /**
     * Get published posts that have this tag
     */
    public function publishedPosts(): BelongsToMany
    {
        return $this->posts()->where('status', 'published')->whereNotNull('published_at');
    }

    /**
     * Get the route key for the model
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Get the posts count for this tag
     */
    public function getPostsCountAttribute(): int
    {
        return $this->publishedPosts()->count();
    }

    /**
     * Get a random color if none is set
     */
    public function getEffectiveColorAttribute(): string
    {
        if ($this->color) {
            return $this->color;
        }

        // Generate a consistent color based on the tag name
        $colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];
        $index = crc32($this->name) % count($colors);
        return $colors[$index];
    }
}
