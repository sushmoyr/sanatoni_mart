import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Card, Badge } from '@/Components/ui';
import { 
    CurrencyDollarIcon,
    ShoppingBagIcon,
    CubeIcon,
    FolderIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    UsersIcon,
    ClockIcon,
    ShieldCheckIcon,
    StarIcon,
    BuildingOfficeIcon,
    BriefcaseIcon
} from '@heroicons/react/24/outline';

interface BusinessStats {
    total_revenue: number;
    monthly_revenue: number;
    total_orders: number;
    pending_orders: number;
    total_products: number;
    active_products: number;
    total_categories: number;
    low_stock_products: number;
    total_revenue_change: number;
    monthly_revenue_change: number;
    orders_change: number;
    pending_orders_change: number;
    products_change: number;
    low_stock_change: number;
}

interface UserStats {
    total_users: number;
    active_users: number;
    admin_users: number;
    manager_users: number;
    salesperson_users: number;
}

interface MonthlySale {
    month: string;
    revenue: number;
    orders: number;
}

interface WeeklySale {
    date: string;
    day: string;
    revenue: number;
    orders: number;
}

interface TopCategory {
    name: string;
    products_count: number;
}

interface RecentOrder {
    id: number;
    order_number: string;
    total: number;
    status: string;
    customer_name: string;
    created_at: string;
}

interface OrderStatusData {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
}

