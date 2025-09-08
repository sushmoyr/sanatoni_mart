import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Card, Badge, Input } from '@/Components/ui';
import { PageProps } from '@/types';
import {
    ArrowLeftIcon,
    PencilIcon,
    DocumentArrowDownIcon,
    UserIcon,
    MapPinIcon,
    CreditCardIcon,
    ClockIcon,
    TruckIcon,
    CheckCircleIcon,
    XCircleIcon,
    ShoppingCartIcon,
    CalendarIcon,
    ChatBubbleLeftIcon
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
    product_snapshot: {
        name: string;
        description?: string;
        price: number;
        image?: string;
        sku: string;
    };
}

interface StatusHistory {
    id: number;
    from_status: string | null;
    to_status: string;
    comment: string;
    created_at: string;
    changed_by: {
        id: number;
        name: string;
    } | null;
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
    shipping_address: any;
    billing_address: any;
    notes?: string;
    created_at: string;
    updated_at: string;
    delivered_at?: string;
    estimated_delivery_date?: string;
    items: OrderItem[];
    status_history: StatusHistory[];
    invoice?: any;
}

interface AdminOrderShowProps extends PageProps {
    order: Order;
}

export default function AdminOrderShow({ auth, order }: AdminOrderShowProps) {
    const [statusComment, setStatusComment] = useState('');
    const [showStatusUpdate, setShowStatusUpdate] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(order.status);

    const statusOptions = {
        'pending': 'Pending',
        'processing': 'Processing',
        'shipped': 'Shipped',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled',
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

    const updateStatus = () => {
        router.post(route('admin.orders.update-status', order.id), {
            status: selectedStatus,
            comment: statusComment
        }, {
            preserveState: true,
            onSuccess: () => {
                setShowStatusUpdate(false);
                setStatusComment('');
            }
        });
    };

    const generateInvoice = () => {
        // This will be implemented with PDF generation
        window.open(route('admin.orders.invoice', order.id), '_blank');
    };

    return (
        <AdminLayout>
            <Head title={`Order #${order.order_number}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="secondary" size="sm">
                            <Link href={route('admin.orders.index')}>
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                Back to Orders
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Order #{order.order_number}</h1>
                            <p className="text-gray-600">Order placed on {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button onClick={generateInvoice} variant="secondary">
                            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                            Download Invoice
                        </Button>
                        <Button asChild>
                            <Link href={route('admin.orders.edit', order.id)}>
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Edit Order
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
                                <Button 
                                    onClick={() => setShowStatusUpdate(!showStatusUpdate)}
                                    variant="secondary"
                                    size="sm"
                                >
                                    Update Status
                                </Button>
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <Badge variant={getStatusBadgeVariant(order.status)} className="flex items-center gap-2">
                                    {getStatusIcon(order.status)}
                                    {statusOptions[order.status as keyof typeof statusOptions]}
                                </Badge>
                                <span className="text-sm text-gray-600">
                                    Last updated: {new Date(order.updated_at).toLocaleString()}
                                </span>
                            </div>

                            {showStatusUpdate && (
                                <div className="border-t pt-4 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                New Status
                                            </label>
                                            <select
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                {Object.entries(statusOptions).map(([value, label]) => (
                                                    <option key={value} value={value}>{label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Comment (optional)
                                            </label>
                                            <Input
                                                value={statusComment}
                                                onChange={(e) => setStatusComment(e.target.value)}
                                                placeholder="Add a comment about this status change"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button onClick={updateStatus}>Update Status</Button>
                                        <Button 
                                            variant="secondary" 
                                            onClick={() => setShowStatusUpdate(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Order Items */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-4 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                                        <img
                                            src={item.product_snapshot.image || item.product?.images?.[0]?.image_path || '/images/placeholder.jpg'}
                                            alt={item.product_snapshot.name}
                                            className="h-16 w-16 object-cover rounded-lg border"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{item.product_snapshot.name}</h4>
                                            <p className="text-sm text-gray-500">SKU: {item.product_snapshot.sku}</p>
                                            <p className="text-sm text-gray-500">
                                                ৳{item.price.toFixed(2)} × {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">৳{item.subtotal.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Total */}
                            <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">৳{order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-gray-900">৳{order.shipping_cost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-gray-900">৳{order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Status History */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
                            <div className="space-y-4">
                                {order.status_history.map((history) => (
                                    <div key={history.id} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                {getStatusIcon(history.to_status)}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <p className="text-sm font-medium text-gray-900">
                                                    Status changed to {statusOptions[history.to_status as keyof typeof statusOptions]}
                                                </p>
                                                <Badge variant={getStatusBadgeVariant(history.to_status)} size="sm">
                                                    {statusOptions[history.to_status as keyof typeof statusOptions]}
                                                </Badge>
                                            </div>
                                            {history.comment && (
                                                <p className="text-sm text-gray-600 mt-1">{history.comment}</p>
                                            )}
                                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                <span className="flex items-center">
                                                    <CalendarIcon className="h-3 w-3 mr-1" />
                                                    {new Date(history.created_at).toLocaleString()}
                                                </span>
                                                {history.changed_by && (
                                                    <span className="flex items-center">
                                                        <UserIcon className="h-3 w-3 mr-1" />
                                                        {history.changed_by.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Customer Information */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <UserIcon className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {order.user ? order.user.name : 'Guest Customer'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {order.user ? order.user.email : order.guest_email}
                                        </p>
                                    </div>
                                </div>
                                {order.user?.phone && (
                                    <div className="flex items-center space-x-2">
                                        <div className="h-4 w-4" />
                                        <p className="text-sm text-gray-600">{order.user.phone}</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Shipping Address */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                            <div className="flex items-start space-x-2">
                                <MapPinIcon className="h-4 w-4 text-gray-400 mt-1" />
                                <div className="text-sm text-gray-600">
                                    <p className="font-medium text-gray-900">{order.shipping_address.name}</p>
                                    <p>{order.shipping_address.phone}</p>
                                    <p>{order.shipping_address.address_line_1}</p>
                                    {order.shipping_address.address_line_2 && (
                                        <p>{order.shipping_address.address_line_2}</p>
                                    )}
                                    <p>
                                        {order.shipping_address.city}
                                        {order.shipping_address.district && `, ${order.shipping_address.district}`}
                                        {order.shipping_address.division && `, ${order.shipping_address.division}`}
                                    </p>
                                    {order.shipping_address.postal_code && (
                                        <p>{order.shipping_address.postal_code}</p>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Payment Information */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                            <div className="flex items-center space-x-2">
                                <CreditCardIcon className="h-4 w-4 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                                    </p>
                                    <p className="text-sm text-gray-600">৳{order.total.toFixed(2)}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Order Notes */}
                        {order.notes && (
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Notes</h3>
                                <div className="flex items-start space-x-2">
                                    <ChatBubbleLeftIcon className="h-4 w-4 text-gray-400 mt-1" />
                                    <p className="text-sm text-gray-600">{order.notes}</p>
                                </div>
                            </Card>
                        )}

                        {/* Delivery Information */}
                        {(order.estimated_delivery_date || order.delivered_at) && (
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
                                <div className="space-y-3">
                                    {order.estimated_delivery_date && (
                                        <div className="flex items-center space-x-2">
                                            <ClockIcon className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Estimated Delivery</p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(order.estimated_delivery_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {order.delivered_at && (
                                        <div className="flex items-center space-x-2">
                                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Delivered On</p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(order.delivered_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
