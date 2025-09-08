<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'invoice_number',
        'subtotal',
        'shipping_cost',
        'tax_amount',
        'total',
        'file_path',
        'generated_at',
        'is_sent',
        'sent_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'generated_at' => 'datetime',
        'is_sent' => 'boolean',
        'sent_at' => 'datetime',
    ];

    /**
     * Get the order that owns the invoice
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Generate a unique invoice number
     */
    public static function generateInvoiceNumber(): string
    {
        do {
            $invoiceNumber = 'INV-' . date('Y') . '-' . str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT);
        } while (self::where('invoice_number', $invoiceNumber)->exists());

        return $invoiceNumber;
    }

    /**
     * Get formatted total
     */
    public function getFormattedTotalAttribute(): string
    {
        return '৳' . number_format($this->total, 2);
    }

    /**
     * Get formatted subtotal
     */
    public function getFormattedSubtotalAttribute(): string
    {
        return '৳' . number_format($this->subtotal, 2);
    }

    /**
     * Get formatted shipping cost
     */
    public function getFormattedShippingCostAttribute(): string
    {
        return '৳' . number_format($this->shipping_cost, 2);
    }

    /**
     * Get formatted tax amount
     */
    public function getFormattedTaxAmountAttribute(): string
    {
        return '৳' . number_format($this->tax_amount, 2);
    }

    /**
     * Check if invoice file exists
     */
    public function fileExists(): bool
    {
        return $this->file_path && file_exists(storage_path('app/' . $this->file_path));
    }

    /**
     * Get download URL
     */
    public function getDownloadUrlAttribute(): string
    {
        return route('invoices.download', $this->id);
    }
}
