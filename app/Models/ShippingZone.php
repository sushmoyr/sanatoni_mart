<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ShippingZone extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'areas',
        'shipping_cost',
        'is_active',
        'delivery_time_min',
        'delivery_time_max',
    ];

    protected $casts = [
        'areas' => 'array',
        'shipping_cost' => 'decimal:2',
        'is_active' => 'boolean',
        'delivery_time_min' => 'integer',
        'delivery_time_max' => 'integer',
    ];

    /**
     * Scope to get only active zones
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Check if an area matches this zone
     */
    public function matchesArea(string $area): bool
    {
        $area = strtolower($area);
        
        foreach ($this->areas as $zoneArea) {
            if (str_contains($area, strtolower($zoneArea))) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Get delivery time range
     */
    public function getDeliveryTimeRangeAttribute(): string
    {
        if ($this->delivery_time_min && $this->delivery_time_max) {
            if ($this->delivery_time_min === $this->delivery_time_max) {
                return $this->delivery_time_min . ' day' . ($this->delivery_time_min > 1 ? 's' : '');
            }
            return $this->delivery_time_min . '-' . $this->delivery_time_max . ' days';
        }
        
        return 'Contact for delivery time';
    }

    /**
     * Get formatted shipping cost
     */
    public function getFormattedShippingCostAttribute(): string
    {
        return '৳' . number_format($this->shipping_cost, 2);
    }

    /**
     * Find shipping zone for given address
     */
    public static function findForAddress(array $address): ?self
    {
        $searchTerms = [
            $address['city'] ?? '',
            $address['district'] ?? '',
            $address['division'] ?? '',
            $address['postal_code'] ?? '',
        ];

        $zones = self::active()->get();
        
        foreach ($zones as $zone) {
            foreach ($searchTerms as $term) {
                if ($term && $zone->matchesArea($term)) {
                    return $zone;
                }
            }
        }
        
        // Default to first zone if no match found
        return $zones->first();
    }
}
