<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Carbon\Carbon;

class ProductReview extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
        'rating',
        'title',
        'comment',
        'status',
        'verified_purchase_data',
    ];

    protected $casts = [
        'rating' => 'integer',
        'helpful_votes' => 'integer',
        'verified_purchase_data' => 'array',
        'approved_at' => 'datetime',
    ];

    /**
     * Get the user who wrote this review
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the product being reviewed
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the user who approved this review
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get helpful votes for this review
     */
    public function helpfulVotes(): HasMany
    {
        return $this->hasMany(ReviewHelpfulVote::class);
    }

    /**
     * Scope for approved reviews
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope for pending reviews
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for rejected reviews
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Scope for reviews by rating
     */
    public function scopeByRating($query, int $rating)
    {
        return $query->where('rating', $rating);
    }

    /**
     * Scope for verified purchase reviews
     */
    public function scopeVerifiedPurchase($query)
    {
        return $query->whereNotNull('verified_purchase_data');
    }

    /**
     * Check if this review is from a verified purchase
     */
    public function isVerifiedPurchase(): bool
    {
        return !empty($this->verified_purchase_data);
    }

    /**
     * Get the review's formatted date
     */
    protected function createdAtFormatted(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->created_at->format('F j, Y')
        );
    }

    /**
     * Get the reviewer's name (with privacy if needed)
     */
    public function getReviewerNameAttribute(): string
    {
        if (!$this->user) {
            return 'Anonymous';
        }
        
        return $this->user->name;
    }

    /**
     * Get helpful votes count
     */
    public function getHelpfulVotesCountAttribute(): int
    {
        return $this->helpfulVotes()->where('is_helpful', true)->count();
    }

    /**
     * Get unhelpful votes count
     */
    public function getUnhelpfulVotesCountAttribute(): int
    {
        return $this->helpfulVotes()->where('is_helpful', false)->count();
    }

    /**
     * Check if a user has voted this review as helpful
     */
    public function hasUserVotedHelpful(User $user): ?bool
    {
        $vote = $this->helpfulVotes()->where('user_id', $user->id)->first();
        return $vote ? $vote->is_helpful : null;
    }

    /**
     * Approve the review
     */
    public function approve(?User $approver = null): void
    {
        $this->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => $approver?->id,
        ]);
    }

    /**
     * Reject the review
     */
    public function reject(): void
    {
        $this->update([
            'status' => 'rejected',
            'approved_at' => null,
            'approved_by' => null,
        ]);
    }

    /**
     * Update helpful votes count (cached for performance)
     */
    public function updateHelpfulVotesCount(): void
    {
        $helpfulCount = $this->helpfulVotes()->where('is_helpful', true)->count();
        $this->update(['helpful_votes' => $helpfulCount]);
    }
}
