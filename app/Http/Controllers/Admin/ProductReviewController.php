<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductReviewController extends Controller
{
    /**
     * Display a listing of product reviews for admin
     */
    public function index(Request $request): Response
    {
        $query = ProductReview::with(['product', 'user', 'approver']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('comment', 'like', "%{$search}%")
                  ->orWhereHas('product', function ($productQuery) use ($search) {
                      $productQuery->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        // Rating filter
        if ($request->filled('rating')) {
            $query->where('rating', $request->get('rating'));
        }

        // Product filter
        if ($request->filled('product_id')) {
            $query->where('product_id', $request->get('product_id'));
        }

        // Verified purchase filter
        if ($request->filled('verified_only')) {
            $query->whereNotNull('verified_purchase_data');
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortBy, $sortDirection);

        $reviews = $query->paginate(15);

        // Get filter options
        $products = Product::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => $reviews,
            'products' => $products,
            'filters' => $request->only(['search', 'status', 'rating', 'product_id', 'verified_only', 'sort_by', 'sort_direction']),
            'stats' => [
                'total' => ProductReview::count(),
                'pending' => ProductReview::where('status', 'pending')->count(),
                'approved' => ProductReview::where('status', 'approved')->count(),
                'rejected' => ProductReview::where('status', 'rejected')->count(),
                'avg_rating' => ProductReview::where('status', 'approved')->avg('rating') ?? 0,
                'total_votes' => ProductReview::sum('helpful_votes'),
            ]
        ]);
    }

    /**
     * Display the specified review
     */
    public function show(ProductReview $review): Response
    {
        $review->load(['product', 'user', 'approver', 'helpfulVotes.user']);

        return Inertia::render('Admin/Reviews/Show', [
            'review' => $review,
        ]);
    }

    /**
     * Approve a review
     */
    public function approve(ProductReview $review): RedirectResponse
    {
        $review->approve(auth()->user());

        return back()->with('success', 'Review approved successfully.');
    }

    /**
     * Reject a review
     */
    public function reject(ProductReview $review): RedirectResponse
    {
        $review->reject();

        return back()->with('success', 'Review rejected successfully.');
    }

    /**
     * Bulk approve reviews
     */
    public function bulkApprove(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'review_ids' => 'required|array',
            'review_ids.*' => 'exists:product_reviews,id',
        ]);

        $updated = ProductReview::whereIn('id', $validated['review_ids'])
            ->where('status', 'pending')
            ->update([
                'status' => 'approved',
                'approved_at' => now(),
                'approved_by' => auth()->id(),
            ]);

        return back()->with('success', "{$updated} reviews approved successfully.");
    }

    /**
     * Bulk reject reviews
     */
    public function bulkReject(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'review_ids' => 'required|array',
            'review_ids.*' => 'exists:product_reviews,id',
        ]);

        $updated = ProductReview::whereIn('id', $validated['review_ids'])
            ->whereIn('status', ['pending', 'approved'])
            ->update([
                'status' => 'rejected',
                'approved_at' => null,
                'approved_by' => null,
            ]);

        return back()->with('success', "{$updated} reviews rejected successfully.");
    }

    /**
     * Delete a review
     */
    public function destroy(ProductReview $review): RedirectResponse
    {
        $productName = $review->product->name;
        $review->delete();

        return redirect()->route('admin.reviews.index')
            ->with('success', "Review for '{$productName}' deleted successfully.");
    }

    /**
     * Get review statistics for dashboard
     */
    public function statistics(): Response
    {
        $totalReviews = ProductReview::count();
        $pendingReviews = ProductReview::where('status', 'pending')->count();
        $approvedReviews = ProductReview::where('status', 'approved')->count();
        $rejectedReviews = ProductReview::where('status', 'rejected')->count();
        $averageRating = ProductReview::where('status', 'approved')->avg('rating') ?? 0;
        
        $reviewsThisMonth = ProductReview::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
            
        $reviewsLastMonth = ProductReview::whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->count();

        // Rating distribution
        $ratingDistribution = [];
        for ($i = 1; $i <= 5; $i++) {
            $ratingDistribution[$i] = ProductReview::where('status', 'approved')
                ->where('rating', $i)
                ->count();
        }

        // Top rated products
        $topRatedProducts = Product::select(['id', 'name', 'slug', 'main_image'])
            ->withCount('approvedReviews')
            ->having('approved_reviews_count', '>', 0)
            ->orderByRaw('(SELECT AVG(rating) FROM product_reviews WHERE product_id = products.id AND status = "approved") DESC')
            ->take(6)
            ->get()
            ->map(function ($product) {
                $averageRating = ProductReview::where('product_id', $product->id)
                    ->where('status', 'approved')
                    ->avg('rating');
                $product->average_rating = $averageRating ?? 0;
                $product->reviews_count = $product->approved_reviews_count;
                return $product;
            });

        // Recent activity (last 10 activities)
        $recentActivity = ProductReview::with(['product:id,name', 'user:id,name'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($review) {
                return [
                    'type' => 'review_submitted',
                    'review_id' => $review->id,
                    'product_name' => $review->product->name,
                    'user_name' => $review->user->name,
                    'date' => $review->created_at->toISOString(),
                ];
            });

        // Monthly trends (last 6 months)
        $monthlyTrends = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $reviewsCount = ProductReview::whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->count();
            
            $avgRating = ProductReview::whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->where('status', 'approved')
                ->avg('rating') ?? 0;

            $monthlyTrends[] = [
                'month' => $date->format('M Y'),
                'reviews_count' => $reviewsCount,
                'average_rating' => round($avgRating, 1),
            ];
        }

        $statistics = [
            'total_reviews' => $totalReviews,
            'pending_reviews' => $pendingReviews,
            'approved_reviews' => $approvedReviews,
            'rejected_reviews' => $rejectedReviews,
            'average_rating' => round($averageRating, 2),
            'total_helpful_votes' => ProductReview::sum('helpful_votes'),
            'verified_reviews' => ProductReview::whereNotNull('verified_purchase_data')->count(),
            'reviews_this_month' => $reviewsThisMonth,
            'reviews_last_month' => $reviewsLastMonth,
            'rating_distribution' => $ratingDistribution,
            'top_rated_products' => $topRatedProducts,
            'recent_activity' => $recentActivity,
            'monthly_trends' => $monthlyTrends,
        ];

        return Inertia::render('Admin/Reviews/Statistics', [
            'statistics' => $statistics,
        ]);
    }
}
