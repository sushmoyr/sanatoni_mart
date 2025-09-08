<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Newsletter extends Model
{
    protected $fillable = [
        'subject',
        'content',
        'text_content',
        'template',
        'recipient_criteria',
        'recipient_count',
        'scheduled_at',
        'sent_at',
        'status',
        'sent_count',
        'failed_count',
        'opened_count',
        'clicked_count',
        'failure_reason',
        'created_by',
    ];

    protected $casts = [
        'recipient_criteria' => 'array',
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    /**
     * Get the user who created this newsletter
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get newsletter sends for this newsletter
     */
    public function newsletterSends(): HasMany
    {
        return $this->hasMany(NewsletterSend::class);
    }

    /**
     * Check if newsletter is scheduled
     */
    public function isScheduled(): bool
    {
        return $this->status === 'scheduled' && 
               $this->scheduled_at && 
               $this->scheduled_at->isFuture();
    }

    /**
     * Check if newsletter is ready to send
     */
    public function isReadyToSend(): bool
    {
        return $this->status === 'scheduled' && 
               ($this->scheduled_at === null || $this->scheduled_at->isPast());
    }

    /**
     * Check if newsletter has been sent
     */
    public function isSent(): bool
    {
        return $this->status === 'sent' && $this->sent_at !== null;
    }

    /**
     * Mark as sending
     */
    public function markAsSending(): void
    {
        $this->status = 'sending';
        $this->save();
    }

    /**
     * Mark as sent
     */
    public function markAsSent(): void
    {
        $this->status = 'sent';
        $this->sent_at = Carbon::now();
        $this->save();
    }

    /**
     * Mark as failed
     */
    public function markAsFailed(string $reason): void
    {
        $this->status = 'failed';
        $this->failure_reason = $reason;
        $this->save();
    }

    /**
     * Update send statistics
     */
    public function updateSendStats(int $sent = 0, int $failed = 0): void
    {
        $this->sent_count += $sent;
        $this->failed_count += $failed;
        $this->save();
    }

    /**
     * Update engagement statistics
     */
    public function updateEngagementStats(): void
    {
        $this->opened_count = $this->newsletterSends()->whereNotNull('opened_at')->count();
        $this->clicked_count = $this->newsletterSends()->whereNotNull('clicked_at')->count();
        $this->save();
    }

    /**
     * Get engagement metrics
     */
    public function getEngagementMetrics(): array
    {
        $totalSent = $this->sent_count;
        
        return [
            'open_rate' => $totalSent > 0 ? ($this->opened_count / $totalSent) * 100 : 0,
            'click_rate' => $totalSent > 0 ? ($this->clicked_count / $totalSent) * 100 : 0,
            'delivery_rate' => $this->recipient_count > 0 
                ? (($totalSent - $this->failed_count) / $this->recipient_count) * 100 
                : 0,
            'failure_rate' => $this->recipient_count > 0 
                ? ($this->failed_count / $this->recipient_count) * 100 
                : 0,
        ];
    }

    /**
     * Get recipients based on criteria
     */
    public function getRecipients()
    {
        $query = NewsletterSubscriber::subscribed();
        
        if ($this->recipient_criteria) {
            // Apply criteria filters
            foreach ($this->recipient_criteria as $criterion => $value) {
                switch ($criterion) {
                    case 'source':
                        $query->where('source', $value);
                        break;
                    case 'subscribed_after':
                        $query->where('subscribed_at', '>=', $value);
                        break;
                    case 'subscribed_before':
                        $query->where('subscribed_at', '<=', $value);
                        break;
                }
            }
        }
        
        return $query->get();
    }

    /**
     * Scope for sent newsletters
     */
    public function scopeSent($query)
    {
        return $query->where('status', 'sent');
    }

    /**
     * Scope for scheduled newsletters
     */
    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    /**
     * Scope for draft newsletters
     */
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    /**
     * Scope for newsletters ready to send
     */
    public function scopeReadyToSend($query)
    {
        return $query->where('status', 'scheduled')
            ->where(function ($q) {
                $q->whereNull('scheduled_at')
                  ->orWhere('scheduled_at', '<=', Carbon::now());
            });
    }
}
