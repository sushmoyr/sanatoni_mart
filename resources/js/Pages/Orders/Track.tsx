import React from 'react';
import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import SecondaryButton from '@/Components/SecondaryButton';

interface OrderItem {
    id: number;
    product: {
        id: number;
        name: string;
        images: Array<{ image_path: string }>;
    } | null;
    quantity: number;
    price: number;
    subtotal: number;
    formatted_price: string;
    formatted_subtotal: string;
    product_name: string;
    product_image: string | null;
}

interface StatusHistory {
    id: number;
    from_status: string | null;
    to_status: string;
    comment: string | null;
    created_at: string;
    changed_by_name: string;
    formatted_change: string;
    status_badge_class: string;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    subtotal: number;
    shipping_cost: number;
    total: number;
    created_at: string;
    estimated_delivery_date: string | null;
    delivered_at: string | null;
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
    items: OrderItem[];
    status_history: StatusHistory[];
    customer_name: string;
    customer_email: string;
    formatted_total: string;
    status_badge_class: string;
}

interface Props {
    order: Order;
}

export default function Track({ order }: Props) {
    const formatAddress = (address: typeof order.shipping_address) => {
        const parts = [
            address.address_line_1,
            address.address_line_2,
            address.city,
            address.district,
            address.division,
            address.postal_code,
        ].filter(Boolean);
        return parts.join(', ');
    };

    const getProgressPercentage = () => {
        const statusProgress = {
            'pending': 25,
            'processing': 50,
            'shipped': 75,
            'delivered': 100,
            'cancelled': 0,
        };
        return statusProgress[order.status as keyof typeof statusProgress] || 0;
    };

    return (
        <GuestLayout>
            <Head title={`Track Order #${order.order_number}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${order.status_badge_class}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </div>

                {/* Progress Bar */}
                {order.status !== 'cancelled' && (
                    <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>Order Progress</span>
                            <span>{getProgressPercentage()}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getProgressPercentage()}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Pending</span>
                            <span>Processing</span>
                            <span>Shipped</span>
                            <span>Delivered</span>
                        </div>
                    </div>
                )}

                {/* Order Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer & Shipping */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                            <div className="text-sm text-gray-700">
                                <p className="font-medium">{order.shipping_address.name}</p>
                                <p>{order.shipping_address.phone}</p>
                                <p className="mt-1">{formatAddress(order.shipping_address)}</p>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
                            <div className="text-sm space-y-1">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>৳{order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping:</span>
                                    <span>৳{order.shipping_cost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-medium border-t pt-1">
                                    <span>Total:</span>
                                    <span>{order.formatted_total}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Information */}
                    {order.estimated_delivery_date && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-sm text-blue-800">
                                <strong>Estimated Delivery:</strong>{' '}
                                {new Date(order.estimated_delivery_date).toLocaleDateString()}
                            </p>
                        </div>
                    )}

                    {order.delivered_at && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                            <p className="text-sm text-green-800">
                                <strong>Delivered on:</strong>{' '}
                                {new Date(order.delivered_at).toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Items Ordered</h3>
                    <div className="space-y-3">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 bg-white p-3 rounded">
                                <img
                                    src={item.product_image || '/images/placeholder.jpg'}
                                    alt={item.product_name}
                                    className="w-12 h-12 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                                    <p className="text-sm text-gray-600">
                                        Quantity: {item.quantity} × {item.formatted_price}
                                    </p>
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                    {item.formatted_subtotal}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status History */}
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Order History</h3>
                    <div className="space-y-3">
                        {order.status_history.map((history, index) => (
                            <div key={history.id} className="flex items-start space-x-3">
                                <div className={`w-2 h-2 rounded-full mt-2 ${
                                    index === 0 ? 'bg-indigo-600' : 'bg-gray-300'
                                }`} />
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${history.status_badge_class}`}>
                                            {history.formatted_change}
                                        </span>
                                    </div>
                                    {history.comment && (
                                        <p className="text-sm text-gray-600 mt-1">{history.comment}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(history.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                    <Link href={route('orders.track-form')}>
                        <SecondaryButton>Track Another Order</SecondaryButton>
                    </Link>
                    <Link href={route('products.index')}>
                        <SecondaryButton>Continue Shopping</SecondaryButton>
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
