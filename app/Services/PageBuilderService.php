<?php

namespace App\Services;

use App\Models\Page;
use App\Models\PageSection;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Collection;

class PageBuilderService
{
    /**
     * Get available section types for page builder
     */
    public function getAvailableSectionTypes(): array
    {
        return [
            'hero' => [
                'name' => 'Hero Section',
                'description' => 'Large banner with background image, title, and call-to-action',
                'icon' => '🏆',
                'fields' => [
                    'title' => ['type' => 'text', 'required' => true],
                    'subtitle' => ['type' => 'text', 'required' => false],
                    'background_image' => ['type' => 'image', 'required' => false],
                    'background_video' => ['type' => 'video', 'required' => false],
                    'overlay_opacity' => ['type' => 'range', 'min' => 0, 'max' => 100, 'default' => 50],
                    'text_color' => ['type' => 'color', 'default' => '#ffffff'],
                    'button_text' => ['type' => 'text', 'required' => false],
                    'button_url' => ['type' => 'url', 'required' => false],
                    'height' => ['type' => 'select', 'options' => ['small' => '400px', 'medium' => '600px', 'large' => '800px', 'fullscreen' => '100vh'], 'default' => 'medium'],
                ],
            ],
            'text' => [
                'name' => 'Text Content',
                'description' => 'Rich text content with formatting options',
                'icon' => '📝',
                'fields' => [
                    'title' => ['type' => 'text', 'required' => false],
                    'content' => ['type' => 'wysiwyg', 'required' => true],
                    'alignment' => ['type' => 'select', 'options' => ['left', 'center', 'right'], 'default' => 'left'],
                    'background_color' => ['type' => 'color', 'required' => false],
                    'text_color' => ['type' => 'color', 'required' => false],
                ],
            ],
            'image' => [
                'name' => 'Image Block',
                'description' => 'Single image with optional caption and link',
                'icon' => '🖼️',
                'fields' => [
                    'image' => ['type' => 'image', 'required' => true],
                    'alt_text' => ['type' => 'text', 'required' => true],
                    'caption' => ['type' => 'text', 'required' => false],
                    'link_url' => ['type' => 'url', 'required' => false],
                    'size' => ['type' => 'select', 'options' => ['small', 'medium', 'large', 'full'], 'default' => 'medium'],
                    'alignment' => ['type' => 'select', 'options' => ['left', 'center', 'right'], 'default' => 'center'],
                ],
            ],
            'gallery' => [
                'name' => 'Image Gallery',
                'description' => 'Multiple images in a grid layout',
                'icon' => '🖼️',
                'fields' => [
                    'title' => ['type' => 'text', 'required' => false],
                    'images' => ['type' => 'image_multiple', 'required' => true],
                    'columns' => ['type' => 'select', 'options' => [2, 3, 4, 5, 6], 'default' => 3],
                    'spacing' => ['type' => 'select', 'options' => ['none', 'small', 'medium', 'large'], 'default' => 'medium'],
                    'lightbox' => ['type' => 'boolean', 'default' => true],
                ],
            ],
            'products' => [
                'name' => 'Product Showcase',
                'description' => 'Display selected products or categories',
                'icon' => '🛍️',
                'fields' => [
                    'title' => ['type' => 'text', 'required' => false],
                    'display_type' => ['type' => 'select', 'options' => ['featured', 'category', 'specific', 'latest'], 'default' => 'featured'],
                    'category_id' => ['type' => 'select_category', 'required' => false],
                    'product_ids' => ['type' => 'select_products', 'required' => false],
                    'limit' => ['type' => 'number', 'min' => 1, 'max' => 20, 'default' => 8],
                    'columns' => ['type' => 'select', 'options' => [2, 3, 4, 5, 6], 'default' => 4],
                    'show_price' => ['type' => 'boolean', 'default' => true],
                    'show_description' => ['type' => 'boolean', 'default' => false],
                ],
            ],
            'testimonials' => [
                'name' => 'Testimonials',
                'description' => 'Customer testimonials and reviews',
                'icon' => '💬',
                'fields' => [
                    'title' => ['type' => 'text', 'required' => false],
                    'testimonials' => ['type' => 'repeater', 'fields' => [
                        'name' => ['type' => 'text', 'required' => true],
                        'content' => ['type' => 'textarea', 'required' => true],
                        'rating' => ['type' => 'select', 'options' => [1, 2, 3, 4, 5], 'default' => 5],
                        'avatar' => ['type' => 'image', 'required' => false],
                        'position' => ['type' => 'text', 'required' => false],
                        'company' => ['type' => 'text', 'required' => false],
                    ]],
                    'layout' => ['type' => 'select', 'options' => ['grid', 'slider'], 'default' => 'grid'],
                    'columns' => ['type' => 'select', 'options' => [1, 2, 3], 'default' => 2],
                ],
            ],
            'cta' => [
                'name' => 'Call to Action',
                'description' => 'Prominent call-to-action section',
                'icon' => '📢',
                'fields' => [
                    'title' => ['type' => 'text', 'required' => true],
                    'description' => ['type' => 'textarea', 'required' => false],
                    'button_text' => ['type' => 'text', 'required' => true],
                    'button_url' => ['type' => 'url', 'required' => true],
                    'background_color' => ['type' => 'color', 'default' => '#f3f4f6'],
                    'text_color' => ['type' => 'color', 'default' => '#1f2937'],
                    'button_color' => ['type' => 'color', 'default' => '#3b82f6'],
                    'style' => ['type' => 'select', 'options' => ['centered', 'left-aligned', 'right-aligned'], 'default' => 'centered'],
                ],
            ],
            'faq' => [
                'name' => 'FAQ Section',
                'description' => 'Frequently asked questions with collapsible answers',
                'icon' => '❓',
                'fields' => [
                    'title' => ['type' => 'text', 'required' => false],
                    'faqs' => ['type' => 'repeater', 'fields' => [
                        'question' => ['type' => 'text', 'required' => true],
                        'answer' => ['type' => 'wysiwyg', 'required' => true],
                    ]],
                    'style' => ['type' => 'select', 'options' => ['accordion', 'tabs'], 'default' => 'accordion'],
                ],
            ],
            'contact' => [
                'name' => 'Contact Form',
                'description' => 'Contact form with customizable fields',
                'icon' => '📧',
                'fields' => [
                    'title' => ['type' => 'text', 'required' => false],
                    'description' => ['type' => 'textarea', 'required' => false],
                    'fields' => ['type' => 'select_multiple', 'options' => ['name', 'email', 'phone', 'subject', 'message'], 'default' => ['name', 'email', 'message']],
                    'success_message' => ['type' => 'text', 'default' => 'Thank you for your message. We will get back to you soon.'],
                    'button_text' => ['type' => 'text', 'default' => 'Send Message'],
                ],
            ],
            'custom' => [
                'name' => 'Custom HTML',
                'description' => 'Custom HTML content for advanced layouts',
                'icon' => '⚡',
                'fields' => [
                    'html' => ['type' => 'code', 'required' => true, 'language' => 'html'],
                    'css' => ['type' => 'code', 'required' => false, 'language' => 'css'],
                    'js' => ['type' => 'code', 'required' => false, 'language' => 'javascript'],
                ],
            ],
        ];
    }

