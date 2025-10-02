<?php

namespace App\Http\Controllers;

use App\Models\FlashSale;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FlashSaleController extends Controller
{
    /**
     * Display listing of active flash sales
     */
    public function index(): Response
    {
        // Get all flash sales and filter using the isActive() method
        $allFlashSales = FlashSale::where('status', 'active')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->orderBy('start_date', 'desc')
            ->get();

        // Filter to only truly active flash sales and eager load products by product_ids
        $flashSales = $allFlashSales->filter(function ($flashSale) {
            return $flashSale->isActive();
        })->map(function ($flashSale) {
            // Load products using product_ids array
            if (!empty($flashSale->product_ids)) {
                $flashSale->products = \App\Models\Product::whereIn('id', $flashSale->product_ids)
                    ->where('is_active', true)
                    ->with(['category', 'images' => function ($q) {
                        $q->where('is_primary', true);
                    }])
                    ->get();
            } else {
                $flashSale->products = collect();
            }
            return $flashSale;
        });

        // Get the featured flash sale if any
        $featuredFlashSale = $flashSales->where('is_featured', true)->first();

        return Inertia::render('FlashSales/Index', [
            'flashSales' => $flashSales,
            'featuredFlashSale' => $featuredFlashSale,
        ]);
    }

    /**
     * Display specific flash sale with products
     */
    public function show(FlashSale $flashSale): Response
    {
        // Check if flash sale is active
        if (!$flashSale->isActive()) {
            return redirect()->route('flash-sales.index')
                ->with('error', 'This flash sale is no longer active.');
        }

        // Load products using product_ids array
        $products = collect();
        if (!empty($flashSale->product_ids)) {
            $products = \App\Models\Product::whereIn('id', $flashSale->product_ids)
                ->where('is_active', true)
                ->with(['category', 'images' => function ($q) {
                    $q->where('is_primary', true);
                }])
                ->get();
        }

        // Calculate discounted prices for products
        $products = $products->map(function ($product) use ($flashSale) {
            $product->original_price = $product->price;
            $product->flash_sale_price = $flashSale->calculateDiscountedPrice($product->price);
            $product->discount_amount = $product->price - $product->flash_sale_price;
            $product->discount_percentage = $flashSale->discount_percentage;
            return $product;
        });

        return Inertia::render('FlashSales/Show', [
            'flashSale' => $flashSale,
            'products' => $products,
        ]);
    }
}
