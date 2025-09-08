import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    ClipboardDocumentListIcon,
    ClockIcon,
    MapPinIcon,
    CreditCardIcon,
    CurrencyDollarIcon,
    ChartPieIcon
} from '@heroicons/react/24/outline';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

interface OrderStatusDistribution {
    status: string;
    count: number;
    total_value: number;
}

interface FulfillmentMetrics {
    average_processing_time: number;
    average_shipping_time: number;
    average_delivery_time: number;
}

interface OrderValueDistribution {
    under_500: number;
    '500_1000': number;
    '1000_2000': number;
    '2000_5000': number;
    over_5000: number;
}

interface TopCity {
    city: string;
    order_count: number;
    total_revenue: number;
}

interface MonthlyTrend {
    year: number;
    month: number;
    orders_count: number;
    revenue: number;
    avg_order_value: number;
}

interface PaymentMethodStat {
    payment_method: string;
    count: number;
    total_value: number;
}

interface Props {
    orderStatusDistribution: OrderStatusDistribution[];
    fulfillmentMetrics: FulfillmentMetrics;
    orderValueDistribution: OrderValueDistribution;
    topCities: TopCity[];
    monthlyTrends: MonthlyTrend[];
    paymentMethodStats: PaymentMethodStat[];
}

export default function Orders({ 
    orderStatusDistribution,
    fulfillmentMetrics,
    orderValueDistribution,
    topCities,
    monthlyTrends,
    paymentMethodStats
}: Props) {
    const formatPrice = (price: number) => {
        return `৳${price.toLocaleString('en-IN')}`;
    };

    const formatNumber = (number: number) => {
        return new Intl.NumberFormat('en-IN').format(number);
    };

    const formatHours = (hours: number) => {
        if (hours < 24) {
            return `${hours.toFixed(1)}h`;
        }
        return `${(hours / 24).toFixed(1)}d`;
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

    const getMonthName = (month: number) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[month - 1];
    };

    return (
        <AdminLayout>
            <Head title="Sacred Order Analytics" />

            <div className="max-w-7xl mx-auto py-6">
                {/* Header */}
                <Card className="mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <ClipboardDocumentListIcon className="h-8 w-8 text-brand-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-semantic-text">Sacred Order Analytics</h1>
                                <p className="text-semantic-textSub mt-1">Comprehensive order insights and fulfillment metrics</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <Link href={route('admin.reports.dashboard')}>
                                <Button variant="secondary">
                                    Reports Dashboard
                                </Button>
                            </Link>
                            <Link href={route('admin.reports.sales')}>
                                <Button variant="primary">
                                    Sales Analytics
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>

                {/* Fulfillment Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <ClockIcon className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-semantic-textSub mb-1">Avg Processing Time</p>
                        <p className="text-2xl font-bold text-semantic-text">{formatHours(fulfillmentMetrics.average_processing_time)}</p>
                        <p className="text-xs text-semantic-textSub mt-1">Pending → Processing</p>
                    </Card>

                    <Card className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-orange-100 rounded-full">
                                <ClockIcon className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-semantic-textSub mb-1">Avg Shipping Time</p>
                        <p className="text-2xl font-bold text-semantic-text">{formatHours(fulfillmentMetrics.average_shipping_time)}</p>
                        <p className="text-xs text-semantic-textSub mt-1">Processing → Shipped</p>
                    </Card>

                    <Card className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-green-100 rounded-full">
                                <ClockIcon className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-semantic-textSub mb-1">Avg Delivery Time</p>
                        <p className="text-2xl font-bold text-semantic-text">{formatHours(fulfillmentMetrics.average_delivery_time)}</p>
                        <p className="text-xs text-semantic-textSub mt-1">Shipped → Delivered</p>
                    </Card>
                </div>

                {/* Order Status & Value Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Order Status Distribution */}
                    <Card>
                        <h3 className="text-lg font-semibold text-semantic-text mb-6 flex items-center">
                            <ChartPieIcon className="h-5 w-5 mr-2 text-brand-600" />
                            Order Status Distribution
                        </h3>
                        <div className="space-y-4">
                            {orderStatusDistribution.length === 0 ? (
                                <div className="text-center py-8 text-semantic-textSub">
                                    No order status data available
                                </div>
                            ) : (
                                orderStatusDistribution.map((status) => (
                                    <div key={status.status} className="flex items-center justify-between p-4 bg-semantic-surface rounded-lg border border-semantic-border">
                                        <div className="flex items-center space-x-3">
                                            <Badge variant={getStatusBadgeVariant(status.status)}>
                                                {getStatusDisplayName(status.status)}
                                            </Badge>
                                            <div>
                                                <p className="text-sm text-semantic-textSub">
                                                    {formatNumber(status.count)} orders
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-semantic-text">
                                                {formatPrice(status.total_value)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    {/* Order Value Distribution */}
                    <Card>
                        <h3 className="text-lg font-semibold text-semantic-text mb-6 flex items-center">
                            <CurrencyDollarIcon className="h-5 w-5 mr-2 text-brand-600" />
                            Order Value Distribution
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-semantic-surface rounded-lg border border-semantic-border">
                                <span className="text-semantic-text">Under ৳500</span>
                                <span className="font-semibold text-semantic-text">{formatNumber(orderValueDistribution.under_500)}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-semantic-surface rounded-lg border border-semantic-border">
                                <span className="text-semantic-text">৳500 - ৳999</span>
                                <span className="font-semibold text-semantic-text">{formatNumber(orderValueDistribution['500_1000'])}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-semantic-surface rounded-lg border border-semantic-border">
                                <span className="text-semantic-text">৳1,000 - ৳1,999</span>
                                <span className="font-semibold text-semantic-text">{formatNumber(orderValueDistribution['1000_2000'])}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-semantic-surface rounded-lg border border-semantic-border">
                                <span className="text-semantic-text">৳2,000 - ৳4,999</span>
                                <span className="font-semibold text-semantic-text">{formatNumber(orderValueDistribution['2000_5000'])}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-semantic-surface rounded-lg border border-semantic-border">
                                <span className="text-semantic-text">৳5,000+</span>
                                <span className="font-semibold text-semantic-text">{formatNumber(orderValueDistribution.over_5000)}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Geographic & Payment Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Top Cities */}
                    <Card>
                        <h3 className="text-lg font-semibold text-semantic-text mb-6 flex items-center">
                            <MapPinIcon className="h-5 w-5 mr-2 text-brand-600" />
                            Top Cities by Orders
                        </h3>
                        <div className="space-y-4">
                            {topCities.length === 0 ? (
                                <div className="text-center py-8 text-semantic-textSub">
                                    No geographic data available
                                </div>
                            ) : (
                                topCities.map((city, index) => (
                                    <div key={city.city} className="flex items-center justify-between p-4 bg-semantic-surface rounded-lg border border-semantic-border">
                                        <div className="flex items-center space-x-3">
                                            <Badge variant={index < 3 ? "success" : "secondary"}>
                                                #{index + 1}
                                            </Badge>
                                            <div>
                                                <h4 className="font-medium text-semantic-text">{city.city}</h4>
                                                <p className="text-sm text-semantic-textSub">
                                                    {formatNumber(city.order_count)} orders
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-green-600">
                                                {formatPrice(city.total_revenue)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    {/* Payment Methods */}
                    <Card>
                        <h3 className="text-lg font-semibold text-semantic-text mb-6 flex items-center">
                            <CreditCardIcon className="h-5 w-5 mr-2 text-brand-600" />
                            Payment Method Analytics
                        </h3>
                        <div className="space-y-4">
                            {paymentMethodStats.length === 0 ? (
                                <div className="text-center py-8 text-semantic-textSub">
                                    No payment method data available
                                </div>
                            ) : (
                                paymentMethodStats.map((method) => (
                                    <div key={method.payment_method} className="flex items-center justify-between p-4 bg-semantic-surface rounded-lg border border-semantic-border">
                                        <div>
                                            <h4 className="font-medium text-semantic-text capitalize">
                                                {method.payment_method === 'cod' ? 'Cash on Delivery' : method.payment_method}
                                            </h4>
                                            <p className="text-sm text-semantic-textSub">
                                                {formatNumber(method.count)} orders
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-green-600">
                                                {formatPrice(method.total_value)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Monthly Trends */}
                <Card>
                    <h3 className="text-lg font-semibold text-semantic-text mb-6">Monthly Order Trends (Last 12 Months)</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-semantic-border">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">Month</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">Orders</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">Revenue</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">Avg Order Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-semantic-border">
                                {monthlyTrends.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-semantic-textSub">
                                            No monthly trend data available
                                        </td>
                                    </tr>
                                ) : (
                                    monthlyTrends.map((trend, index) => (
                                        <tr key={`${trend.year}-${trend.month}`} className="hover:bg-semantic-surface transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-semantic-text">
                                                {getMonthName(trend.month)} {trend.year}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-semantic-text">
                                                {formatNumber(trend.orders_count)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                                {formatPrice(trend.revenue)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-semantic-text">
                                                {formatPrice(trend.avg_order_value)}
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