export default function Dashboard({ 
    businessStats,
    userStats,
    monthlySales,
    weeklySales,
    topCategories,
    recentOrders,
    orderStatusData,
    user_permissions 
}: PageProps<{ 
    businessStats: BusinessStats;
    userStats: UserStats;
    monthlySales: MonthlySale[];
    weeklySales: WeeklySale[];
    topCategories: TopCategory[];
    recentOrders: RecentOrder[];
    orderStatusData: OrderStatusData;
    user_permissions: string[];
}>) {
    const formatCurrency = (amount: number) => {
        return `৳${amount.toLocaleString('en-IN')}`;
    };

    const formatNumber = (num: number) => {
        return num.toLocaleString('en-IN');
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

    const formatPercentageChange = (value: number) => {
        if (value === 0) return null;
        const sign = value > 0 ? '+' : '';
        return `${sign}${value}%`;
    };

    const getChangeType = (value: number) => {
        if (value === 0) return null;
        return value > 0 ? 'positive' : 'negative';
    };

    const businessStatCards = [
        {
            title: 'Total Revenue',
            value: formatCurrency(businessStats.total_revenue),
            icon: CurrencyDollarIcon,
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600',
            change: formatPercentageChange(businessStats.total_revenue_change),
            changeType: getChangeType(businessStats.total_revenue_change)
        },
        {
            title: 'Monthly Revenue',
            value: formatCurrency(businessStats.monthly_revenue),
            icon: ArrowTrendingUpIcon,
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
            change: formatPercentageChange(businessStats.monthly_revenue_change),
            changeType: getChangeType(businessStats.monthly_revenue_change)
        },
        {
            title: 'Total Orders',
            value: formatNumber(businessStats.total_orders),
            icon: ShoppingBagIcon,
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
            change: formatPercentageChange(businessStats.orders_change),
            changeType: getChangeType(businessStats.orders_change)
        },
        {
            title: 'Pending Orders',
            value: formatNumber(businessStats.pending_orders),
            icon: ClockIcon,
            bgColor: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            change: formatPercentageChange(businessStats.pending_orders_change),
            changeType: getChangeType(businessStats.pending_orders_change)
        },
        {
            title: 'Total Products',
            value: formatNumber(businessStats.total_products),
            icon: CubeIcon,
            bgColor: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
            change: formatPercentageChange(businessStats.products_change),
            changeType: getChangeType(businessStats.products_change)
        },
        {
            title: 'Low Stock Alerts',
            value: formatNumber(businessStats.low_stock_products),
            icon: ExclamationTriangleIcon,
            bgColor: 'bg-red-100',
            iconColor: 'text-red-600',
            change: formatPercentageChange(businessStats.low_stock_change),
            changeType: getChangeType(businessStats.low_stock_change)
        }
    ];

    const userStatCards = [
        {
            title: 'Total Users',
            value: userStats.total_users,
            icon: UsersIcon,
            bgColor: 'bg-brand-100',
            iconColor: 'text-brand-600'
        },
        {
            title: 'Active Users',
            value: userStats.active_users,
            icon: ShieldCheckIcon,
            bgColor: 'bg-success-100',
            iconColor: 'text-success-600'
        },
        {
            title: 'Admins',
            value: userStats.admin_users,
            icon: StarIcon,
            bgColor: 'bg-accent-100',
            iconColor: 'text-accent-600'
        },
        {
            title: 'Managers',
            value: userStats.manager_users,
            icon: BuildingOfficeIcon,
            bgColor: 'bg-warning-100',
            iconColor: 'text-warning-600'
        }
    ];

    const maxRevenue = Math.max(...monthlySales.map(s => s.revenue));
    const maxWeeklyRevenue = Math.max(...weeklySales.map(s => s.revenue));

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            
            <div className="space-y-8">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-semantic-textSub">
                            Comprehensive overview of your e-commerce operations
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Link href={route('admin.reports.dashboard')}>
                            <Card className="px-4 py-2 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex items-center space-x-2">
                                    <ChartBarIcon className="h-5 w-5 text-brand-600" />
                                    <span className="text-sm font-medium text-semantic-text">View Reports</span>
                                </div>
                            </Card>
                        </Link>
                    </div>
                </div>

                {/* Business Stats Grid */}
                <div>
                    <h2 className="text-xl font-semibold text-semantic-text mb-4">Business Overview</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {businessStatCards.map((stat) => (
                            <Card key={stat.title} className="p-6 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                                                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                                            </div>
                                        </div>
                                        <p className="text-xs font-medium text-semantic-textSub mb-1">
                                            {stat.title}
                                        </p>
                                        <p className="text-lg font-bold text-semantic-text">
                                            {stat.value}
                                        </p>
                                        {stat.change && (
                                            <div className={`flex items-center mt-1 text-xs ${
                                                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {stat.changeType === 'positive' ? (
                                                    <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                                                ) : (
                                                    <ArrowTrendingDownIcon className="h-3 w-3 mr-1" />
                                                )}
                                                {stat.change}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Charts and Analytics Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Monthly Sales Chart */}
                    <Card className="lg:col-span-2">
                        <div className="p-6 border-b border-semantic-border">
                            <h3 className="text-lg font-semibold text-semantic-text">Monthly Sales Trend</h3>
                            <p className="text-sm text-semantic-textSub">Revenue and orders over the last 6 months</p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {monthlySales.map((data, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="text-sm font-medium text-semantic-text w-16">
                                                {data.month}
                                            </div>
                                            <div className="flex-1">
                                                <div className="bg-semantic-surface rounded-full h-2 relative overflow-hidden">
                                                    <div 
                                                        className="bg-blue-500 h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-semibold text-semantic-text">
                                                {formatCurrency(data.revenue)}
                                            </div>
                                            <div className="text-xs text-semantic-textSub">
                                                {data.orders} orders
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Order Status Distribution */}
                    <Card>
                        <div className="p-6 border-b border-semantic-border">
                            <h3 className="text-lg font-semibold text-semantic-text">Order Status</h3>
                            <p className="text-sm text-semantic-textSub">Current order distribution</p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {Object.entries(orderStatusData).map(([status, count]) => (
                                    <div key={status} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Badge variant={getStatusBadgeVariant(status)} size="sm">
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </Badge>
                                        </div>
                                        <div className="text-sm font-semibold text-semantic-text">
                                            {count}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Weekly Trend and Recent Orders */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Weekly Sales Trend */}
                    <Card>
                        <div className="p-6 border-b border-semantic-border">
                            <h3 className="text-lg font-semibold text-semantic-text">Weekly Sales</h3>
                            <p className="text-sm text-semantic-textSub">Last 7 days performance</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-7 gap-2">
                                {weeklySales.map((data, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-xs text-semantic-textSub mb-2">{data.day}</div>
                                        <div className="bg-semantic-surface rounded h-20 flex items-end justify-center p-1 relative overflow-hidden">
                                            <div 
                                                className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-sm w-full transition-all duration-500"
                                                style={{ height: `${Math.max((data.revenue / maxWeeklyRevenue) * 100, 5)}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-semantic-textSub mt-1">{data.orders}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Recent Orders */}
                    <Card>
                        <div className="p-6 border-b border-semantic-border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-semantic-text">Recent Orders</h3>
                                    <p className="text-sm text-semantic-textSub">Latest customer orders</p>
                                </div>
                                <Link href={route('admin.orders.index')}>
                                    <EyeIcon className="h-5 w-5 text-brand-600 hover:text-brand-700 cursor-pointer" />
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-3 bg-semantic-surface rounded-lg">
                                        <div>
                                            <div className="text-sm font-medium text-semantic-text">
                                                #{order.order_number}
                                            </div>
                                            <div className="text-xs text-semantic-textSub">
                                                {order.customer_name}
                                            </div>
                                            <div className="text-xs text-semantic-textSub">
                                                {order.created_at}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-semibold text-semantic-text">
                                                {formatCurrency(order.total)}
                                            </div>
                                            <Badge variant={getStatusBadgeVariant(order.status)} size="sm">
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* User Management Summary and Top Categories */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* User Statistics */}
                    <Card className="lg:col-span-2">
                        <div className="p-6 border-b border-semantic-border">
                            <h3 className="text-lg font-semibold text-semantic-text">User Management</h3>
                            <p className="text-sm text-semantic-textSub">User roles and activity overview</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {userStatCards.map((stat) => (
                                    <div key={stat.title} className="text-center">
                                        <div className="flex items-center justify-center mb-2">
                                            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                                                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold text-semantic-text">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs text-semantic-textSub">
                                            {stat.title}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Top Categories */}
                    <Card>
                        <div className="p-6 border-b border-semantic-border">
                            <h3 className="text-lg font-semibold text-semantic-text">Top Categories</h3>
                            <p className="text-sm text-semantic-textSub">By product count</p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {topCategories.map((category, index) => (
                                    <div key={category.name} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center">
                                                <span className="text-xs font-semibold text-brand-600">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium text-semantic-text">
                                                {category.name}
                                            </span>
                                        </div>
                                        <span className="text-sm text-semantic-textSub">
                                            {category.products_count} products
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
