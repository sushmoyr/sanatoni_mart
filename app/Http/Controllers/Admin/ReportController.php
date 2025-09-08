<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

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

    /**
     * Display sales overview and analytics
     */
    public function salesOverview(): Response
    {
        $currentMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();
        $lastMonthEnd = Carbon::now()->subMonth()->endOfMonth();
        $currentYear = Carbon::now()->startOfYear();

        // Sales Overview Statistics
        $salesStats = [
            'total_revenue' => Order::whereIn('status', ['delivered', 'shipped'])->sum('total'),
            'current_month_revenue' => Order::whereIn('status', ['delivered', 'shipped'])
                ->where('created_at', '>=', $currentMonth)->sum('total'),
            'last_month_revenue' => Order::whereIn('status', ['delivered', 'shipped'])
                ->whereBetween('created_at', [$lastMonth, $lastMonthEnd])->sum('total'),
            'total_orders' => Order::count(),
            'current_month_orders' => Order::where('created_at', '>=', $currentMonth)->count(),
            'last_month_orders' => Order::whereBetween('created_at', [$lastMonth, $lastMonthEnd])->count(),
            'average_order_value' => Order::whereIn('status', ['delivered', 'shipped'])->avg('total') ?? 0,
            'year_to_date_revenue' => Order::whereIn('status', ['delivered', 'shipped'])
                ->where('created_at', '>=', $currentYear)->sum('total'),
        ];

        // Calculate growth percentages
        $salesStats['revenue_growth'] = $salesStats['last_month_revenue'] > 0 
            ? (($salesStats['current_month_revenue'] - $salesStats['last_month_revenue']) / $salesStats['last_month_revenue']) * 100 
            : 0;
        
        $salesStats['orders_growth'] = $salesStats['last_month_orders'] > 0 
            ? (($salesStats['current_month_orders'] - $salesStats['last_month_orders']) / $salesStats['last_month_orders']) * 100 
            : 0;

        // Top selling products (by quantity)
        $topProducts = OrderItem::select('product_id', 'products.name', 'products.price')
            ->selectRaw('SUM(quantity) as total_sold')
            ->selectRaw('SUM(quantity * order_items.price) as total_revenue')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereIn('orders.status', ['delivered', 'shipped'])
            ->groupBy('product_id', 'products.name', 'products.price')
            ->orderBy('total_sold', 'desc')
            ->limit(10)
            ->with('product.category')
            ->get();

        // Sales by category
        $salesByCategory = Category::select('categories.id', 'categories.name')
            ->selectRaw('COALESCE(SUM(order_items.quantity * order_items.price), 0) as total_revenue')
            ->selectRaw('COALESCE(SUM(order_items.quantity), 0) as total_quantity')
            ->leftJoin('products', 'categories.id', '=', 'products.category_id')
            ->leftJoin('order_items', 'products.id', '=', 'order_items.product_id')
            ->leftJoin('orders', 'order_items.order_id', '=', 'orders.id')
            ->where(function($query) {
                $query->whereIn('orders.status', ['delivered', 'shipped'])
                      ->orWhereNull('orders.status');
            })
            ->groupBy('categories.id', 'categories.name')
            ->orderBy('total_revenue', 'desc')
            ->get();

        // Daily sales for the last 30 days
        $dailySales = Order::select(DB::raw('DATE(created_at) as date'))
            ->selectRaw('COUNT(*) as orders_count')
            ->selectRaw('SUM(total) as daily_revenue')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->whereIn('status', ['delivered', 'shipped', 'processing'])
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        // Customer insights
        $customerStats = [
            'total_customers' => User::whereHas('orders')->count(),
            'new_customers_this_month' => User::where('created_at', '>=', $currentMonth)
                ->whereHas('orders')->count(),
            'repeat_customers' => User::whereHas('orders', function($query) {
                $query->groupBy('user_id')->havingRaw('COUNT(*) > 1');
            })->count(),
        ];

        return Inertia::render('Admin/Reports/Sales', [
            'salesStats' => $salesStats,
            'topProducts' => $topProducts,
            'salesByCategory' => $salesByCategory,
            'dailySales' => $dailySales,
            'customerStats' => $customerStats,
        ]);
    }

    /**
     * Display order analytics and insights
     */
    public function orderAnalytics(): Response
    {
        // Order status distribution
        $orderStatusDistribution = Order::select('status')
            ->selectRaw('COUNT(*) as count')
            ->selectRaw('SUM(total) as total_value')
            ->groupBy('status')
            ->get();

        // Order fulfillment metrics
        $fulfillmentMetrics = [
            'average_processing_time' => DB::table('order_status_history')
                ->where('from_status', 'pending')
                ->where('to_status', 'processing')
                ->avg(DB::raw('(julianday(updated_at) - julianday(created_at)) * 24')) ?? 0,
            'average_shipping_time' => DB::table('order_status_history')
                ->where('from_status', 'processing')
                ->where('to_status', 'shipped')
                ->avg(DB::raw('(julianday(updated_at) - julianday(created_at)) * 24')) ?? 0,
            'average_delivery_time' => DB::table('order_status_history')
                ->where('from_status', 'shipped')
                ->where('to_status', 'delivered')
                ->avg(DB::raw('(julianday(updated_at) - julianday(created_at)) * 24')) ?? 0,
        ];

        // Order value distribution
        $orderValueDistribution = [
            'under_500' => Order::where('total', '<', 500)->count(),
            '500_1000' => Order::whereBetween('total', [500, 999.99])->count(),
            '1000_2000' => Order::whereBetween('total', [1000, 1999.99])->count(),
            '2000_5000' => Order::whereBetween('total', [2000, 4999.99])->count(),
            'over_5000' => Order::where('total', '>=', 5000)->count(),
        ];

        // Geographic distribution (top cities) - SQLite compatible
        $topCities = Order::select(DB::raw("json_extract(shipping_address, '$.city') as city"))
            ->selectRaw('COUNT(*) as order_count')
            ->selectRaw('SUM(total) as total_revenue')
            ->whereNotNull('shipping_address')
            ->groupBy('city')
            ->orderBy('order_count', 'desc')
            ->limit(10)
            ->get();

        // Monthly order trends (last 12 months) - SQLite compatible
        $monthlyTrends = Order::select(DB::raw('strftime("%Y", created_at) as year'))
            ->selectRaw('strftime("%m", created_at) as month')
            ->selectRaw('COUNT(*) as orders_count')
            ->selectRaw('SUM(total) as revenue')
            ->selectRaw('AVG(total) as avg_order_value')
            ->where('created_at', '>=', Carbon::now()->subMonths(12))
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();

        // Payment method analytics
        $paymentMethodStats = Order::select('payment_method')
            ->selectRaw('COUNT(*) as count')
            ->selectRaw('SUM(total) as total_value')
            ->groupBy('payment_method')
            ->get();

        return Inertia::render('Admin/Reports/Orders', [
            'orderStatusDistribution' => $orderStatusDistribution,
            'fulfillmentMetrics' => $fulfillmentMetrics,
            'orderValueDistribution' => $orderValueDistribution,
            'topCities' => $topCities,
            'monthlyTrends' => $monthlyTrends,
            'paymentMethodStats' => $paymentMethodStats,
        ]);
    }

    /**
     * Display comprehensive dashboard with all reports
     */
    public function dashboard(): Response
    {
        // Quick metrics for dashboard overview
        $quickStats = [
            'total_orders_today' => Order::whereDate('created_at', Carbon::today())->count(),
            'revenue_today' => Order::whereDate('created_at', Carbon::today())
                ->whereIn('status', ['delivered', 'shipped'])->sum('total'),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'low_stock_alerts' => Product::where('is_active', true)
                ->where('manage_stock', true)
                ->whereBetween('stock_quantity', [1, 5])
                ->count(),
        ];

        // Recent orders
        $recentOrders = Order::with(['user', 'orderItems.product'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Quick sales chart data (last 7 days)
        $weeklyChart = Order::select(DB::raw('DATE(created_at) as date'))
            ->selectRaw('COUNT(*) as orders')
            ->selectRaw('SUM(total) as revenue')
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        return Inertia::render('Admin/Reports/Dashboard', [
            'quickStats' => $quickStats,
            'recentOrders' => $recentOrders,
            'weeklyChart' => $weeklyChart,
        ]);
    }
}
