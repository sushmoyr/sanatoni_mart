import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Wishlist, PageProps } from '@/types';
import { Card, Button, Badge } from '@/Components/ui';
import { 
    ShoppingBagIcon, 
    HeartIcon, 
    MapPinIcon, 
    UserIcon,
    ChartBarIcon,
    ClockIcon,
    SparklesIcon
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

export default function CustomerDashboard({ auth, stats, recentWishlist }: CustomerDashboardProps) {
    return (
        <AuthenticatedLayout>
            <Head title="My Dashboard" />

            <div className="py-12">
                <div className="container-custom">
                    {/* Welcome Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                            Welcome back{auth.user ? `, ${auth.user.name}` : ''}
                        </h1>
                        <p className="text-semantic-textSub">
                            Continue your spiritual journey with our sacred collection
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="p-6 devotional-border hover:shadow-e2 transition-all duration-300">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
                                        <ShoppingBagIcon className="h-6 w-6 text-brand-600" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-2xl font-bold text-semantic-text font-tnum">{stats.orders}</h3>
                                    <p className="text-sm text-semantic-textSub">Total Orders</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 devotional-border hover:shadow-e2 transition-all duration-300">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                                        <HeartIcon className="h-6 w-6 text-accent-600" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-2xl font-bold text-semantic-text font-tnum">{stats.wishlist_count}</h3>
                                    <p className="text-sm text-semantic-textSub">Wishlist Items</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 devotional-border hover:shadow-e2 transition-all duration-300">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                                        <ChartBarIcon className="h-6 w-6 text-success-600" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-2xl font-bold text-semantic-text font-tnum">{stats.cart_count}</h3>
                                    <p className="text-sm text-semantic-textSub">Cart Items</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 devotional-border hover:shadow-e2 transition-all duration-300">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                                        <MapPinIcon className="h-6 w-6 text-warning-600" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-2xl font-bold text-semantic-text font-tnum">{stats.addresses_count}</h3>
                                    <p className="text-sm text-semantic-textSub">Saved Addresses</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Quick Actions */}
                        <div className="lg:col-span-1">
                            <Card className="p-6 devotional-border">
                                <div className="flex items-center mb-4">
                                    <SparklesIcon className="h-5 w-5 text-brand-600 mr-2" />
                                    <h2 className="text-lg font-serif font-semibold text-semantic-text">Quick Actions</h2>
                                </div>
                                <div className="space-y-3">
                                    <Link
                                        href={route('products.index')}
                                        className="flex items-center p-3 rounded-md hover:bg-brand-50 border border-semantic-border hover:border-brand-200 transition-all duration-200 group"
                                    >
                                        <ShoppingBagIcon className="h-5 w-5 text-semantic-textSub group-hover:text-brand-600 mr-3 transition-colors" />
                                        <span className="text-sm font-medium text-semantic-text group-hover:text-brand-700">Browse Sacred Products</span>
                                    </Link>

                                    <Link
                                        href={route('wishlist.index')}
                                        className="flex items-center p-3 rounded-md hover:bg-accent-50 border border-semantic-border hover:border-accent-200 transition-all duration-200 group"
                                    >
                                        <HeartIcon className="h-5 w-5 text-semantic-textSub group-hover:text-accent-600 mr-3 transition-colors" />
                                        <span className="text-sm font-medium text-semantic-text group-hover:text-accent-700">My Wishlist</span>
                                    </Link>

                                    <Link
                                        href={route('cart.index')}
                                        className="flex items-center p-3 rounded-md hover:bg-success-50 border border-semantic-border hover:border-success-200 transition-all duration-200 group"
                                    >
                                        <ChartBarIcon className="h-5 w-5 text-semantic-textSub group-hover:text-success-600 mr-3 transition-colors" />
                                        <span className="text-sm font-medium text-semantic-text group-hover:text-success-700">Shopping Cart</span>
                                    </Link>

                                    <Link
                                        href={route('profile.edit')}
                                        className="flex items-center p-3 rounded-md hover:bg-warning-50 border border-semantic-border hover:border-warning-200 transition-all duration-200 group"
                                    >
                                        <UserIcon className="h-5 w-5 text-semantic-textSub group-hover:text-warning-600 mr-3 transition-colors" />
                                        <span className="text-sm font-medium text-semantic-text group-hover:text-warning-700">My Profile</span>
                                    </Link>
                                </div>
                            </Card>
                        </div>

                        {/* Recent Wishlist Items */}
                        <div className="lg:col-span-2">
                            <Card className="p-6 devotional-border">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                        <HeartIcon className="h-5 w-5 text-accent-600 mr-2" />
                                        <h2 className="text-lg font-serif font-semibold text-semantic-text">Recent Wishlist Items</h2>
                                    </div>
                                    {recentWishlist.length > 0 && (
                                        <Button variant="tertiary" size="sm" asChild>
                                            <Link href={route('wishlist.index')}>
                                                View All
                                            </Link>
                                        </Button>
                                    )}
                                </div>

                                {recentWishlist.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <HeartIcon className="h-8 w-8 text-accent-600" />
                                        </div>
                                        <h3 className="text-lg font-serif font-medium text-semantic-text mb-2">No wishlist items yet</h3>
                                        <p className="text-semantic-textSub mb-6 max-w-sm mx-auto">
                                            Start browsing our sacred collection to add items to your wishlist.
                                        </p>
                                        <Button asChild>
                                            <Link href={route('products.index')}>
                                                <ShoppingBagIcon className="h-4 w-4 mr-2" />
                                                Browse Sacred Products
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {recentWishlist.map((item) => (
                                            <div key={item.id} className="border border-semantic-border rounded-lg p-4 hover:shadow-e1 transition-all duration-200">
                                                <div className="flex space-x-4">
                                                    <img
                                                        src={item.product?.main_image || '/images/placeholder.jpg'}
                                                        alt={item.product?.name}
                                                        className="h-16 w-16 object-cover rounded-md shadow-e1"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <Link
                                                            href={route('products.show', item.product_id)}
                                                            className="block hover:text-brand-600 transition-colors"
                                                        >
                                                            <h4 className="text-sm font-medium text-semantic-text line-clamp-2 leading-tight">
                                                                {item.product?.name}
                                                            </h4>
                                                        </Link>
                                                        <p className="text-lg font-bold text-brand-600 mt-1 font-tnum">
                                                            ৳{item.product?.price}
                                                        </p>
                                                        <div className="flex items-center text-xs text-semantic-textSub mt-2">
                                                            <ClockIcon className="h-3 w-3 mr-1" />
                                                            {new Date(item.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
