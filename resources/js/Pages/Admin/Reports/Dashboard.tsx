import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    ChartBarIcon,
    ClipboardDocumentListIcon,
    CubeIcon,
    CurrencyDollarIcon,
    ShoppingBagIcon,
    ExclamationTriangleIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

interface QuickStats {
    total_orders_today: number;
    revenue_today: number;
    pending_orders: number;
    low_stock_alerts: number;
}

interface RecentOrder {
    id: number;
    order_number: string;
    total: number;
    status: string;
    created_at: string;
    user?: {
        name: string;
        email: string;
    };
    orderItems?: Array<{
        quantity: number;
        product: {
            name: string;
            price: number;
        };
    }>;
}

interface WeeklyChart {
    date: string;
    orders: number;
    revenue: number;
}

interface Props {
    quickStats: QuickStats;
    recentOrders: RecentOrder[];
    weeklyChart: WeeklyChart[];
}

export default function Dashboard({ quickStats, recentOrders, weeklyChart }: Props) {
    const formatPrice = (price: number) => {
        return `৳${price.toLocaleString('en-IN')}`;
    };

    const formatNumber = (number: number) => {
        return new Intl.NumberFormat('en-IN').format(number);
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'processing': return 'info';
            case 'shipped': return 'secondary';
            case 'delivered': return 'success';
            case 'cancelled': return 'danger';
            default: return 'default';
        }
    };

    const getStatusDisplayName = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <AdminLayout>
            <Head title="Sacred Reports Dashboard" />

            <div className="max-w-7xl mx-auto py-6">
                {/* Header */}
                <Card className="mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <ChartBarIcon className="h-8 w-8 text-brand-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-semantic-text">Sacred Reports Dashboard</h1>
                                <p className="text-semantic-textSub mt-1">Comprehensive analytics and business insights</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <Link href={route('admin.orders.index')}>
                                <Button variant="secondary">
                                    Manage Orders
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-semantic-textSub mb-1">Orders Today</p>
                        <p className="text-2xl font-bold text-semantic-text">{formatNumber(quickStats.total_orders_today)}</p>
                        <p className="text-xs text-semantic-textSub mt-1">New orders</p>
                    </Card>

                    <Card className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-green-100 rounded-full">
                                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-semantic-textSub mb-1">Revenue Today</p>
                        <p className="text-2xl font-bold text-semantic-text">{formatPrice(quickStats.revenue_today)}</p>
                        <p className="text-xs text-semantic-textSub mt-1">From delivered orders</p>
                    </Card>

                    <Card className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <ClipboardDocumentListIcon className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-semantic-textSub mb-1">Pending Orders</p>
                        <p className="text-2xl font-bold text-semantic-text">{formatNumber(quickStats.pending_orders)}</p>
                        <p className="text-xs text-semantic-textSub mt-1">Require attention</p>
                    </Card>

                    <Card className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-red-100 rounded-full">
                                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-semantic-textSub mb-1">Low Stock Alerts</p>
                        <p className="text-2xl font-bold text-semantic-text">{formatNumber(quickStats.low_stock_alerts)}</p>
                        <p className="text-xs text-semantic-textSub mt-1">Products need restock</p>
                    </Card>
                </div>

                {/* Navigation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link href={route('admin.reports.sales')}>
                        <Card className="group hover:shadow-md transition-shadow duration-200 cursor-pointer">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                                    <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-semantic-text">Sales Analytics</h3>
                                    <p className="text-sm text-semantic-textSub">Revenue trends, top products, customer insights</p>
                                </div>
                            </div>
                        </Card>
                    </Link>

                    <Link href={route('admin.reports.orders')}>
                        <Card className="group hover:shadow-md transition-shadow duration-200 cursor-pointer">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                                    <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-semantic-text">Order Analytics</h3>
                                    <p className="text-sm text-semantic-textSub">Fulfillment metrics, geographic insights</p>
                                </div>
                            </div>
                        </Card>
                    </Link>

                    <Link href={route('admin.reports.inventory')}>
                        <Card className="group hover:shadow-md transition-shadow duration-200 cursor-pointer">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                                    <CubeIcon className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-semantic-text">Inventory Report</h3>
                                    <p className="text-sm text-semantic-textSub">Stock levels, alerts, category analysis</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </div>

                {/* Recent Orders & Weekly Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Orders */}
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-semantic-text">Recent Orders</h3>
                            <Link href={route('admin.orders.index')}>
                                <Button variant="secondary" size="sm">
                                    View All
                                </Button>
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {recentOrders.length === 0 ? (
                                <div className="text-center py-8 text-semantic-textSub">
                                    No recent orders
                                </div>
                            ) : (
                                recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-4 bg-semantic-surface rounded-lg border border-semantic-border">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h4 className="font-medium text-semantic-text">#{order.order_number}</h4>
                                                <Badge variant={getStatusBadgeVariant(order.status)}>
                                                    {getStatusDisplayName(order.status)}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-semantic-textSub">
                                                {order.user?.name || 'Guest'} • {order.orderItems?.length || 0} items
                                            </p>
                                            <p className="text-xs text-semantic-textSub">
                                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-semantic-text">
                                                {formatPrice(order.total)}
                                            </p>
                                            <Link href={route('admin.orders.show', order.id)}>
                                                <Button variant="secondary" size="sm">
                                                    View
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    {/* Weekly Chart (Simple Table for now) */}
                    <Card>
                        <h3 className="text-lg font-semibold text-semantic-text mb-6">Weekly Performance (Last 7 Days)</h3>
                        <div className="space-y-3">
                            {weeklyChart.length === 0 ? (
                                <div className="text-center py-8 text-semantic-textSub">
                                    No weekly data available
                                </div>
                            ) : (
                                weeklyChart.map((day) => (
                                    <div key={day.date} className="flex items-center justify-between p-3 bg-semantic-surface rounded border border-semantic-border">
                                        <div>
                                            <p className="text-sm font-medium text-semantic-text">
                                                {new Date(day.date).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-xs text-semantic-textSub">{formatNumber(day.orders)} orders</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-green-600">
                                                {formatPrice(day.revenue)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Summary */}
                        {weeklyChart.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-semantic-border">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <p className="text-sm text-semantic-textSub">Total Orders</p>
                                        <p className="text-lg font-semibold text-semantic-text">
                                            {formatNumber(weeklyChart.reduce((sum, day) => sum + day.orders, 0))}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-semantic-textSub">Total Revenue</p>
                                        <p className="text-lg font-semibold text-green-600">
                                            {formatPrice(weeklyChart.reduce((sum, day) => sum + day.revenue, 0))}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
