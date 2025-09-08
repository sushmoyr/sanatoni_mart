import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import BrandedStoreLayout from '@/Layouts/BrandedStoreLayout';
import { Button, Card, Badge, Input } from '@/Components/ui';
import { PageProps } from '@/types';
import { 
    ShoppingBagIcon, 
    MagnifyingGlassIcon, 
    ClockIcon, 
    XMarkIcon, 
    ArrowPathIcon,
    FunnelIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    AdjustmentsHorizontalIcon,
    ChartBarIcon,
    ChevronDownIcon,
    Bars3BottomLeftIcon
} from '@heroicons/react/24/outline';

interface OrderItem {
    id: number;
    product: {
        id: number;
        name: string;
        images: Array<{ image_path: string }>;
    };
    quantity: number;
    price: number;
    subtotal: number;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    total: number;
    created_at: string;
    items: OrderItem[];
    items_count: number;
    status_badge_class: string;
    formatted_total: string;
    can_be_cancelled: boolean;
}

interface PaginationData {
    data: Order[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface OrderStats {
    total_orders: number;
    total_spent: number;
    average_order_value: number;
}

interface QuickActions {
    pending_orders: number;
    processing_orders: number;
    shipped_orders: number;
}

interface Props extends PageProps {
    orders: PaginationData;
    orderStatuses: Record<string, string>;
    statusCounts: Record<string, number>;
    filters: {
        status?: string;
        search?: string;
        date_from?: string;
        date_to?: string;
        amount_min?: string;
        amount_max?: string;
        sort_by?: string;
        sort_direction?: string;
    };
    orderStats: OrderStats;
    quickActions: QuickActions;
}

export default function OrderIndex({ auth, orders, orderStatuses, statusCounts, filters, orderStats, quickActions }: Props) {
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);

    const handleStatusFilter = (status: string) => {
        router.get(route('orders.index'), { 
            ...filters, 
            status: status === filters.status ? undefined : status 
        });
    };

    const handleAdvancedFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(route('orders.index'), localFilters);
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        router.get(route('orders.index'), { ...filters, search });
    };

    const handleSort = (sortBy: string) => {
        const newDirection = filters.sort_by === sortBy && filters.sort_direction === 'desc' ? 'asc' : 'desc';
        router.get(route('orders.index'), { 
            ...filters, 
            sort_by: sortBy, 
            sort_direction: newDirection 
        });
    };

    const clearFilters = () => {
        router.get(route('orders.index'));
    };

    const handleReorder = (orderId: number) => {
        router.post(route('orders.reorder', orderId));
    };

    const handleCancel = (orderId: number) => {
        if (confirm('Are you sure you want to cancel this order?')) {
            router.post(route('orders.cancel', orderId));
        }
    };

    const formatPrice = (price: number) => {
        return `৳${price.toLocaleString('en-IN')}`;
    };

