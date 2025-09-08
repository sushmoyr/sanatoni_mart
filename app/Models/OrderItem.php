<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price',
        'subtotal',
        'product_snapshot',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'product_snapshot' => 'array',
    ];

    /**
     * Get the order that owns the item
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the product
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get product name (from snapshot if product is deleted)
     */
    public function getProductNameAttribute(): string
    {
        if ($this->product) {
            return $this->product->name;
        }
        
        return $this->product_snapshot['name'] ?? 'Product Deleted';
    }

    /**
     * Get product image (from snapshot if product is deleted)
     */
    public function getProductImageAttribute(): ?string
    {
        if ($this->product && $this->product->images->count() > 0) {
            return $this->product->images->first()->image_path;
        }
        
        return $this->product_snapshot['image'] ?? null;
    }

    /**
     * Get formatted subtotal
     */
    public function getFormattedSubtotalAttribute(): string
    {
        return '৳' . number_format($this->subtotal, 2);
    }

    /**
     * Get formatted price
     */
    public function getFormattedPriceAttribute(): string
    {
        return '৳' . number_format($this->price, 2);
    }
}
