import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Wishlist, PageProps } from '@/types';
import { Card, Button, Badge } from '@/Components/ui';
import { HeartIcon, ShoppingCartIcon, TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

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
                <div className="container-custom">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                            Sacred Wishlist
                        </h1>
                        <p className="text-semantic-textSub">
                            {wishlistItems.length} {wishlistItems.length === 1 ? 'sacred item' : 'sacred items'} saved for your spiritual journey
                        </p>
                    </div>

                    {wishlistItems.length === 0 ? (
                        // Empty Wishlist State
                        <Card className="p-12 text-center max-w-md mx-auto devotional-border">
                            <div className="w-24 h-24 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <HeartIcon className="h-12 w-12 text-accent-600" />
                            </div>
                            <h3 className="text-xl font-serif font-semibold text-semantic-text mb-2">
                                Your wishlist is empty
                            </h3>
                            <p className="text-semantic-textSub mb-6">
                                Save sacred items you love for later and build your spiritual collection!
                            </p>
                            <Button asChild>
                                <Link href={route('products.index')}>
                                    <ShoppingBagIcon className="h-4 w-4 mr-2" />
                                    Explore Sacred Products
                                </Link>
                            </Button>
                        </Card>
                    ) : (
                        // Wishlist Items Grid
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {wishlistItems.map((item) => (
                                <Card key={item.id} className="overflow-hidden devotional-border hover:shadow-e2 transition-all duration-300 group">
                                    <div className="relative">
                                        <Link href={route('products.show', item.product_id)} className="block">
                                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                                                <img
                                                    src={item.product?.main_image || '/images/placeholder.jpg'}
                                                    alt={item.product?.name}
                                                    className="h-48 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        </Link>
                                        
                                        {/* Remove from wishlist button */}
                                        <button
                                            onClick={() => removeFromWishlist(item.id)}
                                            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-support rounded-full shadow-e1 hover:bg-danger-50 hover:text-danger-600 transition-all duration-200 group/remove"
                                            title="Remove from wishlist"
                                        >
                                            <TrashIcon className="h-4 w-4 text-semantic-textSub group-hover/remove:text-danger-600" />
                                        </button>

                                        {/* Wishlist indicator */}
                                        <div className="absolute top-3 left-3">
                                            <div className="bg-accent-500 text-white p-1.5 rounded-full shadow-e1">
                                                <HeartIcon className="h-3 w-3 fill-current" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="mb-3">
                                            <Badge variant="secondary" size="sm">
                                                {item.product?.category?.name}
                                            </Badge>
                                        </div>

                                        <Link
                                            href={route('products.show', item.product_id)}
                                            className="block hover:text-brand-600 transition-colors"
                                        >
                                            <h3 className="text-sm font-medium text-semantic-text line-clamp-2 leading-tight mb-2">
                                                {item.product?.name}
                                            </h3>
                                        </Link>
                                        
                                        <div className="mb-4">
                                            <p className="text-lg font-bold text-brand-600 font-tnum">
                                                ৳{item.product?.price}
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <Button
                                                onClick={() => moveToCart(item.id)}
                                                className="w-full"
                                                size="sm"
                                            >
                                                <ShoppingCartIcon className="h-4 w-4 mr-2" />
                                                Move to Cart
                                            </Button>
                                            
                                            <p className="text-xs text-semantic-textSub text-center">
                                                Added {new Date(item.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Continue Shopping */}
                    {wishlistItems.length > 0 && (
                        <div className="mt-12 text-center">
                            <Button variant="secondary" asChild>
                                <Link href={route('products.index')}>
                                    <ShoppingBagIcon className="h-4 w-4 mr-2" />
                                    Continue Shopping
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
