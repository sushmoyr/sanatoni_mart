<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class FeaturedProduct extends Model
{
    protected $fillable = [
        'product_id',
        'section',
        'sort_order',
        'start_date',
        'end_date',
        'is_active',
        'note',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Get the product being featured
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Check if the featured product is currently active
     */
    public function isCurrentlyActive(): bool
    {
        $now = Carbon::now();
        
        return $this->is_active &&
               ($this->start_date === null || $now->gte($this->start_date)) &&
               ($this->end_date === null || $now->lte($this->end_date));
    }

    /**
     * Check if the featured product is scheduled
     */
    public function isScheduled(): bool
    {
        return $this->is_active &&
               $this->start_date &&
               Carbon::now()->lt($this->start_date);
    }

    /**
     * Check if the featured product has expired
     */
    public function isExpired(): bool
    {
        return $this->end_date && Carbon::now()->gt($this->end_date);
    }

    /**
     * Scope for active featured products
     */
    public function scopeActive($query)
    {
        $now = Carbon::now();
        
        return $query->where('is_active', true)
            ->where(function ($q) use ($now) {
                $q->whereNull('start_date')
                  ->orWhere('start_date', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('end_date')
                  ->orWhere('end_date', '>', $now);
            });
    }

    /**
     * Scope for a specific section
     */
    public function scopeForSection($query, string $section)
    {
        return $query->where('section', $section);
    }

    /**
     * Scope for ordered results
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc')
            ->orderBy('created_at', 'desc');
    }

    /**
     * Get available sections
     */
    public static function getAvailableSections(): array
    {
        return [
            'homepage_featured' => 'Homepage Featured',
            'homepage_trending' => 'Homepage Trending',
            'category_featured' => 'Category Featured',
            'deals' => 'Deals',
            'new_arrivals' => 'New Arrivals',
        ];
    }
}
