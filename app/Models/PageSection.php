<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageSection extends Model
{
    protected $fillable = [
        'page_id',
        'type',
        'name',
        'content',
        'settings',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'content' => 'array',
        'settings' => 'array',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get the page that owns this section
     */
    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }

    /**
     * Scope for active sections
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for sections by type
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Get available section types
     */
    public static function getAvailableTypes(): array
    {
        return [
            'hero' => 'Hero Section',
            'text' => 'Text Content',
            'image' => 'Image Block',
            'gallery' => 'Image Gallery',
            'products' => 'Product Showcase',
            'testimonials' => 'Testimonials',
            'cta' => 'Call to Action',
            'faq' => 'FAQ Section',
            'contact' => 'Contact Form',
            'custom' => 'Custom HTML',
        ];
    }

    /**
     * Get the section type label
     */
    public function getTypeLabelAttribute(): string
    {
        $types = self::getAvailableTypes();
        return $types[$this->type] ?? ucfirst($this->type);
    }
}
