<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReviewHelpfulVote extends Model
{
    protected $fillable = [
        'user_id',
        'product_review_id',
        'is_helpful',
    ];

    protected $casts = [
        'is_helpful' => 'boolean',
    ];

    /**
     * Get the user who voted
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the review that was voted on
     */
    public function productReview(): BelongsTo
    {
        return $this->belongsTo(ProductReview::class);
    }
}
