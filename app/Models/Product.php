<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'description', 'short_description', 'sku', 'price', 'sale_price',
        'manage_stock', 'stock_quantity', 'allow_backorders', 'stock_status', 'featured',
        'is_active', 'status', 'weight', 'dimensions', 'category_id', 'main_image',
        'gallery_images', 'specifications', 'meta_title', 'meta_description',
    ];

    protected $casts = [
        'price' => 'decimal:2', 'sale_price' => 'decimal:2', 'weight' => 'decimal:3',
        'manage_stock' => 'boolean', 'allow_backorders' => 'boolean', 'featured' => 'boolean',
        'is_active' => 'boolean', 'stock_quantity' => 'integer', 'gallery_images' => 'array',
        'specifications' => 'array', 'dimensions' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
            if (empty($product->sku)) {
                $product->sku = 'PRD-' . strtoupper(Str::random(8));
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function mainImage()
    {
        return $this->images()->where('is_main', true)->first();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->where('status', 'published');
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function isOnSale(): bool
    {
        return $this->sale_price && $this->sale_price < $this->price;
    }

    public function getDisplayPriceAttribute(): float
    {
        return $this->isOnSale() ? $this->sale_price : $this->price;
    }

    public function getFormattedPriceAttribute(): string
    {
        return '₹' . number_format($this->price, 2);
    }

    public function getFormattedDisplayPriceAttribute(): string
    {
        return '₹' . number_format($this->display_price, 2);
    }
}
