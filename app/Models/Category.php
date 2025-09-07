<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'description', 'image', 'icon',
        'parent_id', 'is_active', 'sort_order', 'meta_title', 'meta_description',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function activeChildren(): HasMany
    {
        return $this->children()->where('is_active', true)->orderBy('sort_order');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function activeProducts(): HasMany
    {
        return $this->products()->where('is_active', true)->where('status', 'published');
    }

    public function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function hasChildren(): bool
    {
        return $this->children()->count() > 0;
    }

    public function getFullNameAttribute(): string
    {
        $names = [$this->name];
        $parent = $this->parent;
        while ($parent) {
            array_unshift($names, $parent->name);
            $parent = $parent->parent;
        }
        return implode(' > ', $names);
    }

    public function getUrlAttribute(): string
    {
        return route('categories.show', $this->slug);
    }
}
