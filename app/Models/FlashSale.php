<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Carbon\Carbon;

class FlashSale extends Model
{
    protected $fillable = [
        'name',
        'description',
        'discount_percentage',
        'product_ids',
        'start_date',
        'end_date',
        'status',
        'is_featured',
        'max_usage',
        'used_count',
    ];

    protected $casts = [
        'product_ids' => 'array',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'discount_percentage' => 'decimal:2',
        'is_featured' => 'boolean',
    ];

    /**
     * Get products included in this flash sale
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'flash_sale_products')
            ->withTimestamps();
    }

    /**
     * Check if flash sale is currently active
     */
    public function isActive(): bool
    {
        return $this->status === 'active' && 
               Carbon::now()->between($this->start_date, $this->end_date) &&
               ($this->max_usage === null || $this->used_count < $this->max_usage);
    }

    /**
     * Check if flash sale is scheduled
     */
    public function isScheduled(): bool
    {
        return $this->status === 'scheduled' && 
               Carbon::now()->lt($this->start_date);
    }

    /**
     * Check if flash sale has expired
     */
    public function isExpired(): bool
    {
        return Carbon::now()->gt($this->end_date) || 
               ($this->max_usage !== null && $this->used_count >= $this->max_usage);
    }

    /**
     * Get time remaining for the sale
     */
    public function timeRemaining(): ?int
    {
        if (!$this->isActive()) {
            return null;
        }
        
        return Carbon::now()->diffInSeconds($this->end_date, false);
    }

    /**
     * Calculate discounted price for a product
     */
    public function calculateDiscountedPrice(float $originalPrice): float
    {
        $discountAmount = ($originalPrice * $this->discount_percentage) / 100;
        return $originalPrice - $discountAmount;
    }

    /**
     * Update status based on dates
     */
    public function updateStatus(): void
    {
        $now = Carbon::now();
        
        if ($now->lt($this->start_date)) {
            $this->status = 'scheduled';
        } elseif ($now->between($this->start_date, $this->end_date)) {
            if ($this->max_usage === null || $this->used_count < $this->max_usage) {
                $this->status = 'active';
            } else {
                $this->status = 'expired';
            }
        } else {
            $this->status = 'expired';
        }
        
        $this->save();
    }

    /**
     * Scope for active flash sales
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where('start_date', '<=', Carbon::now())
            ->where('end_date', '>', Carbon::now());
    }

    /**
     * Scope for featured flash sales
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}
