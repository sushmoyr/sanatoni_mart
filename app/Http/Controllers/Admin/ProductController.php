<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    /**
     * Display a listing of products
     */
    public function index(Request $request): Response
    {
        $query = Product::with(['category', 'images']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->filled('category')) {
            $query->where('category_id', $request->get('category'));
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        // Stock status filter
        if ($request->filled('stock_status')) {
            $stockStatus = $request->get('stock_status');
            switch ($stockStatus) {
                case 'in_stock':
                    $query->where(function ($q) {
                        $q->where('manage_stock', false)
                          ->orWhere(function ($q2) {
                              $q2->where('manage_stock', true)
                                 ->where('stock_quantity', '>', 5);
                          });
                    });
                    break;
                case 'low_stock':
                    $query->where('manage_stock', true)
                          ->whereBetween('stock_quantity', [1, 5]);
                    break;
                case 'out_of_stock':
                    $query->where('manage_stock', true)
                          ->where('stock_quantity', '<=', 0);
                    break;
            }
        }

        // Price range filter
        if ($request->filled('price_min')) {
            $query->where('price', '>=', $request->get('price_min'));
        }
        if ($request->filled('price_max')) {
            $query->where('price', '<=', $request->get('price_max'));
        }

        // Only show active products
        $query->where('is_active', true);

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        
        $allowedSortFields = ['created_at', 'name', 'price', 'stock_quantity', 'updated_at'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $products = $query->paginate(10)->withQueryString();
        $categories = Category::active()->orderBy('name')->get();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'status', 'stock_status', 'price_min', 'price_max', 'sort_by', 'sort_direction']),
        ]);
    }

    /**
     * Show the form for creating a new product
     */
    public function create(): Response
    {
        $categories = Category::active()->orderBy('name')->get();

        return Inertia::render('Admin/Products/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created product
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:price',
            'category_id' => 'required|exists:categories,id',
            'manage_stock' => 'boolean',
            'stock_quantity' => 'required_if:manage_stock,true|integer|min:0',
            'allow_backorders' => 'boolean',
            'featured' => 'boolean',
            'is_active' => 'boolean',
            'status' => 'required|in:draft,published,archived',
            'weight' => 'nullable|numeric|min:0',
            'specifications' => 'nullable|array',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        // Set stock status based on stock quantity
        $stockStatus = 'in_stock';
        if ($validated['manage_stock'] && $validated['stock_quantity'] <= 0) {
            $stockStatus = $validated['allow_backorders'] ? 'on_backorder' : 'out_of_stock';
        }

        $product = Product::create([
            ...$validated,
            'slug' => Str::slug($validated['name']),
            'sku' => 'PRD-' . strtoupper(Str::random(8)),
            'stock_status' => $stockStatus,
        ]);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified product
     */
    public function show($productId): Response
    {
        $product = Product::findOrFail($productId);
        $product->load(['category', 'images']);

        return Inertia::render('Admin/Products/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified product
     */
    public function edit($productId): Response
    {
        $product = Product::with(['category', 'images'])->findOrFail($productId);
        $categories = Category::where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories->values()->toArray(),
        ]);
    }

    /**
     * Update the specified product
     */
    public function update(Request $request, $productId): RedirectResponse
    {
        $product = Product::findOrFail($productId);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:price',
            'category_id' => 'required|exists:categories,id',
            'manage_stock' => 'boolean',
            'stock_quantity' => 'required_if:manage_stock,true|integer|min:0',
            'allow_backorders' => 'boolean',
            'featured' => 'boolean',
            'is_active' => 'boolean',
            'status' => 'required|in:draft,published,archived',
            'weight' => 'nullable|numeric|min:0',
            'specifications' => 'nullable|array',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        // Set stock status based on stock quantity
        $stockStatus = 'in_stock';
        if ($validated['manage_stock'] && $validated['stock_quantity'] <= 0) {
            $stockStatus = $validated['allow_backorders'] ? 'on_backorder' : 'out_of_stock';
        }

        $updateData = [
            ...$validated,
            'stock_status' => $stockStatus,
        ];

        // Only update slug if name changed
        if ($validated['name'] !== $product->name) {
            $updateData['slug'] = Str::slug($validated['name']);
        }

        $product->update($updateData);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified product
     */
    public function destroy($productId): RedirectResponse
    {
        $product = Product::findOrFail($productId);
        
        // Delete associated images
        $product->images()->delete();
        
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    /**
     * Upload image for a product
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
            'product_id' => 'required|exists:products,id',
            'alt_text' => 'nullable|string|max:255',
            'is_primary' => 'nullable'
        ]);

        $product = Product::findOrFail($request->product_id);
        
        // Check current image count before making changes
        $currentImageCount = $product->images()->count();
        
        // Handle file upload
        $image = $request->file('image');
        $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
        $path = $image->storeAs('products', $filename, 'public');

        // If this is set as primary, unset other primary images
        if ($request->boolean('is_primary')) {
            $product->images()->update(['is_main' => false]);
        }

        // Determine if this should be primary (either explicitly set or first image)
        $isPrimary = $request->boolean('is_primary') || $currentImageCount === 0;
        
        // Get next sort order
        $nextSortOrder = $product->images()->max('sort_order') ?? 0;
        $nextSortOrder += 1;

        // Create image record
        $productImage = $product->images()->create([
            'image_path' => $path,
            'alt_text' => $request->alt_text,
            'is_main' => $isPrimary,
            'sort_order' => $nextSortOrder,
        ]);

        return response()->json([
            'success' => true,
            'image' => [
                'id' => $productImage->id,
                'image_path' => $productImage->image_path,
                'alt_text' => $productImage->alt_text,
                'is_primary' => $productImage->is_main,
                'sort_order' => $productImage->sort_order,
                'url' => Storage::url($productImage->image_path),
            ]
        ]);
    }

    /**
     * Delete product image
     */
    public function deleteImage(Request $request): JsonResponse
    {
        $request->validate([
            'image_id' => 'required|exists:product_images,id',
        ]);

        $image = \App\Models\ProductImage::findOrFail($request->image_id);
        
        // Delete file from storage
        if (Storage::disk('public')->exists($image->image_path)) {
            Storage::disk('public')->delete($image->image_path);
        }

        $image->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Update image details
     */
    public function updateImage(Request $request): JsonResponse
    {
        $request->validate([
            'image_id' => 'required|exists:product_images,id',
            'alt_text' => 'nullable|string|max:255',
            'is_primary' => 'boolean',
            'sort_order' => 'integer|min:0'
        ]);

        $image = \App\Models\ProductImage::findOrFail($request->image_id);
        
        // If setting as primary, unset other primary images for this product
        if ($request->boolean('is_primary')) {
            $image->product->images()->where('id', '!=', $image->id)->update(['is_main' => false]);
        }

        // Map is_primary to is_main for the update
        $updateData = $request->only(['alt_text', 'sort_order']);
        if ($request->has('is_primary')) {
            $updateData['is_main'] = $request->boolean('is_primary');
        }
        
        $image->update($updateData);

        return response()->json([
            'success' => true,
            'image' => [
                'id' => $image->id,
                'image_path' => $image->image_path,
                'alt_text' => $image->alt_text,
                'is_primary' => $image->is_main,
                'sort_order' => $image->sort_order,
                'url' => Storage::url($image->image_path),
            ]
        ]);
    }
}
