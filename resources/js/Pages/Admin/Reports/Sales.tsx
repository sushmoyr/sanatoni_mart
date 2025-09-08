import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Product } from '@/types';
import { 
    ChartBarIcon,
    CurrencyDollarIcon,
    ShoppingBagIcon,
    UsersIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    ArrowUpIcon,
    ArrowDownIcon
} from '@heroicons/react/24/outline';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

interface SalesStats {
    total_revenue: number;
    current_month_revenue: number;
    last_month_revenue: number;
    total_orders: number;
    current_month_orders: number;
    last_month_orders: number;
    average_order_value: number;
    year_to_date_revenue: number;
    revenue_growth: number;
    orders_growth: number;
}

interface TopProduct {
    product_id: number;
    name: string;
    price: number;
    total_sold: number;
    total_revenue: number;
    product?: {
        category?: {
            name: string;
        };
    };
}

interface SalesByCategory {
    id: number;
    name: string;
    total_revenue: number;
    total_quantity: number;
}

interface DailySales {
    date: string;
    orders_count: number;
    daily_revenue: number;
}

interface CustomerStats {
    total_customers: number;
    new_customers_this_month: number;
    repeat_customers: number;
}

interface Props {
    salesStats: SalesStats;
    topProducts: TopProduct[];
    salesByCategory: SalesByCategory[];
    dailySales: DailySales[];
    customerStats: CustomerStats;
}

