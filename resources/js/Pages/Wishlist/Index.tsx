import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Wishlist, PageProps } from '@/types';
import { HeartIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';

interface WishlistIndexProps extends PageProps {
    wishlistItems: Wishlist[];
}

export default function WishlistIndex({ wishlistItems }: WishlistIndexProps) {
    const removeFromWishlist = (wishlistId: number) => {
        router.delete(route('wishlist.destroy', wishlistId), {
            preserveState: true
        });
    };

    const moveToCart = (wishlistId: number) => {
        router.post(route('wishlist.move-to-cart', wishlistId), {}, {
            preserveState: true
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="My Wishlist" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                        <p className="mt-2 text-gray-600">
                            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
                        </p>
                    </div>

                    {wishlistItems.length === 0 ? (
                        // Empty Wishlist State
                        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                            <HeartIcon className="mx-auto h-24 w-24 text-gray-300" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
                            <p className="mt-2 text-gray-500">Save items you love for later!</p>
                            <Link
                                href={route('products.index')}
                                className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Explore Products
                            </Link>
                        </div>
                    ) : (
                        // Wishlist Items Grid
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {wishlistItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                    <div className="relative">
                                        <Link href={route('products.show', item.product_id)} className="block">
                                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg">
                                                <img
                                                    src={item.product?.main_image || '/images/placeholder.jpg'}
                                                    alt={item.product?.name}
                                                    className="h-48 w-full object-cover object-center"
                                                />
                                            </div>
                                        </Link>
                                        
                                        {/* Remove from wishlist button */}
                                        <button
                                            onClick={() => removeFromWishlist(item.id)}
                                            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                                        >
                                            <TrashIcon className="h-4 w-4 text-red-500" />
                                        </button>
                                    </div>

                                    <div className="p-4">
                                        <Link
                                            href={route('products.show', item.product_id)}
                                            className="block hover:text-indigo-600"
                                        >
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                                {item.product?.name}
                                            </h3>
                                        </Link>
                                        
                                        <p className="mt-1 text-sm text-gray-500">
                                            {item.product?.category?.name}
                                        </p>
                                        
                                        <div className="mt-2 flex items-center justify-between">
                                            <p className="text-lg font-medium text-gray-900">
                                                ৳{item.product?.price}
                                            </p>
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            <button
                                                onClick={() => moveToCart(item.id)}
                                                className="w-full bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium flex items-center justify-center space-x-2"
                                            >
                                                <ShoppingCartIcon className="h-4 w-4" />
                                                <span>Move to Cart</span>
                                            </button>
                                            
                                            <p className="text-xs text-gray-500 text-center">
                                                Added {new Date(item.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
