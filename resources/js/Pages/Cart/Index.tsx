import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';
import { ShoppingCart, PageProps } from '@/types';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

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
        <StoreLayout title="Shopping Cart" description="Review your selected items and proceed to checkout">
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                        <p className="mt-2 text-gray-600">
                            {cartSummary.itemCount} {cartSummary.itemCount === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>

                    {cartItems.length === 0 ? (
                        // Empty Cart State
                        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                            <div className="mx-auto h-24 w-24 text-gray-300">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M17 17h.01M9 17h.01" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
                            <p className="mt-2 text-gray-500">Start adding some products to your cart!</p>
                            <Link
                                href={route('products.index')}
                                className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-medium text-gray-900">Cart Items</h2>
                                    <button
                                        onClick={clearCart}
                                        className="text-sm text-red-600 hover:text-red-800"
                                    >
                                        Clear Cart
                                    </button>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm border divide-y">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="p-6">
                                            <div className="flex items-center space-x-4">
                                                {/* Product Image */}
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={item.product?.main_image || '/images/placeholder.jpg'}
                                                        alt={item.product?.name}
                                                        className="h-20 w-20 object-cover rounded-md"
                                                    />
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-gray-900">
                                                        <Link
                                                            href={route('products.show', item.product_id)}
                                                            className="hover:text-indigo-600"
                                                        >
                                                            {item.product?.name}
                                                        </Link>
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {item.product?.category?.name}
                                                    </p>
                                                    <p className="text-lg font-medium text-gray-900 mt-1">
                                                        ৳{item.product?.price}
                                                    </p>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                                                    >
                                                        <MinusIcon className="h-4 w-4" />
                                                    </button>
                                                    <span className="w-12 text-center text-sm font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                                                    >
                                                        <PlusIcon className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                {/* Item Total */}
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500">Total</p>
                                                    <p className="text-lg font-medium text-gray-900">
                                                        ৳{(item.quantity * (item.product?.price || 0)).toFixed(2)}
                                                    </p>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-2 text-red-600 hover:text-red-800"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cart Summary */}
                            <div>
                                <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                                    
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Items ({cartSummary.itemCount})</span>
                                            <span className="text-gray-900">৳{cartSummary.subtotal.toFixed(2)}</span>
                                        </div>
                                        
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="text-gray-900">Calculated at checkout</span>
                                        </div>
                                        
                                        <div className="border-t pt-3">
                                            <div className="flex justify-between text-base font-medium">
                                                <span className="text-gray-900">Total</span>
                                                <span className="text-gray-900">৳{cartSummary.total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-3">
                                        <button className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium">
                                            Proceed to Checkout
                                        </button>
                                        
                                        <Link
                                            href={route('products.index')}
                                            className="w-full block text-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                        >
                                            Continue Shopping
                                        </Link>
                                    </div>

                                    {/* Security Notice */}
                                    <div className="mt-6 pt-6 border-t">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Secure checkout with Cash on Delivery
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </StoreLayout>
    );
}
