<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Carbon\Carbon;
use Illuminate\Support\Str;

class Coupon extends Model
{
    protected $fillable = [
        'code',
        'name',
        'description',
        'type',
        'value',
        'minimum_order_amount',
        'product_ids',
        'category_ids',
        'usage_limit',
        'used_count',
        'per_customer_limit',
        'valid_from',
        'valid_until',
        'status',
    ];

    protected $casts = [
        'product_ids' => 'array',
        'category_ids' => 'array',
        'value' => 'decimal:2',
        'minimum_order_amount' => 'decimal:2',
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
    ];

    /**
     * Get coupon usage records
     */
    public function usages(): HasMany
    {
        return $this->hasMany(CouponUsage::class);
    }

    /**
     * Get products this coupon applies to
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'coupon_products')
            ->withTimestamps();
    }

    /**
     * Get categories this coupon applies to
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'coupon_categories')
            ->withTimestamps();
    }

    /**
     * Check if coupon is valid
     */
    public function isValid(): bool
    {
        $now = Carbon::now();
        
        return $this->status === 'active' &&
               $now->gte($this->valid_from) &&
               ($this->valid_until === null || $now->lte($this->valid_until)) &&
               ($this->usage_limit === null || $this->used_count < $this->usage_limit);
    }

    /**
     * Check if coupon can be used by a specific customer
     */
    public function canBeUsedBy($customerId = null, string $customerEmail = null): bool
    {
        if (!$this->isValid()) {
            return false;
        }

        if ($this->per_customer_limit === null) {
            return true;
        }

        $usageQuery = $this->usages();
        
        if ($customerId) {
            $usageQuery->where('user_id', $customerId);
        } elseif ($customerEmail) {
            $usageQuery->where('customer_email', $customerEmail);
        } else {
            return true; // No customer info provided, allow
        }

        $customerUsageCount = $usageQuery->count();
        
        return $customerUsageCount < $this->per_customer_limit;
    }

    /**
     * Check if coupon applies to specific products
     */
    public function appliesToProducts(array $productIds): bool
    {
        // If no specific products set, applies to all
        if (empty($this->product_ids)) {
            return true;
        }

        // Check if any of the cart products are in the coupon's product list
        return !empty(array_intersect($productIds, $this->product_ids));
    }

    /**
     * Check if coupon applies to specific categories
     */
    public function appliesToCategories(array $categoryIds): bool
    {
        // If no specific categories set, applies to all
        if (empty($this->category_ids)) {
            return true;
        }

        // Check if any of the product categories are in the coupon's category list
        return !empty(array_intersect($categoryIds, $this->category_ids));
    }

    /**
     * Calculate discount amount for an order
     */
    public function calculateDiscount(float $orderTotal, array $applicableProductsTotal = []): float
    {
        if (!$this->isValid()) {
            return 0;
        }

        // Check minimum order amount
        if ($this->minimum_order_amount && $orderTotal < $this->minimum_order_amount) {
            return 0;
        }

        // Calculate based on applicable products total if specific products/categories
        $calculationBase = !empty($applicableProductsTotal) ? array_sum($applicableProductsTotal) : $orderTotal;

        if ($this->type === 'percentage') {
            return ($calculationBase * $this->value) / 100;
        } else {
            // Fixed amount - don't exceed the applicable total
            return min($this->value, $calculationBase);
        }
    }

    /**
     * Apply coupon to an order
     */
    public function applyToOrder(int $orderId, $customerId = null, string $customerEmail = null): CouponUsage
    {
        $this->increment('used_count');
        
        return $this->usages()->create([
            'order_id' => $orderId,
            'user_id' => $customerId,
            'customer_email' => $customerEmail,
            'discount_amount' => 0, // This should be calculated and set by the calling code
        ]);
    }

    /**
     * Generate a unique coupon code
     */
    public static function generateCode(string $prefix = 'COUP'): string
    {
        do {
            $code = $prefix . Str::upper(Str::random(8));
        } while (self::where('code', $code)->exists());
        
        return $code;
    }

    /**
     * Update status based on validity
     */
    public function updateStatus(): void
    {
        if ($this->valid_until && Carbon::now()->gt($this->valid_until)) {
            $this->status = 'expired';
            $this->save();
        } elseif ($this->usage_limit && $this->used_count >= $this->usage_limit) {
            $this->status = 'expired';
            $this->save();
        }
    }

    /**
     * Scope for active coupons
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where('valid_from', '<=', Carbon::now())
            ->where(function ($q) {
                $q->whereNull('valid_until')
                  ->orWhere('valid_until', '>', Carbon::now());
            });
    }

    /**
     * Scope for valid coupons (active + not exceeded usage limit)
     */
    public function scopeValid($query)
    {
        return $query->active()
            ->where(function ($q) {
                $q->whereNull('usage_limit')
                  ->orWhereRaw('used_count < usage_limit');
            });
    }
}
