<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductReview;
use App\Models\ReviewHelpfulVote;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductReviewController extends Controller
{
    /**
     * Display reviews for a specific product (AJAX)
     */
    public function index(Product $product, Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort', 'newest'); // newest, oldest, rating_high, rating_low, helpful
        $filterRating = $request->get('rating'); // 1-5 star filter
        
        $query = $product->approvedReviews()
            ->with(['user', 'helpfulVotes']);
            
        // Apply rating filter
        if ($filterRating) {
            $query->where('rating', $filterRating);
        }
        
        // Apply sorting
        switch ($sortBy) {
            case 'oldest':
                $query->oldest();
                break;
            case 'rating_high':
                $query->orderBy('rating', 'desc');
                break;
            case 'rating_low':
                $query->orderBy('rating', 'asc');
                break;
            case 'helpful':
                $query->orderBy('helpful_votes', 'desc');
                break;
            default: // newest
                $query->latest();
        }
        
        $reviews = $query->paginate($perPage);
        
        // Add user vote status if authenticated
        if (Auth::check()) {
            $reviews->getCollection()->transform(function ($review) {
                $review->user_vote = $review->hasUserVotedHelpful(Auth::user());
                return $review;
            });
        }
        
        return response()->json([
            'reviews' => $reviews,
            'stats' => [
                'average_rating' => $product->average_rating,
                'total_reviews' => $product->reviews_count,
                'breakdown' => $product->reviews_breakdown,
            ]
        ]);
    }

    /**
     * Store a new product review
     */
    public function store(Request $request, Product $product): JsonResponse
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return response()->json([
                'message' => 'You must be logged in to write a review.',
            ], 401);
        }

        $user = Auth::user();
        
        // Check if user has already reviewed this product
        if ($product->reviews()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'message' => 'You have already reviewed this product.',
            ], 422);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'required|string|min:10|max:2000',
        ]);

        // Check if user has purchased this product (optional)
        $verifiedPurchaseData = null;
        $orderItem = OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.user_id', $user->id)
            ->where('order_items.product_id', $product->id)
            ->whereIn('orders.status', ['delivered', 'completed'])
            ->first(['orders.id as order_id', 'orders.created_at as order_date']);
            
        if ($orderItem) {
            $verifiedPurchaseData = [
                'order_id' => $orderItem->order_id,
                'order_date' => $orderItem->order_date,
            ];
        }

        $review = $product->reviews()->create([
            'user_id' => $user->id,
            'rating' => $validated['rating'],
            'title' => $validated['title'],
            'comment' => $validated['comment'],
            'verified_purchase_data' => $verifiedPurchaseData,
            'status' => 'pending', // Reviews start as pending for moderation
        ]);

        return response()->json([
            'message' => 'Review submitted successfully! It will be visible after approval.',
            'review' => $review->load('user'),
        ], 201);
    }

    /**
     * Vote on a review as helpful or not helpful
     */
    public function vote(Request $request, ProductReview $review): JsonResponse
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'You must be logged in to vote on reviews.',
            ], 401);
        }

        $validated = $request->validate([
            'is_helpful' => 'required|boolean',
        ]);

        $user = Auth::user();

        // Check if user is trying to vote on their own review
        if ($review->user_id === $user->id) {
            return response()->json([
                'message' => 'You cannot vote on your own review.',
            ], 422);
        }

        // Update or create vote
        $vote = ReviewHelpfulVote::updateOrCreate(
            [
                'user_id' => $user->id,
                'product_review_id' => $review->id,
            ],
            [
                'is_helpful' => $validated['is_helpful'],
            ]
        );

        // Update cached helpful votes count
        $review->updateHelpfulVotesCount();

        return response()->json([
            'message' => 'Vote recorded successfully.',
            'helpful_votes_count' => $review->fresh()->helpful_votes_count,
            'user_vote' => $validated['is_helpful'],
        ]);
    }

    /**
     * Remove a vote from a review
     */
    public function removeVote(ProductReview $review): JsonResponse
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'You must be logged in to remove votes.',
            ], 401);
        }

        $user = Auth::user();
        
        $vote = ReviewHelpfulVote::where('user_id', $user->id)
            ->where('product_review_id', $review->id)
            ->first();

        if (!$vote) {
            return response()->json([
                'message' => 'No vote found to remove.',
            ], 404);
        }

        $vote->delete();
        
        // Update cached helpful votes count
        $review->updateHelpfulVotesCount();

        return response()->json([
            'message' => 'Vote removed successfully.',
            'helpful_votes_count' => $review->fresh()->helpful_votes_count,
            'user_vote' => null,
        ]);
    }

    /**
     * Get review statistics for a product
     */
    public function stats(Product $product): JsonResponse
    {
        return response()->json([
            'average_rating' => round($product->average_rating, 1),
            'total_reviews' => $product->reviews_count,
            'breakdown' => $product->reviews_breakdown,
            'verified_purchases_count' => $product->approvedReviews()
                ->whereNotNull('verified_purchase_data')
                ->count(),
        ]);
    }
}
