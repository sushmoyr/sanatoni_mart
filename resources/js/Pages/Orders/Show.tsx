import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import BrandedStoreLayout from '@/Layouts/BrandedStoreLayout';
import { Button, Card, Badge } from '@/Components/ui';
import { PageProps } from '@/types';
import { 
    ArrowLeftIcon, 
    TruckIcon, 
    DocumentArrowDownIcon, 
    ArrowPathIcon, 
    XMarkIcon, 
    EyeIcon,
    ClockIcon,
    CheckCircleIcon,
    CreditCardIcon 
} from '@heroicons/react/24/outline';

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

interface Invoice {
    id: number;
    invoice_number: string;
    download_url: string;
    generated_at: string;
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
    notes: string | null;
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
    invoice: Invoice | null;
    can_be_cancelled: boolean;
    is_completed: boolean;
    customer_name: string;
    customer_email: string;
    formatted_total: string;
    status_badge_class: string;
}

interface Props extends PageProps {
    order: Order;
}

export default function OrderShow({ auth, order }: Props) {
    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel this order?')) {
            router.post(route('orders.cancel', order.id));
        }
    };

    const handleReorder = () => {
        router.post(route('orders.reorder', order.id));
    };

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

    return (
        <BrandedStoreLayout>
            <Head title={`Order #${order.order_number}`} />

            <div className="sacred-bg min-h-screen py-8">
                <div className="container-custom">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={route('orders.index')}>
                                        <ArrowLeftIcon className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <h1 className="text-3xl font-serif font-bold text-semantic-text">
                                    Order #{order.order_number}
                                </h1>
                            </div>
                            <p className="text-semantic-textSub flex items-center">
                                <ClockIcon className="h-4 w-4 mr-2" />
                                Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge variant={order.status === 'completed' ? 'success' : order.status === 'cancelled' ? 'danger' : 'default'}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Order Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Items */}
                            <Card className="p-6 devotional-border">
                                <h3 className="text-xl font-serif font-semibold text-semantic-text mb-6">Sacred Items</h3>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-lg">
                                            <img
                                                src={item.product_image || '/images/placeholder.jpg'}
                                                alt={item.product_name}
                                                className="w-16 h-16 object-cover rounded-lg shadow-e1"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-semantic-text">{item.product_name}</h4>
                                                <p className="text-sm text-semantic-textSub">
                                                    Quantity: {item.quantity} × {item.formatted_price}
                                                </p>
                                                {item.product && (
                                                    <Button variant="ghost" size="sm" asChild className="mt-1 p-0 h-auto">
                                                        <Link href={route('products.show', item.product.id)}>
                                                            <EyeIcon className="h-3 w-3 mr-1" />
                                                            View Product
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-brand-600 font-tnum">{item.formatted_subtotal}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Order Status History */}
                            <Card className="p-6 devotional-border">
                                <h3 className="text-xl font-serif font-semibold text-semantic-text mb-6">Order Journey</h3>
                                <div className="space-y-4">
                                    {order.status_history.map((history, index) => (
                                        <div key={history.id} className="flex items-start space-x-4">
                                            <div className={`w-3 h-3 rounded-full mt-2 ${
                                                index === 0 ? 'bg-brand-500' : 'bg-neutral-300'
                                            }`} />
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant={index === 0 ? 'default' : 'secondary'}>
                                                        {history.formatted_change}
                                                    </Badge>
                                                    <span className="text-sm text-semantic-textSub">
                                                        by {history.changed_by_name}
                                                    </span>
                                                </div>
                                                {history.comment && (
                                                    <p className="text-sm text-semantic-text mt-2 p-3 bg-neutral-50 rounded">{history.comment}</p>
                                                )}
                                                <p className="text-xs text-semantic-textSub mt-2">
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
                            </Card>

                            {/* Order Notes */}
                            {order.notes && (
                                <Card className="p-6 devotional-border">
                                    <h3 className="text-xl font-serif font-semibold text-semantic-text mb-4">Special Instructions</h3>
                                    <p className="text-semantic-text bg-neutral-50 p-4 rounded-lg">{order.notes}</p>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Order Summary */}
                            <Card className="p-6 devotional-border">
                                <h3 className="text-xl font-serif font-semibold text-semantic-text mb-6">Order Summary</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-semantic-textSub">Subtotal</span>
                                        <span className="text-semantic-text font-medium font-tnum">৳{order.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-semantic-textSub">Shipping</span>
                                        <span className="text-semantic-text font-medium font-tnum">৳{order.shipping_cost.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-semantic-border pt-3">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span className="text-semantic-text">Total</span>
                                            <span className="text-brand-600 font-tnum">{order.formatted_total}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-brand-50 rounded-lg border border-brand-200">
                                    <div className="flex items-center">
                                        <CreditCardIcon className="h-5 w-5 text-brand-600 mr-3" />
                                        <div>
                                            <div className="font-semibold text-semantic-text">Cash on Delivery</div>
                                            <div className="text-sm text-semantic-textSub">Payment upon delivery</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Shipping Information */}
                            <Card className="p-6 devotional-border">
                                <h3 className="text-xl font-serif font-semibold text-semantic-text mb-6">Delivery Address</h3>
                                <div className="text-sm">
                                    <p className="font-semibold text-semantic-text">{order.shipping_address.name}</p>
                                    <p className="text-semantic-textSub">{order.shipping_address.phone}</p>
                                    <p className="text-semantic-text mt-3 leading-relaxed">{formatAddress(order.shipping_address)}</p>
                                </div>

                                {order.estimated_delivery_date && (
                                    <div className="mt-6 p-4 bg-info-50 border border-info-200 rounded-lg">
                                        <div className="flex items-center">
                                            <TruckIcon className="h-5 w-5 text-info-600 mr-2" />
                                            <div>
                                                <div className="font-semibold text-info-800">Estimated Delivery</div>
                                                <div className="text-sm text-info-700">
                                                    {new Date(order.estimated_delivery_date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {order.delivered_at && (
                                    <div className="mt-6 p-4 bg-success-50 border border-success-200 rounded-lg">
                                        <div className="flex items-center">
                                            <CheckCircleIcon className="h-5 w-5 text-success-600 mr-2" />
                                            <div>
                                                <div className="font-semibold text-success-800">Delivered</div>
                                                <div className="text-sm text-success-700">
                                                    {new Date(order.delivered_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>

                            {/* Invoice */}
                            {order.invoice && (
                                <Card className="p-6 devotional-border">
                                    <h3 className="text-xl font-serif font-semibold text-semantic-text mb-6">Invoice</h3>
                                    <div className="space-y-3">
                                        <div className="text-sm">
                                            <span className="text-semantic-textSub">Invoice Number:</span>
                                            <span className="ml-2 font-medium text-semantic-text">{order.invoice.invoice_number}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-semantic-textSub">Generated:</span>
                                            <span className="ml-2 text-semantic-text">
                                                {new Date(order.invoice.generated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <Button variant="secondary" className="w-full mt-4" asChild>
                                            <a href={order.invoice.download_url}>
                                                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                                                Download PDF
                                            </a>
                                        </Button>
                                    </div>
                                </Card>
                            )}

                            {/* Actions */}
                            <Card className="p-6 devotional-border">
                                <h3 className="text-xl font-serif font-semibold text-semantic-text mb-6">Order Actions</h3>
                                <div className="space-y-3">
                                    <Button variant="secondary" className="w-full" onClick={handleReorder}>
                                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                                        Reorder Items
                                    </Button>

                                    {order.can_be_cancelled && (
                                        <Button 
                                            variant="ghost" 
                                            className="w-full text-danger-600 hover:text-danger-700 hover:bg-danger-50" 
                                            onClick={handleCancel}
                                        >
                                            <XMarkIcon className="h-4 w-4 mr-2" />
                                            Cancel Order
                                        </Button>
                                    )}

                                    <Button variant="tertiary" className="w-full" asChild>
                                        <Link href={route('orders.track-form')}>
                                            <TruckIcon className="h-4 w-4 mr-2" />
                                            Track Order
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </BrandedStoreLayout>
    );
}
