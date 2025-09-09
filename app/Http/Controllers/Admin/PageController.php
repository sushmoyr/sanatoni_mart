<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\Category;
use App\Models\Product;
use App\Services\PageBuilderService;
use App\Services\SeoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Exception;

class PageController extends Controller
{
    public function __construct(
        protected PageBuilderService $pageBuilderService,
        protected SeoService $seoService
    ) {}

    /**
     * Display a listing of pages
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search');
        $status = $request->get('status');
        $perPage = $request->get('per_page', 15);

        $query = Page::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        $pages = $query->orderBy('updated_at', 'desc')->paginate($perPage);

        return Inertia::render('Admin/Pages/Index', [
            'pages' => $pages,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'templates' => [
                ['value' => 'default', 'label' => 'Default'],
                ['value' => 'homepage', 'label' => 'Homepage'],
                ['value' => 'contact', 'label' => 'Contact'],
                ['value' => 'about', 'label' => 'About'],
                ['value' => 'landing', 'label' => 'Landing'],
            ],
            'statuses' => [
                ['value' => 'draft', 'label' => 'Draft', 'color' => 'gray'],
                ['value' => 'published', 'label' => 'Published', 'color' => 'green'],
                ['value' => 'scheduled', 'label' => 'Scheduled', 'color' => 'blue'],
                ['value' => 'archived', 'label' => 'Archived', 'color' => 'red'],
            ],
        ]);
    }

    /**
     * Show the form for creating a new page
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Pages/Create', [
            'templates' => [
                ['value' => 'default', 'label' => 'Default'],
                ['value' => 'homepage', 'label' => 'Homepage'],
                ['value' => 'contact', 'label' => 'Contact'],
                ['value' => 'about', 'label' => 'About'],
                ['value' => 'landing', 'label' => 'Landing'],
            ],
        ]);
    }

    /**
     * Store a newly created page
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pages,slug',
            'content' => 'nullable|string',
            'excerpt' => 'nullable|string',
            'status' => 'required|in:draft,published,scheduled',
            'template' => 'nullable|string',
            'sections' => 'nullable|array',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
            'seo_keywords' => 'nullable|string',
            'social_image' => 'nullable|string',
            'og_title' => 'nullable|string',
            'og_description' => 'nullable|string',
            'twitter_title' => 'nullable|string',
            'twitter_description' => 'nullable|string',
        ]);

        $data = $request->all();
        $data['created_by'] = auth()->id();

        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = \Illuminate\Support\Str::slug($data['title']);
        }

        $page = Page::create($data);

        return redirect()->route('admin.pages.index')
            ->with('success', 'Page created successfully!');
    }

    /**
     * Display the specified page
     */
    public function show(Page $page): Response
    {
        $page->load(['sections' => function ($query) {
            $query->orderBy('sort_order');
        }, 'creator', 'seoSetting']);

        return Inertia::render('Admin/Pages/Show', [
            'page' => $page,
        ]);
    }

    /**
     * Show the form for editing the specified page
     */
    public function edit(Page $page): Response
    {
        $page->load(['sections' => function ($query) {
            $query->orderBy('sort_order');
        }, 'seoSetting']);

        $availableSections = $this->pageBuilderService->getAvailableSectionTypes();
        $categories = Category::where('is_active', true)->get(['id', 'name']);
        $products = Product::where('is_active', true)->get(['id', 'name']);

        return Inertia::render('Admin/Pages/Edit', [
            'page' => $page,
            'availableSections' => $availableSections,
            'categories' => $categories,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified page
     */
    public function update(Request $request, Page $page): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pages,slug,' . $page->id,
            'content' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:255',
            'status' => 'required|in:draft,published,archived',
            'template' => 'nullable|string',
            'settings' => 'nullable|array',
            'is_homepage' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $data = $validator->validated();

            // If this is set as homepage, unset other homepages
            if ($data['is_homepage'] ?? false) {
                Page::where('is_homepage', true)->where('id', '!=', $page->id)->update(['is_homepage' => false]);
            }

            $page->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Page updated successfully',
                'page' => $page->fresh(['sections', 'creator']),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update page: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified page
     */
    public function destroy(Page $page): JsonResponse
    {
        try {
            $page->delete();

            return response()->json([
                'success' => true,
                'message' => 'Page deleted successfully',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete page: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Duplicate a page
     */
    public function duplicate(Page $page): JsonResponse
    {
        try {
            $newPage = $page->replicate();
            $newPage->title = $page->title . ' (Copy)';
            $newPage->slug = $page->slug . '-copy-' . time();
            $newPage->status = 'draft';
            $newPage->is_homepage = false;
            $newPage->created_by = auth()->id();
            $newPage->save();

            // Duplicate sections
            foreach ($page->sections as $section) {
                $newSection = $section->replicate();
                $newSection->page_id = $newPage->id;
                $newSection->save();
            }

            return response()->json([
                'success' => true,
                'message' => 'Page duplicated successfully',
                'page' => $newPage->load(['sections', 'creator']),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to duplicate page: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Preview a page
     */
    public function preview(Page $page): Response
    {
        $page->load(['sections' => function ($query) {
            $query->where('is_active', true)->orderBy('sort_order');
        }]);

        return Inertia::render('Admin/Pages/Preview', [
            'page' => $page,
        ]);
    }

    /**
     * Export page data
     */
    public function export(Page $page): JsonResponse
    {
        try {
            $exportData = $this->pageBuilderService->exportPage($page);

            return response()->json([
                'success' => true,
                'data' => $exportData,
                'filename' => 'page-' . $page->slug . '-' . date('Y-m-d') . '.json',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export page: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Import page data
     */
    public function import(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'data' => 'required|array',
            'data.page' => 'required|array',
            'data.sections' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $page = $this->pageBuilderService->importPage($request->data, auth()->id());

            return response()->json([
                'success' => true,
                'message' => 'Page imported successfully',
                'page' => $page->load(['sections', 'creator']),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to import page: ' . $e->getMessage(),
            ], 500);
        }
    }
}
