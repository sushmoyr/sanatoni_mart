import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import BrandedStoreLayout from '@/Layouts/BrandedStoreLayout';
import { ShoppingCart, PageProps } from '@/types';
import { Button, Card, Badge } from '@/Components/ui';
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface CartIndexProps extends PageProps {
    cartItems: ShoppingCart[];
    cartSummary: {
        itemCount: number;
        uniqueItems: number;
        subtotal: number;
        total: number;
    };
}

export default function CartIndex({ auth, cartItems, cartSummary }: CartIndexProps) {
    const updateQuantity = (cartId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeItem(cartId);
            return;
        }

        router.put(route('cart.update', cartId), {
            quantity: newQuantity
        }, {
            preserveState: true
        });
    };

    const removeItem = (cartId: number) => {
        router.delete(route('cart.destroy', cartId), {
            preserveState: true
        });
    };

    const clearCart = () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            router.delete(route('cart.clear'), {
                preserveState: true
            });
        }
    };

    return (
        <BrandedStoreLayout title="Shopping Cart" description="Review your selected items and proceed to checkout">
            <div className="py-8">
                <div className="container-custom">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-serif font-bold text-semantic-text mb-2">Shopping Cart</h1>
                        <p className="text-semantic-textSub">
                            {cartSummary.itemCount} {cartSummary.itemCount === 1 ? 'item' : 'items'} in your sacred collection
                        </p>
                    </div>

                    {cartItems.length === 0 ? (
                        // Empty Cart State
                        <Card className="p-12 text-center max-w-md mx-auto">
                            <div className="mx-auto h-24 w-24 text-semantic-textSub mb-6">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M17 17h.01M9 17h.01" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-serif font-semibold text-semantic-text mb-2">Your cart is empty</h3>
                            <p className="text-semantic-textSub mb-6">Start adding some sacred items to your collection!</p>
                            <Button asChild>
                                <Link href={route('products.index')}>
                                    <ShoppingBagIcon className="h-4 w-4 mr-2" />
                                    Continue Shopping
                                </Link>
                            </Button>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-serif font-semibold text-semantic-text">Sacred Items</h2>
                                    <Button
                                        variant="ghost"
                                        onClick={clearCart}
                                        className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                                    >
                                        Clear Cart
                                    </Button>
                                </div>

                                <Card className="divide-y divide-semantic-border">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="p-6">
                                            <div className="flex items-start space-x-4">
                                                {/* Product Image */}
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={item.product?.main_image || '/images/placeholder.jpg'}
                                                        alt={item.product?.name}
                                                        className="h-24 w-24 object-cover rounded-lg shadow-e1"
                                                    />
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-lg font-medium text-semantic-text mb-1">
                                                        <Link
                                                            href={route('products.show', item.product_id)}
                                                            className="hover:text-brand-600 transition-colors"
                                                        >
                                                            {item.product?.name}
                                                        </Link>
                                                    </h4>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="secondary" size="sm">
                                                            {item.product?.category?.name}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xl font-bold text-brand-600 font-tnum">
                                                        ৳{item.product?.price}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-end space-y-4">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center space-x-3 bg-neutral-50 rounded-lg p-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-1 rounded-md hover:bg-white shadow-e1 transition-colors"
                                                        >
                                                            <MinusIcon className="h-4 w-4 text-semantic-textSub" />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-medium font-tnum">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-1 rounded-md hover:bg-white shadow-e1 transition-colors"
                                                        >
                                                            <PlusIcon className="h-4 w-4 text-semantic-textSub" />
                                                        </button>
                                                    </div>

                                                    {/* Item Total */}
                                                    <div className="text-right">
                                                        <p className="text-xs text-semantic-textSub mb-1">Item Total</p>
                                                        <p className="text-lg font-bold text-semantic-text font-tnum">
                                                            ৳{(item.quantity * (item.product?.price || 0)).toFixed(2)}
                                                        </p>
                                                    </div>

                                                    {/* Remove Button */}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-danger-600 hover:text-danger-700 hover:bg-danger-50 p-2"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Card>
                            </div>

                            {/* Cart Summary */}
                            <div>
                                <Card className="p-6 sticky top-6">
                                    <h2 className="text-xl font-serif font-semibold text-semantic-text mb-6">Order Summary</h2>
                                    
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-semantic-textSub">Items ({cartSummary.itemCount})</span>
                                            <span className="text-semantic-text font-medium font-tnum">৳{cartSummary.subtotal.toFixed(2)}</span>
                                        </div>
                                        
                                        <div className="flex justify-between text-sm">
                                            <span className="text-semantic-textSub">Delivery</span>
                                            <span className="text-success-600 font-medium">Free</span>
                                        </div>
                                        
                                        <div className="border-t border-semantic-border pt-4">
                                            <div className="flex justify-between text-lg font-bold">
                                                <span className="text-semantic-text">Total</span>
                                                <span className="text-brand-600 font-tnum">৳{cartSummary.total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 space-y-3">
                                        <Button className="w-full" size="lg">
                                            Proceed to Checkout
                                        </Button>
                                        
                                        <Button variant="tertiary" className="w-full" asChild>
                                            <Link href={route('products.index')}>
                                                Continue Shopping
                                            </Link>
                                        </Button>
                                    </div>

                                    {/* Security Notice */}
                                    <div className="mt-6 pt-6 border-t border-semantic-border">
                                        <div className="flex items-center text-sm text-semantic-textSub">
                                            <ShieldCheckIcon className="h-4 w-4 mr-2 text-success-500" />
                                            Secure checkout with Cash on Delivery
                                        </div>
                                        <div className="mt-2 text-xs text-semantic-textSub">
                                            Free delivery on orders above ৳1000
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BrandedStoreLayout>
    );
}