    /**
     * Create a new page section
     */
    public function createSection(Page $page, array $data): PageSection
    {
        $sectionTypes = $this->getAvailableSectionTypes();
        
        if (!isset($sectionTypes[$data['type']])) {
            throw new \InvalidArgumentException('Invalid section type: ' . $data['type']);
        }

        // Validate and process content based on section type
        $content = $this->processContent($data['type'], $data['content'] ?? []);
        $settings = $data['settings'] ?? [];

        // Get the next sort order
        $sortOrder = $page->sections()->max('sort_order') + 1;

        return $page->sections()->create([
            'type' => $data['type'],
            'name' => $data['name'] ?? $sectionTypes[$data['type']]['name'],
            'content' => $content,
            'settings' => $settings,
            'sort_order' => $data['sort_order'] ?? $sortOrder,
            'is_active' => $data['is_active'] ?? true,
        ]);
    }

    /**
     * Update an existing page section
     */
    public function updateSection(PageSection $section, array $data): PageSection
    {
        $content = $this->processContent($section->type, $data['content'] ?? $section->content);
        $settings = $data['settings'] ?? $section->settings;

        $section->update([
            'name' => $data['name'] ?? $section->name,
            'content' => $content,
            'settings' => $settings,
            'sort_order' => $data['sort_order'] ?? $section->sort_order,
            'is_active' => $data['is_active'] ?? $section->is_active,
        ]);

        return $section->fresh();
    }

    /**
     * Reorder page sections
     */
    public function reorderSections(Page $page, array $sectionIds): bool
    {
        foreach ($sectionIds as $index => $sectionId) {
            $page->sections()->where('id', $sectionId)->update([
                'sort_order' => $index + 1,
            ]);
        }

        return true;
    }

    /**
     * Duplicate a page section
     */
    public function duplicateSection(PageSection $section): PageSection
    {
        $newSection = $section->replicate();
        $newSection->name = $section->name . ' (Copy)';
        $newSection->sort_order = $section->page->sections()->max('sort_order') + 1;
        $newSection->save();

        return $newSection;
    }

