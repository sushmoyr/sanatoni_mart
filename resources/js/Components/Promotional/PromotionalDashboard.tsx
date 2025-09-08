import React from 'react';
import { Card } from '@/Components/ui/Card';
import NewsletterSignup from './NewsletterSignup';
import FlashSaleBanner from './FlashSaleBanner';
import CouponDisplay from './CouponDisplay';

interface FlashSale {
    id: number;
    title: string;
    description: string;
    discount_percentage: number;
    starts_at: string;
    ends_at: string;
    is_active: boolean;
    products_count?: number;
}

interface Coupon {
    id: number;
    code: string;
    type: 'percentage' | 'fixed_amount';
    value: number;
    description?: string;
    minimum_order_amount?: number;
    maximum_discount_amount?: number;
    valid_until?: string;
    usage_limit?: number;
    used_count?: number;
    is_active: boolean;
}

interface PromotionalDashboardProps {
    flashSale?: FlashSale;
    coupons?: Coupon[];
    showNewsletter?: boolean;
    variant?: 'homepage' | 'sidebar' | 'footer' | 'checkout';
    className?: string;
}

export default function PromotionalDashboard({ 
    flashSale,
    coupons = [],
    showNewsletter = true,
    variant = 'homepage',
    className = '' 
}: PromotionalDashboardProps) {
    const activeCoupons = coupons.filter(coupon => coupon.is_active);

    if (variant === 'homepage') {
        return (
            <div className={`space-y-8 ${className}`}>
                {/* Flash Sale Hero Section */}
                {flashSale && flashSale.is_active && (
                    <FlashSaleBanner 
                        flashSale={flashSale} 
                        variant="hero" 
                        showCountdown={true}
                    />
                )}

                {/* Newsletter Signup */}
                {showNewsletter && (
                    <div className="max-w-4xl mx-auto">
                        <NewsletterSignup 
                            size="lg"
                            variant="inline"
                            showDiscount={true}
                            discountPercent={10}
                        />
                    </div>
                )}

                {/* Available Coupons Grid */}
                {activeCoupons.length > 0 && (
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-serif font-bold semantic-text mb-4">
                                🎁 Sacred Savings Await
                            </h2>
                            <p className="text-lg semantic-textSub">
                                Divine discounts on our spiritual collection
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activeCoupons.slice(0, 6).map((coupon) => (
                                <CouponDisplay 
                                    key={coupon.id}
                                    coupon={coupon}
                                    variant="card"
                                />
                            ))}
                        </div>

                        {activeCoupons.length > 6 && (
                            <div className="text-center mt-6">
                                <a
                                    href={route('coupons.index')}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 transition-colors duration-300"
                                >
                                    View All Coupons ({activeCoupons.length})
                                </a>
                            </div>
                        )}
                    </div>
                )}

                {/* Featured Promotions Grid */}
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Special Offer Card */}
                        <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🎭</span>
                                </div>
                                <h3 className="text-lg font-semibold text-purple-800 mb-2">
                                    Sacred Collection
                                </h3>
                                <p className="text-purple-600 text-sm mb-4">
                                    Authentic spiritual items blessed with divine energy
                                </p>
                                <a
                                    href={route('products.index', { category: 'sacred' })}
                                    className="inline-flex items-center text-purple-700 hover:text-purple-800 font-medium text-sm"
                                >
                                    Explore Collection →
                                </a>
                            </div>
                        </Card>

                        {/* Bulk Order Discount */}
                        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">📦</span>
                                </div>
                                <h3 className="text-lg font-semibold text-green-800 mb-2">
                                    Bulk Order Discounts
                                </h3>
                                <p className="text-green-600 text-sm mb-4">
                                    Save more when you buy more. Perfect for temples and communities.
                                </p>
                                <a
                                    href={route('bulk-orders')}
                                    className="inline-flex items-center text-green-700 hover:text-green-800 font-medium text-sm"
                                >
                                    Learn More →
                                </a>
                            </div>
                        </Card>

                        {/* Seasonal Offers */}
                        <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🎪</span>
                                </div>
                                <h3 className="text-lg font-semibold text-orange-800 mb-2">
                                    Festival Specials
                                </h3>
                                <p className="text-orange-600 text-sm mb-4">
                                    Special offers during sacred festivals and celebrations
                                </p>
                                <a
                                    href={route('festivals')}
                                    className="inline-flex items-center text-orange-700 hover:text-orange-800 font-medium text-sm"
                                >
                                    View Offers →
                                </a>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'sidebar') {
        return (
            <div className={`space-y-6 ${className}`}>
                {/* Flash Sale */}
                {flashSale && flashSale.is_active && (
                    <FlashSaleBanner 
                        flashSale={flashSale} 
                        variant="sidebar" 
                        showCountdown={true}
                    />
                )}

                {/* Top Coupon */}
                {activeCoupons.length > 0 && (
                    <CouponDisplay 
                        coupon={activeCoupons[0]}
                        variant="card"
                    />
                )}

                {/* Newsletter Signup */}
                {showNewsletter && (
                    <NewsletterSignup 
                        size="sm"
                        variant="sidebar"
                        showDiscount={true}
                        discountPercent={10}
                    />
                )}

                {/* Quick Links */}
                <Card className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">🎯 Quick Savings</h4>
                    <div className="space-y-2">
                        <a
                            href={route('flash-sales.index')}
                            className="block text-sm text-gray-600 hover:text-brand-600 transition-colors"
                        >
                            🔥 Flash Sales
                        </a>
                        <a
                            href={route('coupons.index')}
                            className="block text-sm text-gray-600 hover:text-brand-600 transition-colors"
                        >
                            🎫 All Coupons
                        </a>
                        <a
                            href={route('newsletter.index')}
                            className="block text-sm text-gray-600 hover:text-brand-600 transition-colors"
                        >
                            📧 Newsletter Archive
                        </a>
                    </div>
                </Card>
            </div>
        );
    }

    if (variant === 'footer') {
        return (
            <div className={`bg-orange-800 text-white p-8 ${className}`}>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Newsletter Signup */}
                    {showNewsletter && (
                        <div className="lg:col-span-2">
                            <NewsletterSignup 
                                size="md"
                                variant="footer"
                                showDiscount={true}
                                discountPercent={10}
                            />
                        </div>
                    )}

                    {/* Promotional Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-orange-200">
                            🎁 Savings & Offers
                        </h4>
                        <div className="space-y-3">
                            <a
                                href={route('flash-sales.index')}
                                className="block text-orange-100 hover:text-white transition-colors"
                            >
                                🔥 Current Flash Sales
                            </a>
                            <a
                                href={route('coupons.index')}
                                className="block text-orange-100 hover:text-white transition-colors"
                            >
                                🎫 Available Coupons
                            </a>
                            <a
                                href={route('bulk-orders')}
                                className="block text-orange-100 hover:text-white transition-colors"
                            >
                                📦 Bulk Order Discounts
                            </a>
                            <a
                                href={route('festivals')}
                                className="block text-orange-100 hover:text-white transition-colors"
                            >
                                🎪 Festival Specials
                            </a>
                        </div>

                        {activeCoupons.length > 0 && (
                            <div className="mt-6 p-3 bg-orange-700 rounded">
                                <div className="text-sm text-orange-200 mb-1">Featured Coupon:</div>
                                <div className="text-orange-100 font-mono text-sm">
                                    {activeCoupons[0].code}
                                </div>
                                <div className="text-orange-200 text-xs">
                                    {activeCoupons[0].type === 'percentage' 
                                        ? `${activeCoupons[0].value}% OFF` 
                                        : `₹${activeCoupons[0].value} OFF`
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Checkout variant
    return (
        <div className={`space-y-4 ${className}`}>
            {/* Apply Coupon */}
            <CouponDisplay 
                coupons={activeCoupons}
                variant="inline"
                showApplyForm={true}
            />

            {/* Active Flash Sale Banner */}
            {flashSale && flashSale.is_active && (
                <FlashSaleBanner 
                    flashSale={flashSale} 
                    variant="banner" 
                    showCountdown={true}
                />
            )}

            {/* Newsletter Signup */}
            {showNewsletter && (
                <Card className="p-4">
                    <NewsletterSignup 
                        size="sm"
                        variant="inline"
                        showDiscount={true}
                        discountPercent={5}
                    />
                </Card>
            )}
        </div>
    );
}
