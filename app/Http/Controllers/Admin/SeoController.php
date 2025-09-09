<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\Product;
use App\Models\BlogPost;
use App\Models\BlogCategory;
use App\Services\SeoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class SeoController extends Controller
{
    public function __construct(
        protected SeoService $seoService
    ) {}

    /**
     * Display SEO dashboard
     */
    public function index(): Response
    {
        // Get SEO scores for different content types
        $pageScores = Page::where('status', 'published')->get()->map(function ($page) {
            $analysis = $this->seoService->analyzeSeoScore($page);
            return [
                'id' => $page->id,
                'title' => $page->title,
                'type' => 'page',
                'score' => $analysis['percentage'],
                'grade' => $analysis['grade'],
                'issues_count' => count($analysis['issues']),
                'url' => '/admin/pages/' . $page->id . '/edit',
            ];
        });

        $productScores = Product::where('is_active', true)->limit(10)->get()->map(function ($product) {
            $analysis = $this->seoService->analyzeSeoScore($product);
            return [
                'id' => $product->id,
                'title' => $product->name,
                'type' => 'product',
                'score' => $analysis['percentage'],
                'grade' => $analysis['grade'],
                'issues_count' => count($analysis['issues']),
                'url' => '/admin/products/' . $product->id . '/edit',
            ];
        });

        $blogScores = BlogPost::published()->limit(10)->get()->map(function ($post) {
            $analysis = $this->seoService->analyzeSeoScore($post);
            return [
                'id' => $post->id,
                'title' => $post->title,
                'type' => 'blog_post',
                'score' => $analysis['percentage'],
                'grade' => $analysis['grade'],
                'issues_count' => count($analysis['issues']),
                'url' => '/admin/blog/' . $post->id . '/edit',
            ];
        });

        $allScores = collect()
            ->merge($pageScores)
            ->merge($productScores)
            ->merge($blogScores);

        $averageScore = $allScores->avg('score');
        $issuesCount = $allScores->sum('issues_count');
        $lowScoreItems = $allScores->where('score', '<', 70)->count();

        return Inertia::render('Admin/Seo/Index', [
            'overview' => [
                'average_score' => round($averageScore, 1),
                'total_items' => $allScores->count(),
                'issues_count' => $issuesCount,
                'low_score_items' => $lowScoreItems,
            ],
            'recent_scores' => $allScores->sortByDesc('score')->take(10)->values(),
        ]);
    }

    /**
     * Analyze SEO for a specific model
     */
    public function analyze(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'model_type' => 'required|in:page,product,blog_post,blog_category',
            'model_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $model = $this->getModel($request->model_type, $request->model_id);
            
            if (!$model) {
                return response()->json([
                    'success' => false,
                    'message' => 'Model not found',
                ], 404);
            }

            $analysis = $this->seoService->analyzeSeoScore($model);
            $metaTags = $this->seoService->generateMetaTags($model);
            $structuredData = $this->seoService->generateStructuredData($model);

            return response()->json([
                'success' => true,
                'analysis' => $analysis,
                'meta_tags' => $metaTags,
                'structured_data' => $structuredData,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Analysis failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update SEO settings for a model
     */
    public function updateSettings(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'model_type' => 'required|in:page,product,blog_post,blog_category',
            'model_id' => 'required|integer',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:255',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string|max:500',
            'og_image' => 'nullable|string',
            'og_type' => 'nullable|string',
            'twitter_card' => 'nullable|string',
            'twitter_title' => 'nullable|string|max:255',
            'twitter_description' => 'nullable|string|max:500',
            'twitter_image' => 'nullable|string',
            'canonical_url' => 'nullable|url',
            'structured_data' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $model = $this->getModel($request->model_type, $request->model_id);
            
            if (!$model) {
                return response()->json([
                    'success' => false,
                    'message' => 'Model not found',
                ], 404);
            }

            $seoSetting = $this->seoService->updateSeoSettings($model, $validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'SEO settings updated successfully',
                'seo_setting' => $seoSetting,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Update failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Generate XML sitemap
     */
    public function generateSitemap(): JsonResponse
    {
        try {
            $sitemapData = $this->seoService->generateSitemapData();
            
            $xml = $this->buildSitemapXml($sitemapData);
            
            // Save sitemap to public directory
            $sitemapPath = public_path('sitemap.xml');
            file_put_contents($sitemapPath, $xml);

            return response()->json([
                'success' => true,
                'message' => 'Sitemap generated successfully',
                'url' => url('sitemap.xml'),
                'urls_count' => count($sitemapData),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Sitemap generation failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Preview meta tags for a URL
     */
    public function previewMeta(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'url' => 'required|url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Extract path from URL and try to find matching model
            $path = parse_url($request->url, PHP_URL_PATH);
            $path = trim($path, '/');

            $model = null;

            // Try to match different URL patterns
            if (empty($path) || $path === '/') {
                // Homepage
                $model = Page::where('is_homepage', true)->first();
            } elseif (str_starts_with($path, 'blog/')) {
                // Blog post
                $slug = str_replace('blog/', '', $path);
                $model = BlogPost::where('slug', $slug)->first();
            } elseif (str_starts_with($path, 'products/')) {
                // Product
                $slug = str_replace('products/', '', $path);
                $model = Product::where('slug', $slug)->first();
            } else {
                // Page
                $model = Page::where('slug', $path)->first();
            }

            if (!$model) {
                return response()->json([
                    'success' => false,
                    'message' => 'No content found for this URL',
                ], 404);
            }

            $metaTags = $this->seoService->generateMetaTags($model);
            $analysis = $this->seoService->analyzeSeoScore($model);

            return response()->json([
                'success' => true,
                'meta_tags' => $metaTags,
                'analysis' => $analysis,
                'model' => [
                    'type' => class_basename($model),
                    'id' => $model->id,
                    'title' => $model->title ?? $model->name ?? 'Unknown',
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Preview failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Optimize title and description
     */
    public function optimize(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $optimizedTitle = null;
        $optimizedDescription = null;

        if ($request->title) {
            $optimizedTitle = $this->seoService->optimizeTitle($request->title);
        }

        if ($request->description) {
            $optimizedDescription = $this->seoService->optimizeDescription($request->description);
        }

        return response()->json([
            'success' => true,
            'optimized_title' => $optimizedTitle,
            'optimized_description' => $optimizedDescription,
        ]);
    }

    /**
     * Get model instance by type and ID
     */
    protected function getModel(string $type, int $id)
    {
        return match ($type) {
            'page' => Page::find($id),
            'product' => Product::find($id),
            'blog_post' => BlogPost::find($id),
            'blog_category' => BlogCategory::find($id),
            default => null,
        };
    }

    /**
     * Build XML sitemap
     */
    protected function buildSitemapXml(array $urls): string
    {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;

        foreach ($urls as $url) {
            $xml .= '  <url>' . PHP_EOL;
            $xml .= '    <loc>' . htmlspecialchars($url['url']) . '</loc>' . PHP_EOL;
            $xml .= '    <lastmod>' . $url['lastmod'] . '</lastmod>' . PHP_EOL;
            $xml .= '    <changefreq>' . $url['changefreq'] . '</changefreq>' . PHP_EOL;
            $xml .= '    <priority>' . $url['priority'] . '</priority>' . PHP_EOL;
            $xml .= '  </url>' . PHP_EOL;
        }

        $xml .= '</urlset>';

        return $xml;
    }
}
