<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class NewsletterSend extends Model
{
    protected $fillable = [
        'newsletter_id',
        'subscriber_id',
        'sent_at',
        'opened_at',
        'clicked_at',
        'click_count',
        'clicked_links',
        'status',
        'bounce_reason',
        'message_id',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'opened_at' => 'datetime',
        'clicked_at' => 'datetime',
        'clicked_links' => 'array',
    ];

    /**
     * Get the newsletter this send belongs to
     */
    public function newsletter(): BelongsTo
    {
        return $this->belongsTo(Newsletter::class);
    }

    /**
     * Get the subscriber this send was sent to
     */
    public function subscriber(): BelongsTo
    {
        return $this->belongsTo(NewsletterSubscriber::class, 'subscriber_id');
    }

    /**
     * Mark email as opened
     */
    public function markAsOpened(): void
    {
        if ($this->opened_at === null) {
            $this->opened_at = Carbon::now();
            $this->save();
            
            // Update newsletter statistics
            $this->newsletter->updateEngagementStats();
        }
    }

    /**
     * Record a click
     */
    public function recordClick(string $url): void
    {
        $now = Carbon::now();
        
        // Set clicked_at if this is the first click
        if ($this->clicked_at === null) {
            $this->clicked_at = $now;
        }
        
        // Increment click count
        $this->click_count += 1;
        
        // Add URL to clicked links array
        $clickedLinks = $this->clicked_links ?? [];
        $clickedLinks[] = [
            'url' => $url,
            'clicked_at' => $now->toISOString(),
        ];
        $this->clicked_links = $clickedLinks;
        
        $this->save();
        
        // Update newsletter statistics
        $this->newsletter->updateEngagementStats();
    }

    /**
     * Mark as delivered
     */
    public function markAsDelivered(): void
    {
        $this->status = 'delivered';
        $this->save();
    }

    /**
     * Mark as bounced
     */
    public function markAsBounced(string $reason): void
    {
        $this->status = 'bounced';
        $this->bounce_reason = $reason;
        $this->save();
    }

    /**
     * Mark as failed
     */
    public function markAsFailed(string $reason): void
    {
        $this->status = 'failed';
        $this->bounce_reason = $reason;
        $this->save();
    }

    /**
     * Check if email was opened
     */
    public function wasOpened(): bool
    {
        return $this->opened_at !== null;
    }

    /**
     * Check if email was clicked
     */
    public function wasClicked(): bool
    {
        return $this->clicked_at !== null;
    }

    /**
     * Get time since sent
     */
    public function getTimeSinceSent(): ?int
    {
        return $this->sent_at ? $this->sent_at->diffInMinutes(Carbon::now()) : null;
    }

    /**
     * Scope for opened emails
     */
    public function scopeOpened($query)
    {
        return $query->whereNotNull('opened_at');
    }

    /**
     * Scope for clicked emails
     */
    public function scopeClicked($query)
    {
        return $query->whereNotNull('clicked_at');
    }

    /**
     * Scope for bounced emails
     */
    public function scopeBounced($query)
    {
        return $query->where('status', 'bounced');
    }

    /**
     * Scope for failed emails
     */
    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }
}
