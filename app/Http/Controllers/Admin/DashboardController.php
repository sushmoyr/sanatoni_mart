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

        // Business Overview Statistics
        $businessStats = [
            'total_revenue' => Order::whereIn('status', ['delivered', 'shipped'])->sum('total'),
            'monthly_revenue' => Order::whereIn('status', ['delivered', 'shipped'])
                ->whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->sum('total'),
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'total_products' => Product::count(),
            'active_products' => Product::where('is_active', true)->count(),
            'total_categories' => Category::count(),
            'low_stock_products' => Product::where('is_active', true)
                ->where('manage_stock', true)
                ->whereBetween('stock_quantity', [1, 10])
                ->count(),
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
