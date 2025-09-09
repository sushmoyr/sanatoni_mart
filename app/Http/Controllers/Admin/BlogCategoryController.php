<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use App\Services\SeoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BlogCategoryController extends Controller
{
    public function __construct(
        protected SeoService $seoService
    ) {}

    /**
     * Display listing of blog categories
     */
    public function index(Request $request): Response
    {
        $query = BlogCategory::withCount('posts')
            ->orderBy('name');

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $categories = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Blog/Categories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show form for creating new blog category
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Blog/Categories/Create');
    }

    /**
     * Store a new blog category
     */
    public function store(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:blog_categories,name',
            'slug' => 'nullable|string|max:255|unique:blog_categories,slug',
            'description' => 'nullable|string|max:1000',
            'color' => 'nullable|string|max:7|regex:/^#[0-9A-F]{6}$/i',
            'image' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
            
            // Ensure uniqueness
            $counter = 1;
            $originalSlug = $data['slug'];
            while (BlogCategory::where('slug', $data['slug'])->exists()) {
                $data['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }
        }

        // Set default color if not provided
        if (empty($data['color'])) {
            $data['color'] = '#' . str_pad(dechex(mt_rand(0, 0xFFFFFF)), 6, '0', STR_PAD_LEFT);
        }

        $category = BlogCategory::create($data);

        // Create SEO settings
        if ($request->filled(['meta_title', 'meta_description', 'meta_keywords'])) {
            $this->seoService->updateSeoSettings($category, [
                'meta_title' => $data['meta_title'],
                'meta_description' => $data['meta_description'],
                'meta_keywords' => $data['meta_keywords'],
            ]);
        }

        return redirect()->route('admin.blog.categories.index')
            ->with('success', 'Blog category created successfully.');
    }

    /**
     * Display the specified blog category
     */
    public function show(BlogCategory $category): Response
    {
        $category->load(['posts' => function ($query) {
            $query->with(['author', 'tags'])
                  ->latest('created_at')
                  ->limit(10);
        }, 'seoSetting']);

        $seoAnalysis = $this->seoService->analyzeSeoScore($category);

        return Inertia::render('Admin/Blog/Categories/Show', [
            'category' => $category,
            'seo_analysis' => $seoAnalysis,
        ]);
    }

    /**
     * Show form for editing blog category
     */
    public function edit(BlogCategory $category): Response
    {
        $category->load('seoSetting');

        return Inertia::render('Admin/Blog/Categories/Edit', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified blog category
     */
    public function update(Request $request, BlogCategory $category): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:blog_categories,name,' . $category->id,
            'slug' => 'nullable|string|max:255|unique:blog_categories,slug,' . $category->id,
            'description' => 'nullable|string|max:1000',
            'color' => 'nullable|string|max:7|regex:/^#[0-9A-F]{6}$/i',
            'image' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
            
            // Ensure uniqueness
            $counter = 1;
            $originalSlug = $data['slug'];
            while (BlogCategory::where('slug', $data['slug'])->where('id', '!=', $category->id)->exists()) {
                $data['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }
        }

        $category->update($data);

        // Update SEO settings
        if ($request->filled(['meta_title', 'meta_description', 'meta_keywords'])) {
            $this->seoService->updateSeoSettings($category, [
                'meta_title' => $data['meta_title'],
                'meta_description' => $data['meta_description'],
                'meta_keywords' => $data['meta_keywords'],
            ]);
        }

        return redirect()->route('admin.blog.categories.index')
            ->with('success', 'Blog category updated successfully.');
    }

    /**
     * Remove the specified blog category
     */
    public function destroy(BlogCategory $category): RedirectResponse
    {
        // Check if category has posts
        if ($category->posts()->count() > 0) {
            return back()->withErrors([
                'category' => 'Cannot delete category that has blog posts. Please move or delete the posts first.',
            ]);
        }

        $category->delete();

        return redirect()->route('admin.blog.categories.index')
            ->with('success', 'Blog category deleted successfully.');
    }

    /**
     * Get categories for API/AJAX requests
     */
    public function api(): JsonResponse
    {
        $categories = BlogCategory::select('id', 'name', 'slug', 'color')
            ->withCount('posts')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'categories' => $categories,
        ]);
    }

    /**
     * Bulk actions for blog categories
     */
    public function bulkAction(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'action' => 'required|in:delete',
            'category_ids' => 'required|array',
            'category_ids.*' => 'integer|exists:blog_categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $categories = BlogCategory::whereIn('id', $request->category_ids);
        
        // Check if any categories have posts
        $categoriesWithPosts = $categories->has('posts')->count();
        
        if ($categoriesWithPosts > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete categories that have blog posts. Please move or delete the posts first.',
            ], 422);
        }

        $count = $categories->count();
        $categories->delete();

        return response()->json([
            'success' => true,
            'message' => "{$count} categories deleted successfully.",
        ]);
    }

    /**
     * Reorder categories
     */
    public function reorder(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'categories' => 'required|array',
            'categories.*.id' => 'required|integer|exists:blog_categories,id',
            'categories.*.sort_order' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            foreach ($request->categories as $categoryData) {
                BlogCategory::where('id', $categoryData['id'])
                    ->update(['sort_order' => $categoryData['sort_order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Categories reordered successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Reordering failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get category statistics
     */
    public function statistics(BlogCategory $category): JsonResponse
    {
        $stats = [
            'total_posts' => $category->posts()->count(),
            'published_posts' => $category->posts()->where('status', 'published')->count(),
            'draft_posts' => $category->posts()->where('status', 'draft')->count(),
            'scheduled_posts' => $category->posts()->where('status', 'scheduled')->count(),
            'posts_this_month' => $category->posts()
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'views_this_month' => $category->posts()
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('views_count'),
        ];

        // Recent posts in this category
        $recentPosts = $category->posts()
            ->with(['author', 'tags'])
            ->latest('created_at')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'stats' => $stats,
            'recent_posts' => $recentPosts,
        ]);
    }
}
