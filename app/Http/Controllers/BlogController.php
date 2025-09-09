<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\BlogPost;
use App\Models\BlogCategory;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $query = BlogPost::with(['category', 'author'])
            ->where('status', 'published')
            ->where('published_at', '<=', now());

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('content', 'LIKE', "%{$search}%")
                  ->orWhere('excerpt', 'LIKE', "%{$search}%");
            });
        }

        // Category filter
        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Tag filter
        if ($request->filled('tag')) {
            $query->whereJsonContains('tags', $request->tag);
        }

        $posts = $query->orderBy('published_at', 'desc')->paginate(12);

        // Get featured posts
        $featuredPosts = BlogPost::where('status', 'published')
            ->where('is_featured', true)
            ->where('published_at', '<=', now())
            ->with(['category', 'author'])
            ->orderBy('published_at', 'desc')
            ->limit(3)
            ->get();

        // Get categories for sidebar
        $categories = BlogCategory::withCount(['posts' => function ($query) {
            $query->where('status', 'published');
        }])->get();

        // Get popular tags
        $popularTags = BlogPost::where('status', 'published')
            ->whereNotNull('tags')
            ->pluck('tags')
            ->filter() // Remove null/empty values
            ->flatten()
            ->unique()
            ->values()
            ->take(20);

        return Inertia::render('Blog/Index', [
            'posts' => $posts,
            'featuredPosts' => $featuredPosts,
            'categories' => $categories,
            'popular_tags' => $popularTags,
            'filters' => $request->only(['search', 'category', 'tag'])
        ]);
    }

    public function show(BlogPost $post)
    {
        // Check if post is published
        if ($post->status !== 'published' || $post->published_at > now()) {
            abort(404);
        }

        $post->load(['category', 'author']);

        // Get related posts
        $relatedPosts = BlogPost::where('status', 'published')
            ->where('id', '!=', $post->id)
            ->where('category_id', $post->category_id)
            ->where('published_at', '<=', now())
            ->with(['category', 'author'])
            ->orderBy('published_at', 'desc')
            ->limit(3)
            ->get();

        // Get previous and next posts
        $previousPost = BlogPost::where('status', 'published')
            ->where('published_at', '<', $post->published_at)
            ->orderBy('published_at', 'desc')
            ->first(['id', 'title', 'slug']);

        $nextPost = BlogPost::where('status', 'published')
            ->where('published_at', '>', $post->published_at)
            ->orderBy('published_at', 'asc')
            ->first(['id', 'title', 'slug']);

        return Inertia::render('Blog/Show', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'content' => $post->content,
                'excerpt' => $post->excerpt,
                'featured_image' => $post->featured_image,
                'gallery_images' => $post->gallery_images,
                'tags' => $post->tags,
                'reading_time' => $post->reading_time,
                'is_featured' => $post->is_featured,
                'seo_title' => $post->seo_title,
                'seo_description' => $post->seo_description,
                'seo_keywords' => $post->seo_keywords,
                'social_image' => $post->social_image,
                'og_title' => $post->og_title,
                'og_description' => $post->og_description,
                'twitter_title' => $post->twitter_title,
                'twitter_description' => $post->twitter_description,
                'published_at' => $post->published_at,
                'updated_at' => $post->updated_at,
                'category' => $post->category,
                'author' => $post->author,
            ],
            'relatedPosts' => $relatedPosts,
            'previousPost' => $previousPost,
            'nextPost' => $nextPost,
        ]);
    }

    public function byCategory(BlogCategory $category)
    {
        $posts = BlogPost::where('status', 'published')
            ->where('category_id', $category->id)
            ->where('published_at', '<=', now())
            ->with(['category', 'author'])
            ->orderBy('published_at', 'desc')
            ->paginate(12);

        return Inertia::render('Blog/Index', [
            'posts' => $posts,
            'currentCategory' => $category,
            'filters' => ['category' => $category->slug]
        ]);
    }

    public function byTag(Request $request, $tag)
    {
        $posts = BlogPost::where('status', 'published')
            ->whereJsonContains('tags', $tag)
            ->where('published_at', '<=', now())
            ->with(['category', 'author'])
            ->orderBy('published_at', 'desc')
            ->paginate(12);

        return Inertia::render('Blog/Index', [
            'posts' => $posts,
            'currentTag' => $tag,
            'filters' => ['tag' => $tag]
        ]);
    }
}
