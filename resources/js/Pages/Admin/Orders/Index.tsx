import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Card, Badge, Input } from '@/Components/ui';
import { PageProps } from '@/types';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    CalendarIcon,
    UserIcon,
    CurrencyDollarIcon,
    ShoppingCartIcon,
    ClockIcon,
    TruckIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

interface Order {
    id: number;
    order_number: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    guest_email?: string;
    status: string;
    payment_method: string;
    subtotal: number;
    shipping_cost: number;
    total: number;
    created_at: string;
    updated_at: string;
    items_count?: number;
    shipping_address: any;
}

interface OrderStats {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    total_revenue: number;
}

interface AdminOrdersIndexProps extends PageProps {
    orders: {
        data: Order[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    orderStats: OrderStats;
    statusOptions: Record<string, string>;
    filters: {
        status?: string;
        payment_method?: string;
        search?: string;
        date_from?: string;
        date_to?: string;
    };
}

export default function AdminOrdersIndex({ auth, orders, orderStats, statusOptions, filters }: AdminOrdersIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(filters.payment_method || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleSearch = () => {
        router.get(route('admin.orders.index'), {
            search: searchTerm,
            status: selectedStatus,
            payment_method: selectedPaymentMethod,
            date_from: dateFrom,
            date_to: dateTo,
        }, {
            preserveState: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('');
        setSelectedPaymentMethod('');
        setDateFrom('');
        setDateTo('');
        router.get(route('admin.orders.index'));
    };

    const getStatusBadgeVariant = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'warning' | 'success' | 'danger'> = {
            'pending': 'warning',
            'processing': 'secondary',
            'shipped': 'default',
            'delivered': 'success',
            'cancelled': 'danger',
        };
        return variants[status] || 'default';
    };

    const getStatusIcon = (status: string) => {
        const icons: Record<string, React.ComponentType<any>> = {
            'pending': ClockIcon,
            'processing': ShoppingCartIcon,
            'shipped': TruckIcon,
            'delivered': CheckCircleIcon,
            'cancelled': XCircleIcon,
        };
        const IconComponent = icons[status] || ClockIcon;
        return <IconComponent className="h-4 w-4" />;
    };

    const deleteOrder = (orderId: number, orderNumber: string) => {
        if (confirm(`Are you sure you want to delete order ${orderNumber}? This action cannot be undone.`)) {
            router.delete(route('admin.orders.destroy', orderId), {
                preserveState: true,
                onSuccess: () => {
                    // Handle success
                }
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Order Management" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                        <p className="text-gray-600">Manage and track all customer orders</p>
                    </div>

                    <div className="flex gap-3">
                        <Button asChild variant="secondary">
                            <Link href={route('admin.orders.export', 'csv')}>
                                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                                Export CSV
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    <Card className="p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <ShoppingCartIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                <p className="text-lg font-semibold text-gray-900">{orderStats.total}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <ClockIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-lg font-semibold text-gray-900">{orderStats.pending}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <ShoppingCartIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Processing</p>
                                <p className="text-lg font-semibold text-gray-900">{orderStats.processing}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <TruckIcon className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Shipped</p>
                                <p className="text-lg font-semibold text-gray-900">{orderStats.shipped}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Delivered</p>
                                <p className="text-lg font-semibold text-gray-900">{orderStats.delivered}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <XCircleIcon className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                                <p className="text-lg font-semibold text-gray-900">{orderStats.cancelled}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Revenue</p>
                                <p className="text-lg font-semibold text-gray-900">৳{orderStats.total_revenue.toFixed(2)}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <FunnelIcon className="h-5 w-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Order number, customer..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Statuses</option>
                                {Object.entries(statusOptions).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                            <select
                                value={selectedPaymentMethod}
                                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Methods</option>
                                <option value="cod">Cash on Delivery</option>
                                <option value="online">Online Payment</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                            <Input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                            <Input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <Button onClick={handleSearch}>Apply Filters</Button>
                        <Button variant="secondary" onClick={clearFilters}>Clear Filters</Button>
                    </div>
                </Card>

                {/* Orders Table */}
                <Card>
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Orders ({orders.total})
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.data.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    #{order.order_number}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {order.user ? order.user.name : 'Guest'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {order.user ? order.user.email : order.guest_email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={getStatusBadgeVariant(order.status)} className="flex items-center gap-1">
                                                {getStatusIcon(order.status)}
                                                {statusOptions[order.status]}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ৳{order.total.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <CalendarIcon className="h-4 w-4 mr-1" />
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <Button asChild size="sm" variant="secondary">
                                                <Link href={route('admin.orders.show', order.id)}>
                                                    <EyeIcon className="h-4 w-4 mr-1" />
                                                    View
                                                </Link>
                                            </Button>
                                            <Button asChild size="sm" variant="secondary">
                                                <Link href={route('admin.orders.edit', order.id)}>
                                                    <PencilIcon className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Link>
                                            </Button>
                                            {order.status === 'cancelled' && (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => deleteOrder(order.id, order.order_number)}
                                                >
                                                    <TrashIcon className="h-4 w-4 mr-1" />
                                                    Delete
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {orders.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing {((orders.current_page - 1) * orders.per_page) + 1} to{' '}
                                    {Math.min(orders.current_page * orders.per_page, orders.total)} of{' '}
                                    {orders.total} results
                                </div>
                                <div className="flex space-x-2">
                                    {orders.links.map((link, index) => (
                                        <div key={index}>
                                            {link.url ? (
                                                <Link
                                                    href={link.url}
                                                    className={`px-3 py-2 text-sm rounded-md ${
                                                        link.active
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span
                                                    className="px-3 py-2 text-sm text-gray-400 rounded-md"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AdminLayout>
    );
}
