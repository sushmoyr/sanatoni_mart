import React from 'react';
import { Head, Link } from '@inertiajs/react';
import BrandedStoreLayout from '@/Layouts/BrandedStoreLayout';
import { PageProps } from '@/types';
import FlashSaleBanner from '@/Components/Promotional/FlashSaleBanner';

interface FlashSale {
    id: number;
    name: string;
    title: string;
    description: string;
    discount_percentage: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
    is_featured: boolean;
    products_count?: number;
    products?: Product[];
}

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    original_price?: number;
    flash_sale_price?: number;
    discount_amount?: number;
    discount_percentage?: number;
    images: Array<{ image_path: string }>;
    category: {
        id: number;
        name: string;
    };
}

interface Props extends PageProps {
    flashSales: FlashSale[];
    featuredFlashSale?: FlashSale;
}

export default function Index({ flashSales, featuredFlashSale }: Props) {
    return (
        <BrandedStoreLayout>
            <Head title="Flash Sales - Sacred Items on Sale" />

            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
                {/* Hero Section with Featured Flash Sale */}
                {featuredFlashSale && (
                    <section className="py-8 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-7xl mx-auto">
                            <FlashSaleBanner
                                flashSale={{
                                    id: featuredFlashSale.id,
                                    title: featuredFlashSale.title,
                                    description: featuredFlashSale.description,
                                    discount_percentage: featuredFlashSale.discount_percentage,
                                    starts_at: featuredFlashSale.start_date,
                                    ends_at: featuredFlashSale.end_date,
                                    is_active: featuredFlashSale.is_active,
                                    products_count: featuredFlashSale.products_count
                                }}
                                variant="hero"
                                showCountdown={true}
                                className="mb-8"
                            />
                        </div>
                    </section>
                )}

                {/* Page Header */}
                <section className="py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            🔥 Flash Sales
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Limited time offers on sacred items. Get authentic religious products at amazing discounts before time runs out!
                        </p>
                    </div>
                </section>

                {/* Active Flash Sales Grid */}
                <section className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        {flashSales.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {flashSales.map((flashSale) => (
                                    <FlashSaleCard key={flashSale.id} flashSale={flashSale} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">⏰</div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                    No Active Flash Sales
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Stay tuned! Amazing deals on sacred items are coming soon.
                                </p>
                                <Link
                                    href={route('products.index')}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 transition-colors"
                                >
                                    Browse All Products
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </BrandedStoreLayout>
    );
}

function FlashSaleCard({ flashSale }: { flashSale: FlashSale }) {
    const timeRemaining = React.useMemo(() => {
        const now = new Date();
        const endDate = new Date(flashSale.end_date);
        const diff = endDate.getTime() - now.getTime();

        if (diff <= 0) return null;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return { days, hours, minutes };
    }, [flashSale.end_date]);

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
                        🔥 FLASH SALE
                    </span>
                    <span className="text-3xl font-bold">
                        {flashSale.discount_percentage}% OFF
                    </span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{flashSale.title}</h3>
                <p className="text-orange-100">{flashSale.description}</p>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Products Count */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">
                        🏷️ {flashSale.products_count || 0} Items on Sale
                    </span>
                    {flashSale.is_featured && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            ⭐ Featured
                        </span>
                    )}
                </div>

                {/* Countdown Timer */}
                {timeRemaining && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="text-sm text-gray-600 mb-2 text-center">⏰ Sale Ends In:</div>
                        <div className="flex justify-center space-x-2">
                            <div className="text-center">
                                <div className="bg-red-500 text-white rounded-lg px-3 py-2 font-bold">
                                    {timeRemaining.days}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Days</div>
                            </div>
                            <div className="text-center">
                                <div className="bg-red-500 text-white rounded-lg px-3 py-2 font-bold">
                                    {timeRemaining.hours}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Hours</div>
                            </div>
                            <div className="text-center">
                                <div className="bg-red-500 text-white rounded-lg px-3 py-2 font-bold">
                                    {timeRemaining.minutes}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Min</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <Link
                    href={route('flash-sales.show', flashSale.id)}
                    className="block w-full bg-red-500 hover:bg-red-600 text-white text-center py-3 rounded-lg font-semibold transition-colors duration-300"
                >
                    Shop Flash Sale →
                </Link>
            </div>
        </div>
    );
}