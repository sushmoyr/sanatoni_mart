<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Calculate current period data
        $currentMonth = Carbon::now();
        $previousMonth = Carbon::now()->subMonth();
        
        // Current revenue stats
        $totalRevenue = Order::whereIn('status', ['delivered', 'shipped'])->sum('total');
        $monthlyRevenue = Order::whereIn('status', ['delivered', 'shipped'])
            ->whereMonth('created_at', $currentMonth->month)
            ->whereYear('created_at', $currentMonth->year)
            ->sum('total');
        
        // Previous month revenue for comparison
        $previousMonthRevenue = Order::whereIn('status', ['delivered', 'shipped'])
            ->whereMonth('created_at', $previousMonth->month)
            ->whereYear('created_at', $previousMonth->year)
            ->sum('total');
        
        // Calculate total revenue from previous period (up to previous month)
        $previousTotalRevenue = Order::whereIn('status', ['delivered', 'shipped'])
            ->where('created_at', '<', $currentMonth->startOfMonth())
            ->sum('total');
        
        // Current orders stats
        $totalOrders = Order::count();
        $currentMonthOrders = Order::whereMonth('created_at', $currentMonth->month)
            ->whereYear('created_at', $currentMonth->year)
            ->count();
        $previousMonthOrders = Order::whereMonth('created_at', $previousMonth->month)
            ->whereYear('created_at', $previousMonth->year)
            ->count();
        
        // Current pending orders
        $pendingOrders = Order::where('status', 'pending')->count();
        $previousMonthPendingOrders = Order::where('status', 'pending')
            ->whereMonth('created_at', $previousMonth->month)
            ->whereYear('created_at', $previousMonth->year)
            ->count();
        
        // Products stats
        $totalProducts = Product::count();
        $lowStockProducts = Product::where('is_active', true)
            ->where('manage_stock', true)
            ->whereBetween('stock_quantity', [1, 10])
            ->count();
        
        // Calculate percentage changes
        $calculatePercentageChange = function($current, $previous) {
            if ($previous == 0) {
                return $current > 0 ? 100 : 0;
            }
            return round((($current - $previous) / $previous) * 100, 1);
        };
        
        // Business Overview Statistics with trends
        $businessStats = [
            'total_revenue' => $totalRevenue,
            'monthly_revenue' => $monthlyRevenue,
            'total_orders' => $totalOrders,
            'pending_orders' => $pendingOrders,
            'total_products' => $totalProducts,
            'active_products' => Product::where('is_active', true)->count(),
            'total_categories' => Category::count(),
            'low_stock_products' => $lowStockProducts,
            
            // Percentage changes
            'total_revenue_change' => $calculatePercentageChange($totalRevenue, $previousTotalRevenue),
            'monthly_revenue_change' => $calculatePercentageChange($monthlyRevenue, $previousMonthRevenue),
            'orders_change' => $calculatePercentageChange($currentMonthOrders, $previousMonthOrders),
            'pending_orders_change' => $calculatePercentageChange($pendingOrders, $previousMonthPendingOrders),
            'products_change' => 0, // Products don't change frequently, can be enhanced later
            'low_stock_change' => 0, // Can be enhanced to compare with previous period
        ];

        // User statistics
        $userStats = [
            'total_users' => User::count(),
            'active_users' => User::where('status', 'active')->count(),
            'admin_users' => User::whereHas('roles', function ($query) {
                $query->where('name', 'admin');
            })->count(),
            'manager_users' => User::whereHas('roles', function ($query) {
                $query->where('name', 'manager');
            })->count(),
            'salesperson_users' => User::whereHas('roles', function ($query) {
                $query->where('name', 'salesperson');
            })->count(),
        ];

        // Monthly sales data for chart (last 6 months)
        $monthlySales = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $revenue = Order::whereIn('status', ['delivered', 'shipped'])
                ->whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->sum('total');
            
            $orders = Order::whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->count();

            $monthlySales[] = [
                'month' => $date->format('M Y'),
                'revenue' => (float) $revenue,
                'orders' => $orders,
            ];
        }

        // Weekly sales data for recent trend
        $weeklySales = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $revenue = Order::whereIn('status', ['delivered', 'shipped'])
                ->whereDate('created_at', $date->toDateString())
                ->sum('total');
            
            $orders = Order::whereDate('created_at', $date->toDateString())->count();

            $weeklySales[] = [
                'date' => $date->format('M j'),
                'day' => $date->format('D'),
                'revenue' => (float) $revenue,
                'orders' => $orders,
            ];
        }

        // Top selling categories
        $topCategories = Category::withCount(['products' => function ($query) {
                $query->where('is_active', true);
            }])
            ->orderBy('products_count', 'desc')
            ->take(5)
            ->get()
            ->map(function ($category) {
                return [
                    'name' => $category->name,
                    'products_count' => $category->products_count,
                ];
            });

        // Recent orders
        $recentOrders = Order::with(['user'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total' => $order->total,
                    'status' => $order->status,
                    'customer_name' => $order->user?->name ?? 'Guest',
                    'created_at' => $order->created_at->format('M j, Y g:i A'),
                ];
            });

        // Order status distribution
        $orderStatusData = [
            'pending' => Order::where('status', 'pending')->count(),
            'processing' => Order::where('status', 'processing')->count(),
            'shipped' => Order::where('status', 'shipped')->count(),
            'delivered' => Order::where('status', 'delivered')->count(),
            'cancelled' => Order::where('status', 'cancelled')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'businessStats' => $businessStats,
            'userStats' => $userStats,
            'monthlySales' => $monthlySales,
            'weeklySales' => $weeklySales,
            'topCategories' => $topCategories,
            'recentOrders' => $recentOrders,
            'orderStatusData' => $orderStatusData,
            'user_permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
        ]);
    }
}
