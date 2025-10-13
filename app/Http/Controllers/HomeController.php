<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\FeaturedProduct;
use App\Models\FlashSale;
use App\Models\Slider;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the homepage with all e-commerce data
     */
    public function index(): Response
    {
        // Active Sliders for homepage hero section
        $sliders = Slider::active()
            ->current()
            ->ordered()
            ->get()
            ->map(function ($slider) {
                return [
                    'id' => $slider->id,
                    'title' => $slider->title,
                    'subtitle' => $slider->subtitle,
                    'description' => $slider->description,
                    'image_url' => $slider->image_url,
                    'button_text' => $slider->button_text,
                    'button_link' => $slider->button_link,
                    'button_style' => $slider->button_style,
                    'text_color' => $slider->text_color,
                    'overlay_style' => $slider->overlay_style,
                    'text_position' => $slider->text_position,
                    'text_alignment' => $slider->text_alignment,
                ];
            });

        // Featured/Hero Products for fallback slider (if no sliders configured)
        $heroProducts = Product::where('is_active', true)
            ->where('is_featured', true)
            ->with(['images', 'category'])
            ->orderBy('featured_order')
            ->take(5)
            ->get();

        // Trending/Popular Products
        $trendingProducts = Product::where('is_active', true)
            ->with(['images', 'category'])
            ->withCount('orderItems')
            ->orderBy('order_items_count', 'desc')
            ->take(8)
            ->get();

        // New Arrivals
        $newArrivals = Product::where('is_active', true)
            ->with(['images', 'category'])
            ->latest('created_at')
            ->take(8)
            ->get();

        // Best Sellers
        $bestSellers = Product::where('is_active', true)
            ->with(['images', 'category'])
            ->withCount('orderItems')
            ->orderBy('order_items_count', 'desc')
            ->take(8)
            ->get();

        // Flash Sale Products
        $flashSaleProducts = [];
        $activeFlashSale = FlashSale::active()
            ->with(['products.images', 'products.category'])
            ->first();

        if ($activeFlashSale) {
            $flashSaleProducts = $activeFlashSale->products->take(6);
        }

        // Categories with product counts
        $categories = Category::where('is_active', true)
            ->withCount(['products' => function ($query) {
                $query->where('is_active', true);
            }])
            ->orderBy('products_count', 'desc')
            ->take(8)
            ->get();

        // Special offers/deals
        $specialOffers = Product::where('is_active', true)
            ->where('sale_price', '>', 0)
            ->with(['images', 'category'])
            ->orderByRaw('((price - sale_price) / price) DESC')
            ->take(6)
            ->get();

        // Stats for trust badges
        $stats = [
            'total_products' => Product::where('is_active', true)->count(),
            'happy_customers' => 50000, // This could come from orders or user feedback
            'categories' => Category::where('is_active', true)->count(),
            'years_experience' => 5,
        ];

        return Inertia::render('Welcome', [
            'sliders' => $sliders,
            'heroProducts' => $heroProducts,
            'trendingProducts' => $trendingProducts,
            'newArrivals' => $newArrivals,
            'bestSellers' => $bestSellers,
            'flashSaleProducts' => $flashSaleProducts,
            'activeFlashSale' => $activeFlashSale,
            'categories' => $categories,
            'specialOffers' => $specialOffers,
            'stats' => $stats,
        ]);
    }
}
