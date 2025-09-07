<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Display inventory report
     */
    public function inventory(): Response
    {
        // Low stock products (manage_stock = true and stock_quantity <= 5)
        $lowStockProducts = Product::with(['category', 'images'])
            ->where('is_active', true)
            ->where('manage_stock', true)
            ->where('stock_quantity', '<=', 5)
            ->where('stock_quantity', '>', 0)
            ->orderBy('stock_quantity', 'asc')
            ->get();

        // Out of stock products
        $outOfStockProducts = Product::with(['category', 'images'])
            ->where('is_active', true)
            ->where('manage_stock', true)
            ->where('stock_quantity', '<=', 0)
            ->orderBy('updated_at', 'desc')
            ->get();

        // Stock summary by category
        $stockByCategory = Category::withCount([
            'products as total_products' => function ($query) {
                $query->where('is_active', true);
            },
            'products as in_stock_products' => function ($query) {
                $query->where('is_active', true)
                      ->where(function ($q) {
                          $q->where('manage_stock', false)
                            ->orWhere(function ($q2) {
                                $q2->where('manage_stock', true)
                                   ->where('stock_quantity', '>', 5);
                            });
                      });
            },
            'products as low_stock_products' => function ($query) {
                $query->where('is_active', true)
                      ->where('manage_stock', true)
                      ->whereBetween('stock_quantity', [1, 5]);
            },
            'products as out_of_stock_products' => function ($query) {
                $query->where('is_active', true)
                      ->where('manage_stock', true)
                      ->where('stock_quantity', '<=', 0);
            }
        ])
        ->where('active', true)
        ->orderBy('name')
        ->get();

        // Overall inventory statistics
        $inventoryStats = [
            'total_products' => Product::where('is_active', true)->count(),
            'total_stock_value' => Product::where('is_active', true)
                ->where('manage_stock', true)
                ->sum(DB::raw('price * stock_quantity')),
            'low_stock_count' => Product::where('is_active', true)
                ->where('manage_stock', true)
                ->whereBetween('stock_quantity', [1, 5])
                ->count(),
            'out_of_stock_count' => Product::where('is_active', true)
                ->where('manage_stock', true)
                ->where('stock_quantity', '<=', 0)
                ->count(),
            'unlimited_stock_count' => Product::where('is_active', true)
                ->where('manage_stock', false)
                ->count(),
        ];

        // Top products by stock value
        $topProductsByValue = Product::where('is_active', true)
            ->where('manage_stock', true)
            ->select('id', 'name', 'sku', 'price', 'stock_quantity')
            ->selectRaw('(price * stock_quantity) as stock_value')
            ->orderBy('stock_value', 'desc')
            ->with(['category', 'images'])
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Reports/Inventory', [
            'lowStockProducts' => $lowStockProducts,
            'outOfStockProducts' => $outOfStockProducts,
            'stockByCategory' => $stockByCategory,
            'inventoryStats' => $inventoryStats,
            'topProductsByValue' => $topProductsByValue,
        ]);
    }

    /**
     * Get inventory alerts for dashboard
     */
    public function inventoryAlerts()
    {
        $alerts = [
            'low_stock' => Product::where('is_active', true)
                ->where('manage_stock', true)
                ->whereBetween('stock_quantity', [1, 5])
                ->count(),
            'out_of_stock' => Product::where('is_active', true)
                ->where('manage_stock', true)
                ->where('stock_quantity', '<=', 0)
                ->count(),
        ];

        return response()->json($alerts);
    }
}
