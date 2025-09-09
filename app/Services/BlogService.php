<?php

namespace App\Services;

use App\Models\BlogPost;
use App\Models\BlogTag;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class BlogService
{
    public function __construct(
        protected ContentRenderer $contentRenderer
    ) {}

    /**
     * Sync tags for a blog post
     */
    public function syncTags(BlogPost $post, array $tagNames): void
    {
        $tagIds = [];

        foreach ($tagNames as $tagName) {
            $tagName = trim($tagName);
            if (empty($tagName)) {
                continue;
            }

            // Find or create tag
            $tag = BlogTag::firstOrCreate(
                ['slug' => Str::slug($tagName)],
                ['name' => $tagName]
            );

            $tagIds[] = $tag->id;
        }

        $post->tags()->sync($tagIds);
    }

    /**
     * Render blog post content
     */
    public function renderContent(string $content): string
    {
        return $this->contentRenderer->render($content);
    }

    /**
     * Generate excerpt from content
     */
    public function generateExcerpt(string $content, int $maxLength = 200): string
    {
        // Strip HTML tags and decode entities
        $text = html_entity_decode(strip_tags($content), ENT_QUOTES, 'UTF-8');
        
        // Remove extra whitespace
        $text = preg_replace('/\s+/', ' ', trim($text));
        
        if (strlen($text) <= $maxLength) {
            return $text;
        }
        
        // Find the last space before the max length
        $excerpt = substr($text, 0, $maxLength);
        $lastSpace = strrpos($excerpt, ' ');
        
        if ($lastSpace !== false && $lastSpace > $maxLength * 0.8) {
            $excerpt = substr($excerpt, 0, $lastSpace);
        }
        
        return $excerpt . '...';
    }

    /**
     * Get reading time estimate
     */
    public function getReadingTime(string $content): int
    {
        $wordCount = str_word_count(strip_tags($content));
        $wordsPerMinute = 200; // Average reading speed
        
        return max(1, ceil($wordCount / $wordsPerMinute));
    }

    /**
     * Get related posts
     */
    public function getRelatedPosts(BlogPost $post, int $limit = 5): Collection
    {
        $query = BlogPost::published()
            ->where('id', '!=', $post->id)
            ->with(['category', 'tags', 'author']);

        // First, try to find posts with same tags
        $tagIds = $post->tags->pluck('id')->toArray();
        if (!empty($tagIds)) {
            $relatedPosts = $query->clone()
                ->whereHas('tags', function ($q) use ($tagIds) {
                    $q->whereIn('blog_tags.id', $tagIds);
                })
                ->get();

            if ($relatedPosts->count() >= $limit) {
                return $relatedPosts->take($limit);
            }
        }

        // If not enough posts with same tags, include posts from same category
        $categoryPosts = $query->clone()
            ->where('blog_category_id', $post->blog_category_id)
            ->get();

        if (isset($relatedPosts)) {
            $combined = $relatedPosts->merge($categoryPosts)->unique('id');
        } else {
            $combined = $categoryPosts;
        }

        if ($combined->count() >= $limit) {
            return $combined->take($limit);
        }

        // If still not enough, get latest posts
        $latestPosts = $query->clone()
            ->latest('published_at')
            ->get();

        return $combined->merge($latestPosts)->unique('id')->take($limit);
    }

    /**
     * Get popular posts
     */
    public function getPopularPosts(int $limit = 10, int $days = 30): Collection
    {
        return BlogPost::published()
            ->with(['category', 'tags', 'author'])
            ->where('published_at', '>=', now()->subDays($days))
            ->orderBy('views_count', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get featured posts
     */
    public function getFeaturedPosts(int $limit = 5): Collection
    {
        return BlogPost::published()
            ->with(['category', 'tags', 'author'])
            ->where('is_featured', true)
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Search blog posts
     */
    public function searchPosts(string $query, array $filters = []): Collection
    {
        $search = BlogPost::published()
            ->with(['category', 'tags', 'author'])
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('excerpt', 'like', "%{$query}%")
                  ->orWhere('content', 'like', "%{$query}%")
                  ->orWhereHas('tags', function ($tagQuery) use ($query) {
                      $tagQuery->where('name', 'like', "%{$query}%");
                  });
            });

        // Apply category filter
        if (!empty($filters['category_id'])) {
            $search->where('blog_category_id', $filters['category_id']);
        }

        // Apply tag filter
        if (!empty($filters['tag_id'])) {
            $search->whereHas('tags', function ($q) use ($filters) {
                $q->where('blog_tags.id', $filters['tag_id']);
            });
        }

        // Apply date range filter
        if (!empty($filters['date_from'])) {
            $search->where('published_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $search->where('published_at', '<=', $filters['date_to']);
        }

        return $search->orderBy('published_at', 'desc')->get();
    }

    /**
     * Increment post views
     */
    public function incrementViews(BlogPost $post): void
    {
        $post->increment('views_count');
    }

    /**
     * Get posts by tag
     */
    public function getPostsByTag(string $tagSlug, int $limit = 10): Collection
    {
        return BlogPost::published()
            ->with(['category', 'tags', 'author'])
            ->whereHas('tags', function ($q) use ($tagSlug) {
                $q->where('slug', $tagSlug);
            })
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get posts by category
     */
    public function getPostsByCategory(string $categorySlug, int $limit = 10): Collection
    {
        return BlogPost::published()
            ->with(['category', 'tags', 'author'])
            ->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            })
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get blog archive data
     */
    public function getArchiveData(): array
    {
        $posts = BlogPost::published()
            ->selectRaw('YEAR(published_at) as year, MONTH(published_at) as month, COUNT(*) as count')
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get();

        $archive = [];
        foreach ($posts as $post) {
            $year = $post->year;
            if (!isset($archive[$year])) {
                $archive[$year] = [
                    'year' => $year,
                    'months' => [],
                    'total' => 0,
                ];
            }

            $monthName = date('F', mktime(0, 0, 0, $post->month, 1));
            $archive[$year]['months'][] = [
                'month' => $post->month,
                'name' => $monthName,
                'count' => $post->count,
            ];
            $archive[$year]['total'] += $post->count;
        }

        return array_values($archive);
    }

    /**
     * Get blog statistics
     */
    public function getStatistics(): array
    {
        return [
            'total_posts' => BlogPost::published()->count(),
            'total_categories' => \App\Models\BlogCategory::count(),
            'total_tags' => BlogTag::count(),
            'total_views' => BlogPost::sum('views_count'),
            'posts_this_month' => BlogPost::published()
                ->whereMonth('published_at', now()->month)
                ->whereYear('published_at', now()->year)
                ->count(),
            'most_viewed_post' => BlogPost::published()
                ->orderBy('views_count', 'desc')
                ->first(),
            'latest_post' => BlogPost::published()
                ->orderBy('published_at', 'desc')
                ->first(),
        ];
    }

    /**
     * Schedule post publication
     */
    public function schedulePost(BlogPost $post, string $publishAt): void
    {
        $post->update([
            'status' => 'scheduled',
            'published_at' => $publishAt,
        ]);
    }

    /**
     * Publish scheduled posts
     */
    public function publishScheduledPosts(): int
    {
        $posts = BlogPost::where('status', 'scheduled')
            ->where('published_at', '<=', now())
            ->get();

        foreach ($posts as $post) {
            $post->update(['status' => 'published']);
        }

        return $posts->count();
    }

    /**
     * Auto-generate tags from content
     */
    public function generateTagsFromContent(string $content, int $maxTags = 10): array
    {
        // Remove HTML and common words
        $text = strip_tags($content);
        $text = strtolower($text);
        
        // Common words to exclude
        $stopWords = [
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
            'this', 'that', 'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may',
            'might', 'must', 'can', 'it', 'he', 'she', 'we', 'they', 'you', 'i', 'me', 'us', 'him',
            'her', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
        ];

        // Extract words
        preg_match_all('/\b[a-z]{3,}\b/', $text, $matches);
        $words = $matches[0];

        // Filter out stop words and count frequency
        $wordCounts = [];
        foreach ($words as $word) {
            if (!in_array($word, $stopWords) && strlen($word) >= 3) {
                $wordCounts[$word] = ($wordCounts[$word] ?? 0) + 1;
            }
        }

        // Sort by frequency and take top words
        arsort($wordCounts);
        $topWords = array_slice(array_keys($wordCounts), 0, $maxTags);

        // Capitalize first letter
        return array_map('ucfirst', $topWords);
    }
}
