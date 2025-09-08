import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

interface Coupon {
    id: number;
    code: string;
    name: string;
    description: string | null;
    type: 'percentage' | 'fixed';
    value: number;
    minimum_order_amount: number | null;
    product_ids: number[] | null;
    category_ids: number[] | null;
    usage_limit: number | null;
    used_count: number;
    per_customer_limit: number | null;
    valid_from: string;
    valid_until: string | null;
    status: 'active' | 'inactive' | 'expired';
    created_at: string;
    updated_at: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Order {
    id: number;
    order_number: string;
    total: number;
}

interface CouponUsage {
    id: number;
    discount_amount: number;
    created_at: string;
    user: User | null;
    order: Order;
}

interface Analytics {
    usage_percentage: number | null;
    total_discount_given: number;
    average_discount: number;
    unique_customers: number;
    is_valid: boolean;
}

interface Props extends PageProps {
    coupon: Coupon;
    analytics: Analytics;
    recentUsage: CouponUsage[];
}

export default function Show({ coupon, analytics, recentUsage }: Props) {
    const formatCurrency = (amount: number) => `৳${amount.toFixed(2)}`;
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-gray-100 text-gray-800',
            expired: 'bg-red-100 text-red-800'
        };
        return badges[status as keyof typeof badges] || badges.inactive;
    };

    const toggleStatus = () => {
        router.post(route('admin.coupons.toggle-status', coupon.id));
    };

    const deleteCoupon = () => {
        if (confirm('Are you sure you want to delete this coupon? This action cannot be undone.')) {
            router.delete(route('admin.coupons.destroy', coupon.id));
        }
    };

    return (
        <AdminLayout>
            <Head title={`Coupon - ${coupon.name}`} />

            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold leading-6 text-gray-900">Coupon Details</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            View and manage coupon information and usage statistics
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
                        <Link href={route('admin.coupons.edit', coupon.id)}>
                            <PrimaryButton>Edit Coupon</PrimaryButton>
                        </Link>
                        <SecondaryButton onClick={toggleStatus}>
                            {coupon.status === 'active' ? 'Deactivate' : 'Activate'}
                        </SecondaryButton>
                        {coupon.used_count === 0 && (
                            <DangerButton onClick={deleteCoupon}>
                                Delete
                            </DangerButton>
                        )}
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Coupon Info */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Coupon Information
                                </h3>
                            </div>
                            <div className="px-6 py-4 space-y-6">
                                {/* Coupon Display */}
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                                    <div className="text-center">
                                        <div className="text-2xl font-mono font-bold">
                                            {coupon.code}
                                        </div>
                                        <div className="text-lg mt-2">
                                            {coupon.type === 'percentage' 
                                                ? `${coupon.value}% off`
                                                : `${formatCurrency(coupon.value)} off`
                                            }
                                        </div>
                                        <div className="text-sm mt-1 opacity-90">
                                            {coupon.name}
                                        </div>
                                        {coupon.minimum_order_amount && (
                                            <div className="text-sm mt-1 opacity-75">
                                                Minimum order: {formatCurrency(coupon.minimum_order_amount)}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Basic Details */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{coupon.name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Code</dt>
                                        <dd className="mt-1 text-sm text-gray-900 font-mono">{coupon.code}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Type</dt>
                                        <dd className="mt-1 text-sm text-gray-900 capitalize">{coupon.type}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Value</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {coupon.type === 'percentage' 
                                                ? `${coupon.value}%`
                                                : formatCurrency(coupon.value)
                                            }
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                                        <dd className="mt-1">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(coupon.status)}`}>
                                                {coupon.status}
                                            </span>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Validity</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {analytics.is_valid ? (
                                                <span className="text-green-600">Valid</span>
                                            ) : (
                                                <span className="text-red-600">Invalid/Expired</span>
                                            )}
                                        </dd>
                                    </div>
                                </div>

                                {/* Description */}
                                {coupon.description && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Description</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{coupon.description}</dd>
                                    </div>
                                )}

                                {/* Applicability */}
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Applies To</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {!coupon.product_ids?.length && !coupon.category_ids?.length && (
                                            <span className="text-green-600">All Products</span>
                                        )}
                                        {coupon.product_ids?.length && (
                                            <span className="text-blue-600">
                                                {coupon.product_ids.length} Specific Product(s)
                                            </span>
                                        )}
                                        {coupon.category_ids?.length && (
                                            <span className="text-purple-600">
                                                {coupon.category_ids.length} Specific Category(ies)
                                            </span>
                                        )}
                                    </dd>
                                </div>

                                {/* Date Information */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Valid From</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{formatDate(coupon.valid_from)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Valid Until</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {coupon.valid_until ? formatDate(coupon.valid_until) : 'No expiry'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Created</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{formatDate(coupon.created_at)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{formatDate(coupon.updated_at)}</dd>
                                    </div>
                                </div>

                                {/* Limits */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Usage Limit</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {coupon.usage_limit || 'Unlimited'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Per Customer Limit</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {coupon.per_customer_limit || 'Unlimited'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Minimum Order</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {coupon.minimum_order_amount ? formatCurrency(coupon.minimum_order_amount) : 'None'}
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Sidebar */}
                    <div className="space-y-6">
                        {/* Usage Statistics */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Usage Analytics
                                </h3>
                            </div>
                            <div className="px-6 py-4 space-y-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">
                                        {coupon.used_count}
                                    </div>
                                    <div className="text-sm text-gray-500">Times Used</div>
                                    {analytics.usage_percentage !== null && (
                                        <div className="mt-2">
                                            <div className="bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${Math.min(analytics.usage_percentage, 100)}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {analytics.usage_percentage.toFixed(1)}% of limit used
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            {formatCurrency(analytics.total_discount_given)}
                                        </div>
                                        <div className="text-sm text-gray-500">Total Discount Given</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {formatCurrency(analytics.average_discount)}
                                        </div>
                                        <div className="text-sm text-gray-500">Average Discount</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-600">
                                            {analytics.unique_customers}
                                        </div>
                                        <div className="text-sm text-gray-500">Unique Customers</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Usage */}
                {recentUsage.length > 0 && (
                    <div className="mt-8 bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Recent Usage
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
                                            Discount Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date Used
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentUsage.map((usage) => (
                                        <tr key={usage.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <Link 
                                                    href={route('admin.orders.show', usage.order.id)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    #{usage.order.order_number}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {usage.user ? (
                                                    <div>
                                                        <div className="font-medium">{usage.user.name}</div>
                                                        <div className="text-gray-500">{usage.user.email}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">Guest</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <span className="font-medium text-green-600">
                                                    -{formatCurrency(usage.discount_amount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatCurrency(usage.order.total)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(usage.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
