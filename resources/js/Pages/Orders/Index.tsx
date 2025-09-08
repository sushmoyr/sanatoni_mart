import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import BrandedStoreLayout from '@/Layouts/BrandedStoreLayout';
import { Button, Card, Badge, Input } from '@/Components/ui';
import { PageProps } from '@/types';
import { ShoppingBagIcon, MagnifyingGlassIcon, ClockIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

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

interface Props extends PageProps {
    orders: PaginationData;
    orderStatuses: Record<string, string>;
    filters: {
        status?: string;
        search?: string;
    };
}

export default function OrderIndex({ auth, orders, orderStatuses, filters }: Props) {
    const handleStatusFilter = (status: string) => {
        router.get(route('orders.index'), { 
            ...filters, 
            status: status === filters.status ? undefined : status 
        });
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        router.get(route('orders.index'), { ...filters, search });
    };

    const handleReorder = (orderId: number) => {
        router.post(route('orders.reorder', orderId));
    };

    const handleCancel = (orderId: number) => {
        if (confirm('Are you sure you want to cancel this order?')) {
            router.post(route('orders.cancel', orderId));
        }
    };

    return (
        <BrandedStoreLayout>
            <Head title="My Orders" />

            <div className="sacred-bg min-h-screen py-8">
                <div className="container-custom">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                            My Orders
                        </h1>
                        <p className="text-semantic-textSub">
                            Track and manage your sacred purchases
                        </p>
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
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="flex-1 max-w-md">
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-semantic-textSub" />
                                    <Input
                                        type="text"
                                        name="search"
                                        placeholder="Search by order number or product..."
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

                            {/* Status Filter */}
                            <div className="flex flex-wrap gap-2">
                                <Badge
                                    variant={!filters.status ? "default" : "secondary"}
                                    className="cursor-pointer"
                                    onClick={() => handleStatusFilter('')}
                                >
                                    All Orders
                                </Badge>
                                {Object.entries(orderStatuses).map(([value, label]) => (
                                    <Badge
                                        key={value}
                                        variant={filters.status === value ? "default" : "secondary"}
                                        className="cursor-pointer"
                                        onClick={() => handleStatusFilter(value)}
                                    >
                                        {label}
                                    </Badge>
                                ))}
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
                                    {filters.status || filters.search
                                        ? 'Try adjusting your filters or search terms.'
                                        : "You haven't placed any orders yet."}
                                </p>
                                {!filters.status && !filters.search && (
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
                                                    Placed on {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Badge 
                                                variant={order.status === 'completed' ? 'success' : order.status === 'cancelled' ? 'danger' : 'default'}
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
                                        <Button variant="secondary" asChild>
                                            <Link href={route('orders.show', order.id)}>
                                                View Details
                                            </Link>
                                        </Button>
                                        
                                        <Button
                                            variant="tertiary"
                                            onClick={() => handleReorder(order.id)}
                                        >
                                            <ArrowPathIcon className="h-4 w-4 mr-2" />
                                            Reorder
                                        </Button>

                                        {order.can_be_cancelled && (
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleCancel(order.id)}
                                                className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
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
