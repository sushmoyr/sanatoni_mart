import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Wishlist, PageProps } from '@/types';
import { 
    ShoppingBagIcon, 
    HeartIcon, 
    MapPinIcon, 
    UserIcon,
    ChartBarIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

interface CustomerDashboardProps extends PageProps {
    stats: {
        orders: number;
        wishlist_count: number;
        cart_count: number;
        addresses_count: number;
    };
    recentWishlist: Wishlist[];
}

export default function CustomerDashboard({ stats, recentWishlist }: CustomerDashboardProps) {
    return (
        <AuthenticatedLayout>
            <Head title="My Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                        <p className="mt-2 text-gray-600">Welcome back! Here's an overview of your account.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">{stats.orders}</h3>
                                    <p className="text-sm text-gray-500">Total Orders</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <HeartIcon className="h-8 w-8 text-red-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">{stats.wishlist_count}</h3>
                                    <p className="text-sm text-gray-500">Wishlist Items</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <ChartBarIcon className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">{stats.cart_count}</h3>
                                    <p className="text-sm text-gray-500">Cart Items</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <MapPinIcon className="h-8 w-8 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">{stats.addresses_count}</h3>
                                    <p className="text-sm text-gray-500">Saved Addresses</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Quick Actions */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                                <div className="space-y-3">
                                    <Link
                                        href={route('products.index')}
                                        className="flex items-center p-3 rounded-md hover:bg-gray-50 border border-gray-200"
                                    >
                                        <ShoppingBagIcon className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="text-sm font-medium text-gray-900">Browse Products</span>
                                    </Link>

                                    <Link
                                        href={route('wishlist.index')}
                                        className="flex items-center p-3 rounded-md hover:bg-gray-50 border border-gray-200"
                                    >
                                        <HeartIcon className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="text-sm font-medium text-gray-900">My Wishlist</span>
                                    </Link>

                                    <Link
                                        href={route('cart.index')}
                                        className="flex items-center p-3 rounded-md hover:bg-gray-50 border border-gray-200"
                                    >
                                        <ChartBarIcon className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="text-sm font-medium text-gray-900">Shopping Cart</span>
                                    </Link>

                                    <Link
                                        href={route('addresses.index')}
                                        className="flex items-center p-3 rounded-md hover:bg-gray-50 border border-gray-200"
                                    >
                                        <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="text-sm font-medium text-gray-900">Manage Addresses</span>
                                    </Link>

                                    <Link
                                        href={route('customer.profile.show')}
                                        className="flex items-center p-3 rounded-md hover:bg-gray-50 border border-gray-200"
                                    >
                                        <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="text-sm font-medium text-gray-900">My Profile</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Recent Wishlist Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-medium text-gray-900">Recent Wishlist Items</h2>
                                    {recentWishlist.length > 0 && (
                                        <Link
                                            href={route('wishlist.index')}
                                            className="text-sm text-indigo-600 hover:text-indigo-800"
                                        >
                                            View All
                                        </Link>
                                    )}
                                </div>

                                {recentWishlist.length === 0 ? (
                                    <div className="text-center py-8">
                                        <HeartIcon className="mx-auto h-12 w-12 text-gray-300" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No wishlist items</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Start browsing products to add items to your wishlist.
                                        </p>
                                        <Link
                                            href={route('products.index')}
                                            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                                        >
                                            Browse Products
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {recentWishlist.map((item) => (
                                            <div key={item.id} className="border rounded-lg p-4">
                                                <div className="flex space-x-4">
                                                    <img
                                                        src={item.product?.main_image || '/images/placeholder.jpg'}
                                                        alt={item.product?.name}
                                                        className="h-16 w-16 object-cover rounded-md"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <Link
                                                            href={route('products.show', item.product_id)}
                                                            className="block hover:text-indigo-600"
                                                        >
                                                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                                                                {item.product?.name}
                                                            </h4>
                                                        </Link>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            ৳{item.product?.price}
                                                        </p>
                                                        <div className="flex items-center text-xs text-gray-400 mt-1">
                                                            <ClockIcon className="h-3 w-3 mr-1" />
                                                            {new Date(item.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