export default function Sales({ 
    salesStats, 
    topProducts, 
    salesByCategory, 
    dailySales, 
    customerStats 
}: Props) {
    const formatPrice = (price: number) => {
        return `৳${price.toLocaleString('en-IN')}`;
    };

    const formatNumber = (number: number) => {
        return new Intl.NumberFormat('en-IN').format(number);
    };

    const formatPercentage = (percentage: number) => {
        return `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;
    };

    const getGrowthIcon = (growth: number) => {
        if (growth > 0) {
            return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
        } else if (growth < 0) {
            return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
        }
        return null;
    };

    const getGrowthColor = (growth: number) => {
        if (growth > 0) return 'text-green-600';
        if (growth < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    return (
        <AdminLayout>
            <Head title="Sacred Sales Analytics" />

            <div className="max-w-7xl mx-auto py-6">
                {/* Header */}
                <Card className="mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <ChartBarIcon className="h-8 w-8 text-brand-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-semantic-text">Sacred Sales Analytics</h1>
                                <p className="text-semantic-textSub mt-1">Comprehensive sales performance and insights</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <Link href={route('admin.reports.dashboard')}>
                                <Button variant="secondary">
                                    Reports Dashboard
                                </Button>
                            </Link>
                            <Link href={route('admin.reports.orders')}>
                                <Button variant="primary">
                                    Order Analytics
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>

                {/* Sales Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-green-100 rounded-full">
                                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-semantic-textSub mb-1">Total Revenue</p>
                        <p className="text-2xl font-bold text-semantic-text">{formatPrice(salesStats.total_revenue)}</p>
                        <div className="flex items-center justify-center mt-2">
                            {getGrowthIcon(salesStats.revenue_growth)}
                            <span className={`text-sm ml-1 ${getGrowthColor(salesStats.revenue_growth)}`}>
                                {formatPercentage(salesStats.revenue_growth)} vs last month
                            </span>
                        </div>
                    </Card>

                    <Card className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-semantic-textSub mb-1">Total Orders</p>
                        <p className="text-2xl font-bold text-semantic-text">{formatNumber(salesStats.total_orders)}</p>
                        <div className="flex items-center justify-center mt-2">
                            {getGrowthIcon(salesStats.orders_growth)}
                            <span className={`text-sm ml-1 ${getGrowthColor(salesStats.orders_growth)}`}>
                                {formatPercentage(salesStats.orders_growth)} vs last month
                            </span>
                        </div>
                    </Card>

                    <Card className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-purple-100 rounded-full">
                                <ArrowTrendingUpIcon className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-semantic-textSub mb-1">Average Order Value</p>
                        <p className="text-2xl font-bold text-semantic-text">{formatPrice(salesStats.average_order_value)}</p>
                        <p className="text-sm text-semantic-textSub mt-2">Across all orders</p>
                    </Card>

                    <Card className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-orange-100 rounded-full">
                                <UsersIcon className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-semantic-textSub mb-1">This Month Revenue</p>
                        <p className="text-2xl font-bold text-semantic-text">{formatPrice(salesStats.current_month_revenue)}</p>
                        <p className="text-sm text-semantic-textSub mt-2">{formatNumber(salesStats.current_month_orders)} orders</p>
                    </Card>
                </div>

                {/* Charts and Analytics Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Top Selling Products */}
                    <Card>
                        <h3 className="text-lg font-semibold text-semantic-text mb-6">Top Selling Sacred Products</h3>
                        <div className="space-y-4">
                            {topProducts.length === 0 ? (
                                <div className="text-center py-8 text-semantic-textSub">
                                    No sales data available
                                </div>
                            ) : (
                                topProducts.map((product, index) => (
                                    <div key={product.product_id} className="flex items-center justify-between p-4 bg-semantic-surface rounded-lg border border-semantic-border">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                <Badge variant={index < 3 ? "success" : "secondary"}>
                                                    #{index + 1}
                                                </Badge>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-semantic-text">{product.name}</h4>
                                                <p className="text-sm text-semantic-textSub">
                                                    {product.product?.category?.name} • {formatPrice(product.price)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-semantic-text">{formatNumber(product.total_sold)} sold</p>
                                            <p className="text-sm text-green-600">{formatPrice(product.total_revenue)}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    {/* Sales by Category */}
                    <Card>
                        <h3 className="text-lg font-semibold text-semantic-text mb-6">Sales by Sacred Category</h3>
                        <div className="space-y-4">
                            {salesByCategory.length === 0 ? (
                                <div className="text-center py-8 text-semantic-textSub">
                                    No category sales data
                                </div>
                            ) : (
                                salesByCategory.map((category) => (
                                    <div key={category.id} className="flex items-center justify-between p-4 bg-semantic-surface rounded-lg border border-semantic-border">
                                        <div>
                                            <h4 className="font-medium text-semantic-text">{category.name}</h4>
                                            <p className="text-sm text-semantic-textSub">
                                                {formatNumber(category.total_quantity)} items sold
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-green-600">
                                                {formatPrice(category.total_revenue)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Customer Insights */}
                <Card className="mb-8">
                    <h3 className="text-lg font-semibold text-semantic-text mb-6">Customer Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-semantic-surface rounded-lg border border-semantic-border">
                            <div className="flex items-center justify-center mb-3">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <UsersIcon className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-semantic-text">{formatNumber(customerStats.total_customers)}</p>
                            <p className="text-sm text-semantic-textSub">Total Customers</p>
                        </div>
                        
                        <div className="text-center p-4 bg-semantic-surface rounded-lg border border-semantic-border">
                            <div className="flex items-center justify-center mb-3">
                                <div className="p-2 bg-green-100 rounded-full">
                                    <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-semantic-text">{formatNumber(customerStats.new_customers_this_month)}</p>
                            <p className="text-sm text-semantic-textSub">New This Month</p>
                        </div>
                        
                        <div className="text-center p-4 bg-semantic-surface rounded-lg border border-semantic-border">
                            <div className="flex items-center justify-center mb-3">
                                <div className="p-2 bg-purple-100 rounded-full">
                                    <CurrencyDollarIcon className="w-5 h-5 text-purple-600" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-semantic-text">{formatNumber(customerStats.repeat_customers)}</p>
                            <p className="text-sm text-semantic-textSub">Repeat Customers</p>
                        </div>
                    </div>
                </Card>

                {/* Daily Sales Trend (Simple Table for now) */}
                <Card>
                    <h3 className="text-lg font-semibold text-semantic-text mb-6">Recent Daily Sales (Last 30 Days)</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-semantic-border">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">Orders</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">Revenue</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">Avg Order</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-semantic-border">
                                {dailySales.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-semantic-textSub">
                                            No sales data available
                                        </td>
                                    </tr>
                                ) : (
                                    dailySales.slice(-10).map((day) => (
                                        <tr key={day.date} className="hover:bg-semantic-surface transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-semantic-text">
                                                {new Date(day.date).toLocaleDateString('en-US', { 
                                                    month: 'short', 
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-semantic-text">
                                                {formatNumber(day.orders_count)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                                {formatPrice(day.daily_revenue)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-semantic-text">
                                                {day.orders_count > 0 ? formatPrice(day.daily_revenue / day.orders_count) : '৳0'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}
