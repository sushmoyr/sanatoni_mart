<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\BlogCategory;
use App\Models\BlogTag;
use App\Services\BlogService;
use App\Services\SeoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function __construct(
        protected BlogService $blogService,
        protected SeoService $seoService
    ) {}

    /**
     * Display listing of blog posts
     */
    public function index(Request $request): Response
    {
        $query = BlogPost::with(['category', 'tags', 'author'])
            ->latest('created_at');

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('blog_category_id', $request->category);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('author')) {
            $query->where('author_id', $request->author);
        }

        $posts = $query->paginate(10)->withQueryString();

        $categories = BlogCategory::select('id', 'name')->get();
        $tags = BlogTag::select('id', 'name')->get();

        return Inertia::render('Admin/Blog/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'tags' => $tags,
            'filters' => $request->only(['search', 'category', 'status', 'author']),
        ]);
    }

    /**
     * Show form for creating new blog post
     */
    public function create(): Response
    {
        $categories = BlogCategory::select('id', 'name')->get();
        $tags = BlogTag::select('id', 'name')->get();

        return Inertia::render('Admin/Blog/Create', [
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * Store a new blog post
     */
    public function store(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blog_posts,slug',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|string',
            'blog_category_id' => 'required|exists:blog_categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'status' => 'required|in:draft,published,scheduled',
            'published_at' => 'nullable|date',
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
            $data['slug'] = Str::slug($data['title']);
            
            // Ensure uniqueness
            $counter = 1;
            $originalSlug = $data['slug'];
            while (BlogPost::where('slug', $data['slug'])->exists()) {
                $data['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }
        }

        // Set author
        $data['author_id'] = auth()->id();

        // Set published_at if status is published and no date set
        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $post = BlogPost::create($data);

        // Handle tags
        if (!empty($data['tags'])) {
            $this->blogService->syncTags($post, $data['tags']);
        }

        // Create SEO settings
        if ($request->filled(['meta_title', 'meta_description', 'meta_keywords'])) {
            $this->seoService->updateSeoSettings($post, [
                'meta_title' => $data['meta_title'],
                'meta_description' => $data['meta_description'],
                'meta_keywords' => $data['meta_keywords'],
            ]);
        }

        return redirect()->route('admin.blog.index')
            ->with('success', 'Blog post created successfully.');
    }

    /**
     * Display the specified blog post
     */
    public function show(BlogPost $post): Response
    {
        $post->load(['category', 'tags', 'author', 'seoSetting']);
        
        $seoAnalysis = $this->seoService->analyzeSeoScore($post);

        return Inertia::render('Admin/Blog/Show', [
            'post' => $post,
            'seo_analysis' => $seoAnalysis,
        ]);
    }

    /**
     * Show form for editing blog post
     */
    public function edit(BlogPost $post): Response
    {
        $post->load(['category', 'tags', 'seoSetting']);
        
        $categories = BlogCategory::select('id', 'name')->get();
        $tags = BlogTag::select('id', 'name')->get();

        return Inertia::render('Admin/Blog/Edit', [
            'post' => $post,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * Update the specified blog post
     */
    public function update(Request $request, BlogPost $post): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blog_posts,slug,' . $post->id,
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|string',
            'blog_category_id' => 'required|exists:blog_categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'status' => 'required|in:draft,published,scheduled',
            'published_at' => 'nullable|date',
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
            $data['slug'] = Str::slug($data['title']);
            
            // Ensure uniqueness
            $counter = 1;
            $originalSlug = $data['slug'];
            while (BlogPost::where('slug', $data['slug'])->where('id', '!=', $post->id)->exists()) {
                $data['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }
        }

        // Set published_at if status changed to published and no date set
        if ($data['status'] === 'published' && $post->status !== 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $post->update($data);

        // Handle tags
        if (array_key_exists('tags', $data)) {
            $this->blogService->syncTags($post, $data['tags'] ?? []);
        }

        // Update SEO settings
        if ($request->filled(['meta_title', 'meta_description', 'meta_keywords'])) {
            $this->seoService->updateSeoSettings($post, [
                'meta_title' => $data['meta_title'],
                'meta_description' => $data['meta_description'],
                'meta_keywords' => $data['meta_keywords'],
            ]);
        }

        return redirect()->route('admin.blog.index')
            ->with('success', 'Blog post updated successfully.');
    }

    /**
     * Remove the specified blog post
     */
    public function destroy(BlogPost $post): RedirectResponse
    {
        $post->tags()->detach();
        $post->delete();

        return redirect()->route('admin.blog.index')
            ->with('success', 'Blog post deleted successfully.');
    }

    /**
     * Bulk actions for blog posts
     */
    public function bulkAction(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'action' => 'required|in:publish,unpublish,delete,change_category',
            'post_ids' => 'required|array',
            'post_ids.*' => 'integer|exists:blog_posts,id',
            'category_id' => 'required_if:action,change_category|exists:blog_categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $posts = BlogPost::whereIn('id', $request->post_ids);
        $count = $posts->count();

        switch ($request->action) {
            case 'publish':
                $posts->update([
                    'status' => 'published',
                    'published_at' => now(),
                ]);
                $message = "{$count} posts published successfully.";
                break;

            case 'unpublish':
                $posts->update(['status' => 'draft']);
                $message = "{$count} posts unpublished successfully.";
                break;

            case 'change_category':
                $posts->update(['blog_category_id' => $request->category_id]);
                $message = "{$count} posts moved to new category successfully.";
                break;

            case 'delete':
                foreach ($posts->get() as $post) {
                    $post->tags()->detach();
                    $post->delete();
                }
                $message = "{$count} posts deleted successfully.";
                break;
        }

        return response()->json([
            'success' => true,
            'message' => $message,
        ]);
    }

    /**
     * Duplicate a blog post
     */
    public function duplicate(BlogPost $post): RedirectResponse
    {
        $newPost = $post->replicate();
        $newPost->title = $post->title . ' (Copy)';
        $newPost->slug = $post->slug . '-copy-' . time();
        $newPost->status = 'draft';
        $newPost->published_at = null;
        $newPost->author_id = auth()->id();
        $newPost->save();

        // Duplicate tags
        $newPost->tags()->attach($post->tags->pluck('id'));

        return redirect()->route('admin.blog.edit', $newPost)
            ->with('success', 'Blog post duplicated successfully.');
    }

    /**
     * Preview blog post
     */
    public function preview(BlogPost $post): Response
    {
        $post->load(['category', 'tags', 'author']);
        
        // Render content
        $renderedContent = $this->blogService->renderContent($post->content);

        return Inertia::render('Blog/Show', [
            'post' => array_merge($post->toArray(), [
                'rendered_content' => $renderedContent,
            ]),
            'is_preview' => true,
        ]);
    }

    /**
     * Get blog statistics
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total_posts' => BlogPost::count(),
            'published_posts' => BlogPost::where('status', 'published')->count(),
            'draft_posts' => BlogPost::where('status', 'draft')->count(),
            'scheduled_posts' => BlogPost::where('status', 'scheduled')->count(),
            'total_categories' => BlogCategory::count(),
            'total_tags' => BlogTag::count(),
            'posts_this_month' => BlogPost::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'views_this_month' => BlogPost::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('views_count'),
        ];

        // Recent activity
        $recentPosts = BlogPost::with(['category', 'author'])
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
