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

class ProductController extends Controller
{
    /**
     * Display a listing of products
     */
    public function index(): Response
    {
        $products = Product::with(['category'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $categories = Category::active()->orderBy('name')->get();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => $categories,
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
    public function show(Product $product): Response
    {
        $product->load(['category', 'images']);

        return Inertia::render('Admin/Products/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified product
     */
    public function edit(Product $product): Response
    {
        $categories = Category::active()->orderBy('name')->get();
        $product->load(['category', 'images']);

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified product
     */
    public function update(Request $request, Product $product): RedirectResponse
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
    public function destroy(Product $product): RedirectResponse
    {
        // Delete associated images
        $product->images()->delete();
        
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
