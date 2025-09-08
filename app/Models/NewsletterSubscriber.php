<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Carbon\Carbon;

class NewsletterSubscriber extends Model
{
    protected $fillable = [
        'email',
        'name',
        'status',
        'verification_token',
        'verified_at',
        'subscribed_at',
        'unsubscribed_at',
        'unsubscribe_token',
        'preferences',
        'source',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'preferences' => 'array',
        'verified_at' => 'datetime',
        'subscribed_at' => 'datetime',
        'unsubscribed_at' => 'datetime',
    ];

    /**
     * Get newsletter sends for this subscriber
     */
    public function newsletterSends(): HasMany
    {
        return $this->hasMany(NewsletterSend::class, 'subscriber_id');
    }

    /**
     * Check if subscriber is active
     */
    public function isSubscribed(): bool
    {
        return $this->status === 'subscribed';
    }

    /**
     * Check if subscriber needs verification
     */
    public function needsVerification(): bool
    {
        return $this->status === 'pending_verification';
    }

    /**
     * Generate verification token
     */
    public function generateVerificationToken(): string
    {
        $this->verification_token = Str::random(64);
        $this->save();
        
        return $this->verification_token;
    }

    /**
     * Generate unsubscribe token
     */
    public function generateUnsubscribeToken(): string
    {
        $this->unsubscribe_token = Str::random(64);
        $this->save();
        
        return $this->unsubscribe_token;
    }

    /**
     * Verify subscription
     */
    public function verify(): void
    {
        $this->status = 'subscribed';
        $this->verified_at = Carbon::now();
        $this->subscribed_at = Carbon::now();
        $this->verification_token = null;
        $this->save();
    }

    /**
     * Unsubscribe
     */
    public function unsubscribe(string $reason = null): void
    {
        $this->status = 'unsubscribed';
        $this->unsubscribed_at = Carbon::now();
        
        if ($reason) {
            $preferences = $this->preferences ?? [];
            $preferences['unsubscribe_reason'] = $reason;
            $this->preferences = $preferences;
        }
        
        $this->save();
    }

    /**
     * Resubscribe
     */
    public function resubscribe(): void
    {
        $this->status = 'subscribed';
        $this->subscribed_at = Carbon::now();
        $this->unsubscribed_at = null;
        $this->unsubscribe_token = null;
        $this->save();
    }

    /**
     * Get subscriber's engagement statistics
     */
    public function getEngagementStats(): array
    {
        $sends = $this->newsletterSends();
        
        return [
            'emails_received' => $sends->count(),
            'emails_opened' => $sends->whereNotNull('opened_at')->count(),
            'emails_clicked' => $sends->whereNotNull('clicked_at')->count(),
            'total_clicks' => $sends->sum('click_count'),
            'open_rate' => $sends->count() > 0 
                ? ($sends->whereNotNull('opened_at')->count() / $sends->count()) * 100 
                : 0,
            'click_rate' => $sends->count() > 0 
                ? ($sends->whereNotNull('clicked_at')->count() / $sends->count()) * 100 
                : 0,
        ];
    }

    /**
     * Scope for subscribed users
     */
    public function scopeSubscribed($query)
    {
        return $query->where('status', 'subscribed');
    }

    /**
     * Scope for unsubscribed users
     */
    public function scopeUnsubscribed($query)
    {
        return $query->where('status', 'unsubscribed');
    }

    /**
     * Scope for pending verification
     */
    public function scopePendingVerification($query)
    {
        return $query->where('status', 'pending_verification');
    }

    /**
     * Scope for subscribers from a specific source
     */
    public function scopeFromSource($query, string $source)
    {
        return $query->where('source', $source);
    }
}
