import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Card, Input } from '@/Components/ui';
import { PageProps } from '@/types';
import {
    ArrowLeftIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface OrderItem {
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    subtotal: number;
    product: {
        id: number;
        name: string;
        sku: string;
        images?: Array<{ image_path: string }>;
    };
}

interface Order {
    id: number;
    order_number: string;
    user?: {
        id: number;
        name: string;
        email: string;
        phone?: string;
    };
    guest_email?: string;
    status: string;
    payment_method: string;
    subtotal: number;
    shipping_cost: number;
    total: number;
    shipping_address: {
        name: string;
        phone: string;
        address_line_1: string;
        address_line_2?: string;
        city: string;
        district?: string;
        division?: string;
        postal_code?: string;
    };
    billing_address: any;
    notes?: string;
    created_at: string;
    updated_at: string;
    items: OrderItem[];
}

interface AdminOrderEditProps extends PageProps {
    order: Order;
    statusOptions: Record<string, string>;
}

export default function AdminOrderEdit({ auth, order, statusOptions }: AdminOrderEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        status: order.status,
        notes: order.notes || '',
        shipping_address: {
            name: order.shipping_address.name,
            phone: order.shipping_address.phone,
            address_line_1: order.shipping_address.address_line_1,
            address_line_2: order.shipping_address.address_line_2 || '',
            city: order.shipping_address.city,
            district: order.shipping_address.district || '',
            division: order.shipping_address.division || '',
            postal_code: order.shipping_address.postal_code || '',
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.orders.update', order.id));
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'pending': 'text-yellow-600 bg-yellow-50 border-yellow-200',
            'processing': 'text-blue-600 bg-blue-50 border-blue-200',
            'shipped': 'text-indigo-600 bg-indigo-50 border-indigo-200',
            'delivered': 'text-green-600 bg-green-50 border-green-200',
            'cancelled': 'text-red-600 bg-red-50 border-red-200',
        };
        return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
    };

    return (
        <AdminLayout>
            <Head title={`Edit Order #${order.order_number}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="secondary" size="sm">
                            <Link href={route('admin.orders.show', order.id)}>
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                Back to Order
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Order #{order.order_number}</h1>
                            <p className="text-gray-600">Modify order details and status</p>
                        </div>
                    </div>
                </div>

                {/* Warning for status changes */}
                <Card className="p-4 border-amber-200 bg-amber-50">
                    <div className="flex items-start space-x-3">
                        <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div className="text-sm text-amber-800">
                            <p className="font-medium">Important Notes:</p>
                            <ul className="mt-1 list-disc list-inside space-y-1">
                                <li>Changing status to "Cancelled" will restore product stock</li>
                                <li>Changing status from "Cancelled" will deduct product stock</li>
                                <li>Status changes are logged in order history</li>
                                <li>Customers will be notified of status changes via email</li>
                            </ul>
                        </div>
                    </div>
                </Card>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Status */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Status
                                        </label>
                                        <div className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium border ${getStatusColor(order.status)}`}>
                                            {statusOptions[order.status]}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Status *
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            {Object.entries(statusOptions).map(([value, label]) => (
                                                <option key={value} value={value}>{label}</option>
                                            ))}
                                        </select>
                                        {errors.status && (
                                            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                        )}
                                    </div>
                                </div>
                            </Card>

                            {/* Shipping Address */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name *
                                        </label>
                                        <Input
                                            value={data.shipping_address.name}
                                            onChange={(e) => setData('shipping_address', {
                                                ...data.shipping_address,
                                                name: e.target.value
                                            })}
                                            error={errors['shipping_address.name']}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number *
                                        </label>
                                        <Input
                                            type="tel"
                                            value={data.shipping_address.phone}
                                            onChange={(e) => setData('shipping_address', {
                                                ...data.shipping_address,
                                                phone: e.target.value
                                            })}
                                            error={errors['shipping_address.phone']}
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address Line 1 *
                                        </label>
                                        <Input
                                            value={data.shipping_address.address_line_1}
                                            onChange={(e) => setData('shipping_address', {
                                                ...data.shipping_address,
                                                address_line_1: e.target.value
                                            })}
                                            error={errors['shipping_address.address_line_1']}
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address Line 2
                                        </label>
                                        <Input
                                            value={data.shipping_address.address_line_2}
                                            onChange={(e) => setData('shipping_address', {
                                                ...data.shipping_address,
                                                address_line_2: e.target.value
                                            })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            City *
                                        </label>
                                        <Input
                                            value={data.shipping_address.city}
                                            onChange={(e) => setData('shipping_address', {
                                                ...data.shipping_address,
                                                city: e.target.value
                                            })}
                                            error={errors['shipping_address.city']}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            District
                                        </label>
                                        <Input
                                            value={data.shipping_address.district}
                                            onChange={(e) => setData('shipping_address', {
                                                ...data.shipping_address,
                                                district: e.target.value
                                            })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Division
                                        </label>
                                        <Input
                                            value={data.shipping_address.division}
                                            onChange={(e) => setData('shipping_address', {
                                                ...data.shipping_address,
                                                division: e.target.value
                                            })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Postal Code
                                        </label>
                                        <Input
                                            value={data.shipping_address.postal_code}
                                            onChange={(e) => setData('shipping_address', {
                                                ...data.shipping_address,
                                                postal_code: e.target.value
                                            })}
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* Order Notes */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Notes</h3>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Internal Notes
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Add internal notes about this order..."
                                    />
                                    {errors.notes && (
                                        <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                                    )}
                                </div>
                            </Card>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-4">
                                <Button type="button" variant="secondary" asChild>
                                    <Link href={route('admin.orders.show', order.id)}>
                                        Cancel
                                    </Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>

                        {/* Sidebar - Order Summary */}
                        <div className="space-y-6">
                            {/* Order Summary */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Order Number:</span>
                                        <span className="font-medium">#{order.order_number}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Order Date:</span>
                                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Customer:</span>
                                        <span>{order.user ? order.user.name : 'Guest'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Payment Method:</span>
                                        <span>{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                                    </div>
                                </div>

                                <hr className="my-4" />

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span>৳{order.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shipping:</span>
                                        <span>৳{order.shipping_cost.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                                        <span>Total:</span>
                                        <span>৳{order.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </Card>

                            {/* Order Items */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                                
                                <div className="space-y-3">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-3 text-sm">
                                            <img
                                                src={item.product?.images?.[0]?.image_path || '/images/placeholder.jpg'}
                                                alt={item.product.name}
                                                className="h-10 w-10 object-cover rounded border"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{item.product.name}</p>
                                                <p className="text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">৳{item.subtotal.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Customer Info */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                                
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-gray-600">Name:</span>
                                        <span className="ml-2 font-medium">{order.user ? order.user.name : 'Guest Customer'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Email:</span>
                                        <span className="ml-2">{order.user ? order.user.email : order.guest_email}</span>
                                    </div>
                                    {order.user?.phone && (
                                        <div>
                                            <span className="text-gray-600">Phone:</span>
                                            <span className="ml-2">{order.user.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
