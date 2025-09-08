<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderStatusHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'from_status',
        'to_status',
        'comment',
        'changed_by',
    ];

    /**
     * Get the order that owns the status history
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the user who changed the status
     */
    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }

    /**
     * Get formatted status change
     */
    public function getFormattedChangeAttribute(): string
    {
        if ($this->from_status) {
            return ucfirst($this->from_status) . ' → ' . ucfirst($this->to_status);
        }
        
        return 'Order ' . ucfirst($this->to_status);
    }

    /**
     * Get changed by name
     */
    public function getChangedByNameAttribute(): string
    {
        return $this->changedBy ? $this->changedBy->name : 'System';
    }

    /**
     * Get status badge class for UI
     */
    public function getStatusBadgeClassAttribute(): string
    {
        return match($this->to_status) {
            'pending' => 'bg-yellow-100 text-yellow-800',
            'processing' => 'bg-blue-100 text-blue-800',
            'shipped' => 'bg-purple-100 text-purple-800',
            'delivered' => 'bg-green-100 text-green-800',
            'cancelled' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }
}
