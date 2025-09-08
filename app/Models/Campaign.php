<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Carbon\Carbon;
use Illuminate\Support\Str;

class Campaign extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'type',
        'discount_percentage',
        'category_ids',
        'product_ids',
        'banner_image',
        'banner_text',
        'banner_link',
        'start_date',
        'end_date',
        'status',
        'is_featured',
        'priority',
    ];

    protected $casts = [
        'category_ids' => 'array',
        'product_ids' => 'array',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'discount_percentage' => 'decimal:2',
        'is_featured' => 'boolean',
    ];

    /**
     * Get products included in this campaign
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'campaign_products')
            ->withTimestamps();
    }

    /**
     * Get categories included in this campaign
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'campaign_categories')
            ->withTimestamps();
    }

    /**
     * Check if campaign is currently active
     */
    public function isActive(): bool
    {
        return $this->status === 'active' && 
               Carbon::now()->between($this->start_date, $this->end_date);
    }

    /**
     * Check if campaign is scheduled
     */
    public function isScheduled(): bool
    {
        return $this->status === 'scheduled' && 
               Carbon::now()->lt($this->start_date);
    }

    /**
     * Check if campaign has expired
     */
    public function isExpired(): bool
    {
        return Carbon::now()->gt($this->end_date);
    }

    /**
     * Check if campaign applies to a specific product
     */
    public function appliesToProduct(int $productId): bool
    {
        // If it's a sitewide campaign
        if ($this->type === 'sitewide') {
            return true;
        }

        // If specific products are set
        if ($this->type === 'product' && !empty($this->product_ids)) {
            return in_array($productId, $this->product_ids);
        }

        // If category-based campaign
        if ($this->type === 'category' && !empty($this->category_ids)) {
            $product = Product::find($productId);
            return $product && in_array($product->category_id, $this->category_ids);
        }

        return false;
    }

    /**
     * Calculate discounted price for a product
     */
    public function calculateDiscountedPrice(float $originalPrice): float
    {
        if (!$this->discount_percentage) {
            return $originalPrice;
        }

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
            $this->status = 'active';
        } else {
            $this->status = 'expired';
        }
        
        $this->save();
    }

    /**
     * Generate unique slug
     */
    public static function generateSlug(string $name): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while (self::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Scope for active campaigns
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where('start_date', '<=', Carbon::now())
            ->where('end_date', '>', Carbon::now());
    }

    /**
     * Scope for featured campaigns
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope for campaigns by type
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
