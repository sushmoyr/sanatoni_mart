<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of products for public browsing
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'images'])
            ->where('status', 'published');

        // Category filtering
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        // Price filtering
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Search functionality
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%")
                  ->orWhere('short_description', 'like', "%{$searchTerm}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        
        switch ($sortBy) {
            case 'price':
                $query->orderBy('price', $sortOrder);
                break;
            case 'name':
                $query->orderBy('name', $sortOrder);
                break;
            default:
                $query->orderBy('created_at', $sortOrder);
        }

        $products = $query->paginate(12)->withQueryString();

        // Get categories for filtering
        $categories = Category::where('status', 'active')->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['category', 'min_price', 'max_price', 'search', 'sort', 'order'])
        ]);
    }

    /**
     * Display the specified product
     */
    public function show(Product $product, Request $request)
    {
        // Track product view
        $this->trackProductView($product, $request);

        // Load product with all relationships
        $product->load(['category', 'images']);

        // Get related products from the same category
        $relatedProducts = Product::with(['images'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('status', 'published')
            ->limit(4)
            ->get();

        return Inertia::render('Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * Get products by category
     */
    public function byCategory(Category $category, Request $request)
    {
        $query = Product::with(['images'])
            ->where('category_id', $category->id)
            ->where('status', 'published');

        // Apply other filters like search, price, etc.
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Sorting
        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        
        switch ($sortBy) {
            case 'price':
                $query->orderBy('price', $sortOrder);
                break;
            case 'name':
                $query->orderBy('name', $sortOrder);
                break;
            default:
                $query->orderBy('created_at', $sortOrder);
        }

        $products = $query->paginate(12)->withQueryString();

        return Inertia::render('Products/Category', [
            'category' => $category,
            'products' => $products,
            'filters' => $request->only(['search', 'min_price', 'max_price', 'sort', 'order'])
        ]);
    }

    /**
     * Search products with autocomplete
     */
    public function search(Request $request)
    {
        $searchTerm = $request->get('q', '');
        
        if (strlen($searchTerm) < 2) {
            return response()->json([]);
        }

        $products = Product::with(['images'])
            ->where('status', 'published')
            ->where(function ($query) use ($searchTerm) {
                $query->where('name', 'like', "%{$searchTerm}%")
                      ->orWhere('short_description', 'like', "%{$searchTerm}%");
            })
            ->limit(10)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'image' => $product->main_image,
                    'url' => route('products.show', $product)
                ];
            });

        return response()->json($products);
    }

    /**
     * Get search autocomplete suggestions
     */
    public function autocomplete(Request $request)
    {
        $query = $request->get('q', '');
        
        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $suggestions = Product::where('status', 'published')
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('short_description', 'like', "%{$query}%");
            })
            ->select('id', 'name', 'price', 'main_image', 'slug')
            ->limit(8)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'image' => $product->main_image,
                    'url' => route('products.show', $product->slug)
                ];
            });

        return response()->json($suggestions);
    }

    /**
     * Track recently viewed product
     */
    public function trackView(Product $product, Request $request)
    {
        $userId = auth()->id();
        $sessionId = $request->session()->getId();

        // Update or create recently viewed record
        \App\Models\RecentlyViewedProduct::updateOrCreate(
            [
                'user_id' => $userId,
                'session_id' => $userId ? null : $sessionId,
                'product_id' => $product->id,
            ],
            [
                'viewed_at' => now(),
            ]
        );

        // Keep only the last 20 items per user/session
        $recentViews = \App\Models\RecentlyViewedProduct::where(function ($query) use ($userId, $sessionId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('session_id', $sessionId);
                }
            })
            ->orderBy('viewed_at', 'desc')
            ->skip(20)
            ->pluck('id');

        if ($recentViews->isNotEmpty()) {
            \App\Models\RecentlyViewedProduct::whereIn('id', $recentViews)->delete();
        }

        return response()->json(['success' => true]);
    }

    /**
     * Get recently viewed products
     */
    public function recentlyViewed(Request $request)
    {
        $userId = auth()->id();
        $sessionId = $request->session()->getId();

        $recentlyViewedProducts = \App\Models\RecentlyViewedProduct::with(['product.images', 'product.category'])
            ->where(function ($query) use ($userId, $sessionId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('session_id', $sessionId);
                }
            })
            ->recent(12)
            ->get()
            ->map(function ($recentView) {
                return [
                    'id' => $recentView->product->id,
                    'name' => $recentView->product->name,
                    'price' => $recentView->product->price,
                    'image' => $recentView->product->main_image,
                    'category' => $recentView->product->category->name ?? null,
                    'url' => route('products.show', $recentView->product->slug),
                    'viewed_at' => $recentView->viewed_at->diffForHumans(),
                ];
            });

        return response()->json($recentlyViewedProducts);
    }

    /**
     * Private method to track product views
     */
    private function trackProductView(Product $product, Request $request)
    {
        $userId = auth()->id();
        $sessionId = $request->session()->getId();

        // Update or create recently viewed record
        \App\Models\RecentlyViewedProduct::updateOrCreate(
            [
                'user_id' => $userId,
                'session_id' => $userId ? null : $sessionId,
                'product_id' => $product->id,
            ],
            [
                'viewed_at' => now(),
            ]
        );

        // Keep only the last 20 items per user/session
        $recentViews = \App\Models\RecentlyViewedProduct::where(function ($query) use ($userId, $sessionId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('session_id', $sessionId);
                }
            })
            ->orderBy('viewed_at', 'desc')
            ->skip(20)
            ->pluck('id');

        if ($recentViews->isNotEmpty()) {
            \App\Models\RecentlyViewedProduct::whereIn('id', $recentViews)->delete();
        }
    }
}