    return (
        <BrandedStoreLayout>
            <Head title="My Orders" />

            <div className="sacred-bg min-h-screen py-8">
                <div className="container-custom">
                    {/* Header with Stats */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                            My Sacred Orders
                        </h1>
                        <p className="text-semantic-textSub">
                            Track and manage your spiritual journey
                        </p>
                    </div>

                    {/* Order Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <Card className="p-4 devotional-border text-center">
                            <div className="flex items-center justify-center mb-2">
                                <ChartBarIcon className="w-6 h-6 text-brand-600" />
                            </div>
                            <p className="text-2xl font-bold text-semantic-text">{orderStats.total_orders}</p>
                            <p className="text-sm text-semantic-textSub">Total Orders</p>
                        </Card>
                        <Card className="p-4 devotional-border text-center">
                            <div className="flex items-center justify-center mb-2">
                                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-semantic-text">{formatPrice(orderStats.total_spent)}</p>
                            <p className="text-sm text-semantic-textSub">Total Spent</p>
                        </Card>
                        <Card className="p-4 devotional-border text-center">
                            <div className="flex items-center justify-center mb-2">
                                <Bars3BottomLeftIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-semantic-text">{formatPrice(orderStats.average_order_value)}</p>
                            <p className="text-sm text-semantic-textSub">Average Order</p>
                        </Card>
                        <Card className="p-4 devotional-border text-center">
                            <div className="flex items-center justify-center mb-2">
                                <ClockIcon className="w-6 h-6 text-orange-600" />
                            </div>
                            <p className="text-2xl font-bold text-semantic-text">{quickActions.pending_orders + quickActions.processing_orders}</p>
                            <p className="text-sm text-semantic-textSub">Active Orders</p>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Button 
                            variant={quickActions.pending_orders > 0 ? "primary" : "secondary"} 
                            className="justify-between h-auto p-4"
                            onClick={() => handleStatusFilter('pending')}
                        >
                            <div className="text-left">
                                <p className="font-semibold">Pending Orders</p>
                                <p className="text-sm opacity-80">Awaiting confirmation</p>
                            </div>
                            <div className="text-2xl font-bold">{quickActions.pending_orders}</div>
                        </Button>
                        <Button 
                            variant={quickActions.processing_orders > 0 ? "primary" : "secondary"} 
                            className="justify-between h-auto p-4"
                            onClick={() => handleStatusFilter('processing')}
                        >
                            <div className="text-left">
                                <p className="font-semibold">Processing</p>
                                <p className="text-sm opacity-80">Being prepared</p>
                            </div>
                            <div className="text-2xl font-bold">{quickActions.processing_orders}</div>
                        </Button>
                        <Button 
                            variant={quickActions.shipped_orders > 0 ? "primary" : "secondary"} 
                            className="justify-between h-auto p-4"
                            onClick={() => handleStatusFilter('shipped')}
                        >
                            <div className="text-left">
                                <p className="font-semibold">Shipped</p>
                                <p className="text-sm opacity-80">On the way</p>
                            </div>
                            <div className="text-2xl font-bold">{quickActions.shipped_orders}</div>
                        </Button>
                    </div>

                    <div className="mb-6 flex justify-end">
                        <Button asChild>
                            <Link href={route('products.index')}>
                                <ShoppingBagIcon className="h-4 w-4 mr-2" />
                                Continue Shopping
                            </Link>
                        </Button>
                    </div>

                    {/* Filters */}
                    <Card className="p-6 mb-6 devotional-border">
                        <div className="flex flex-col space-y-4">
                            {/* Basic Search and Filters */}
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Search */}
                                <form onSubmit={handleSearch} className="flex-1 max-w-md">
                                    <div className="relative">
                                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-semantic-textSub" />
                                        <Input
                                            type="text"
                                            name="search"
                                            placeholder="Search orders, products, notes..."
                                            defaultValue={filters.search || ''}
                                            className="pl-10"
                                        />
                                        <Button
                                            type="submit"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                        >
                                            Search
                                        </Button>
                                    </div>
                                </form>

                                {/* Advanced Filters Toggle */}
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="secondary"
                                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                    >
                                        <FunnelIcon className="h-4 w-4 mr-2" />
                                        Advanced Filters
                                        <ChevronDownIcon className={`h-4 w-4 ml-2 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                                    </Button>
                                    {(filters.status || filters.search || filters.date_from || filters.date_to || filters.amount_min || filters.amount_max) && (
                                        <Button variant="ghost" onClick={clearFilters}>
                                            <XMarkIcon className="h-4 w-4 mr-1" />
                                            Clear
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="flex flex-wrap gap-2">
                                <Badge
                                    variant={!filters.status ? "default" : "secondary"}
                                    className="cursor-pointer"
                                    onClick={() => handleStatusFilter('')}
                                >
                                    All Orders ({orders.total})
                                </Badge>
                                {Object.entries(orderStatuses).map(([value, label]) => {
                                    const count = statusCounts[value] || 0;
                                    return (
                                        <Badge
                                            key={value}
                                            variant={filters.status === value ? "default" : "secondary"}
                                            className="cursor-pointer"
                                            onClick={() => handleStatusFilter(value)}
                                        >
                                            {label} ({count})
                                        </Badge>
                                    );
                                })}
                            </div>

                            {/* Advanced Filters */}
                            {showAdvancedFilters && (
                                <form onSubmit={handleAdvancedFilter} className="border-t border-semantic-border pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-semantic-text mb-1">From Date</label>
                                            <Input
                                                type="date"
                                                value={localFilters.date_from || ''}
                                                onChange={(e) => setLocalFilters({...localFilters, date_from: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-semantic-text mb-1">To Date</label>
                                            <Input
                                                type="date"
                                                value={localFilters.date_to || ''}
                                                onChange={(e) => setLocalFilters({...localFilters, date_to: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-semantic-text mb-1">Min Amount (৳)</label>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={localFilters.amount_min || ''}
                                                onChange={(e) => setLocalFilters({...localFilters, amount_min: e.target.value})}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-semantic-text mb-1">Max Amount (৳)</label>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={localFilters.amount_max || ''}
                                                onChange={(e) => setLocalFilters({...localFilters, amount_max: e.target.value})}
                                                placeholder="999999.99"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button type="submit" variant="primary">
                                            Apply Filters
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="secondary"
                                            onClick={() => setLocalFilters({})}
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </Card>

                    {/* Sorting Options */}
                    <Card className="p-4 mb-6 devotional-border">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-semantic-text">Sort by:</span>
                            <div className="flex space-x-2">
                                <Button
                                    variant={filters.sort_by === 'created_at' ? 'primary' : 'ghost'}
                                    size="sm"
                                    onClick={() => handleSort('created_at')}
                                >
                                    Date {filters.sort_by === 'created_at' && (filters.sort_direction === 'desc' ? '↓' : '↑')}
                                </Button>
                                <Button
                                    variant={filters.sort_by === 'total' ? 'primary' : 'ghost'}
                                    size="sm"
                                    onClick={() => handleSort('total')}
                                >
                                    Amount {filters.sort_by === 'total' && (filters.sort_direction === 'desc' ? '↓' : '↑')}
                                </Button>
                                <Button
                                    variant={filters.sort_by === 'status' ? 'primary' : 'ghost'}
                                    size="sm"
                                    onClick={() => handleSort('status')}
                                >
                                    Status {filters.sort_by === 'status' && (filters.sort_direction === 'desc' ? '↓' : '↑')}
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Orders List */}
                    <div className="space-y-6">
                        {orders.data.length === 0 ? (
                            <Card className="p-12 text-center devotional-border">
                                <div className="mx-auto h-24 w-24 text-semantic-textSub mb-6">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-serif font-semibold text-semantic-text mb-2">No orders found</h3>
                                <p className="text-semantic-textSub mb-6">
                                    {filters.status || filters.search || filters.date_from || filters.date_to || filters.amount_min || filters.amount_max
                                        ? 'Try adjusting your filters or search terms.'
                                        : "You haven't placed any orders yet."}
                                </p>
                                {!filters.status && !filters.search && !filters.date_from && !filters.date_to && !filters.amount_min && !filters.amount_max && (
                                    <Button asChild>
                                        <Link href={route('products.index')}>
                                            <ShoppingBagIcon className="h-4 w-4 mr-2" />
                                            Start Shopping
                                        </Link>
                                    </Button>
                                )}
                            </Card>
                        ) : (
                            orders.data.map((order) => (
                                <Card key={order.id} className="p-6 devotional-border">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <h3 className="text-lg font-serif font-semibold text-semantic-text">
                                                    Order #{order.order_number}
                                                </h3>
                                                <p className="text-sm text-semantic-textSub flex items-center">
                                                    <ClockIcon className="h-4 w-4 mr-1" />
                                                    Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            <Badge 
                                                variant={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'default'}
                                            >
                                                {orderStatuses[order.status] || order.status}
                                            </Badge>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-brand-600 font-tnum">{order.formatted_total}</p>
                                            <p className="text-sm text-semantic-textSub">{order.items_count} items</p>
                                        </div>
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                                        {order.items.slice(0, 3).map((item) => (
                                            <div key={item.id} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                                                <img
                                                    src={item.product.images[0]?.image_path || '/images/placeholder.jpg'}
                                                    alt={item.product.name}
                                                    className="w-12 h-12 object-cover rounded-lg shadow-e1"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-semantic-text truncate">{item.product.name}</p>
                                                    <p className="text-xs text-semantic-textSub">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items_count > 3 && (
                                            <div className="flex items-center justify-center p-3 bg-neutral-50 rounded-lg text-sm text-semantic-textSub">
                                                +{order.items_count - 3} more items
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-3">
                                        <Button variant="primary" asChild>
                                            <Link href={route('orders.show', order.id)}>
                                                View Details & Track
                                            </Link>
                                        </Button>
                                        
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleReorder(order.id)}
                                        >
                                            <ArrowPathIcon className="h-4 w-4 mr-2" />
                                            Reorder
                                        </Button>

                                        {order.can_be_cancelled && (
                                            <Button
                                                variant="destructive"
                                                onClick={() => handleCancel(order.id)}
                                            >
                                                <XMarkIcon className="h-4 w-4 mr-2" />
                                                Cancel Order
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {orders.last_page > 1 && (
                        <Card className="p-6 mt-6 devotional-border">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-semantic-textSub">
                                    Showing {(orders.current_page - 1) * orders.per_page + 1} to{' '}
                                    {Math.min(orders.current_page * orders.per_page, orders.total)} of{' '}
                                    {orders.total} results
                                </div>
                                <div className="flex space-x-1">
                                    {orders.links.map((link, index) => (
                                        link.url ? (
                                            <Button
                                                key={index}
                                                variant={link.active ? "primary" : "ghost"}
                                                size="sm"
                                                onClick={() => router.get(link.url!)}
                                            >
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            </Button>
                                        ) : (
                                            <span
                                                key={index}
                                                className="px-3 py-2 text-sm text-semantic-textSub"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </BrandedStoreLayout>
    );
}