    /**
     * Process content based on section type
     */
    protected function processContent(string $type, array $content): array
    {
        switch ($type) {
            case 'products':
                return $this->processProductsContent($content);
            case 'gallery':
                return $this->processGalleryContent($content);
            case 'testimonials':
                return $this->processTestimonialsContent($content);
            case 'faq':
                return $this->processFaqContent($content);
            default:
                return $content;
        }
    }

    /**
     * Process products section content
     */
    protected function processProductsContent(array $content): array
    {
        if (isset($content['display_type'])) {
            switch ($content['display_type']) {
                case 'category':
                    if (isset($content['category_id'])) {
                        $category = Category::find($content['category_id']);
                        $content['category_name'] = $category?->name;
                    }
                    break;
                case 'specific':
                    if (isset($content['product_ids'])) {
                        $products = Product::whereIn('id', $content['product_ids'])->get(['id', 'name']);
                        $content['selected_products'] = $products->toArray();
                    }
                    break;
            }
        }

        return $content;
    }

    /**
     * Process gallery section content
     */
    protected function processGalleryContent(array $content): array
    {
        if (isset($content['images']) && is_array($content['images'])) {
            // Ensure all images have proper structure
            $content['images'] = array_map(function ($image) {
                return [
                    'id' => $image['id'] ?? null,
                    'url' => $image['url'] ?? '',
                    'alt' => $image['alt'] ?? '',
                    'caption' => $image['caption'] ?? '',
                ];
            }, $content['images']);
        }

        return $content;
    }

    /**
     * Process testimonials section content
     */
    protected function processTestimonialsContent(array $content): array
    {
        if (isset($content['testimonials']) && is_array($content['testimonials'])) {
            // Ensure all testimonials have proper structure
            $content['testimonials'] = array_map(function ($testimonial) {
                return [
                    'name' => $testimonial['name'] ?? '',
                    'content' => $testimonial['content'] ?? '',
                    'rating' => min(5, max(1, (int)($testimonial['rating'] ?? 5))),
                    'avatar' => $testimonial['avatar'] ?? null,
                    'position' => $testimonial['position'] ?? '',
                    'company' => $testimonial['company'] ?? '',
                ];
            }, $content['testimonials']);
        }

        return $content;
    }

    /**
     * Process FAQ section content
     */
    protected function processFaqContent(array $content): array
    {
        if (isset($content['faqs']) && is_array($content['faqs'])) {
            // Ensure all FAQs have proper structure
            $content['faqs'] = array_map(function ($faq) {
                return [
                    'question' => $faq['question'] ?? '',
                    'answer' => $faq['answer'] ?? '',
                ];
            }, $content['faqs']);
        }

        return $content;
    }

    /**
     * Render a page section to HTML
     */
    public function renderSection(PageSection $section): string
    {
        $viewName = "page-sections.{$section->type}";
        
        if (view()->exists($viewName)) {
            return view($viewName, [
                'section' => $section,
                'content' => $section->content,
                'settings' => $section->settings,
            ])->render();
        }

        // Fallback to generic section view
        return view('page-sections.generic', [
            'section' => $section,
            'content' => $section->content,
            'settings' => $section->settings,
        ])->render();
    }

    /**
     * Get data for products section
     */
    public function getProductsForSection(array $content, int $limit = 8): Collection
    {
        $displayType = $content['display_type'] ?? 'featured';
        $query = Product::with(['images', 'category']);

        switch ($displayType) {
            case 'featured':
                $query->where('is_featured', true);
                break;
            case 'category':
                if (isset($content['category_id'])) {
                    $query->where('category_id', $content['category_id']);
                }
                break;
            case 'specific':
                if (isset($content['product_ids'])) {
                    $query->whereIn('id', $content['product_ids']);
                }
                break;
            case 'latest':
                $query->orderBy('created_at', 'desc');
                break;
        }

        return $query->where('is_active', true)
                     ->limit($limit)
                     ->get();
    }

    /**
     * Export page structure
     */
    public function exportPage(Page $page): array
    {
        return [
            'page' => $page->only(['title', 'slug', 'content', 'meta_title', 'meta_description', 'template', 'settings']),
            'sections' => $page->sections->map(function ($section) {
                return $section->only(['type', 'name', 'content', 'settings', 'sort_order']);
            })->toArray(),
        ];
    }

    /**
     * Import page structure
     */
    public function importPage(array $data, ?int $userId = null): Page
    {
        $pageData = $data['page'];
        $pageData['created_by'] = $userId;
        $pageData['status'] = 'draft'; // Always import as draft

        $page = Page::create($pageData);

        if (isset($data['sections'])) {
            foreach ($data['sections'] as $sectionData) {
                $this->createSection($page, $sectionData);
            }
        }

        return $page;
    }
}
