import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Card } from '@/Components/ui';
import { 
    ClockIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

interface RecentlyViewedProduct {
    id: number;
    name: string;
    price: number;
    image?: string;
    category?: string;
    url: string;
    viewed_at: string;
}

interface RecentlyViewedProductsProps {
    className?: string;
    limit?: number;
    showTitle?: boolean;
    horizontal?: boolean;
}

export default function RecentlyViewedProducts({ 
    className = "",
    limit = 8,
    showTitle = true,
    horizontal = true
}: RecentlyViewedProductsProps) {
    const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        fetchRecentlyViewed();
    }, []);

    const fetchRecentlyViewed = async () => {
        try {
            const response = await fetch('/api/products/recently-viewed');
            const data = await response.json();
            setProducts(data.slice(0, limit));
        } catch (error) {
            console.error('Error fetching recently viewed products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const scroll = (direction: 'left' | 'right') => {
        const container = document.getElementById('recently-viewed-container');
        if (container) {
            const scrollAmount = 300;
            const newPosition = direction === 'left' 
                ? scrollPosition - scrollAmount 
                : scrollPosition + scrollAmount;
            
            container.scrollTo({
                left: newPosition,
                behavior: 'smooth'
            });
            setScrollPosition(newPosition);
        }
    };

    if (isLoading) {
        return (
            <div className={`${className} p-6`}>
                <div className="animate-pulse">
                    {showTitle && (
                        <div className="h-6 bg-semantic-surface rounded mb-4 w-48"></div>
                    )}
                    <div className={`grid gap-4 ${horizontal ? 'grid-cols-4' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="bg-semantic-surface rounded-lg h-64"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <div className={className}>
            {showTitle && (
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <ClockIcon className="w-5 h-5 text-brand-600" />
                        <h2 className="text-lg font-semibold text-semantic-text">
                            Recently Viewed Products
                        </h2>
                    </div>
                    
                    {horizontal && products.length > 4 && (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => scroll('left')}
                                className="p-2 rounded-full bg-semantic-surface hover:bg-semantic-border transition-colors"
                                aria-label="Scroll left"
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="p-2 rounded-full bg-semantic-surface hover:bg-semantic-border transition-colors"
                                aria-label="Scroll right"
                            >
                                <ChevronRightIcon className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div 
                id="recently-viewed-container"
                className={`${
                    horizontal 
                        ? 'flex space-x-4 overflow-x-auto pb-2' 
                        : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                }`}
                style={{ 
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
            >
                {products.map((product) => (
                    <Link
                        key={product.id}
                        href={product.url}
                        className={`group ${horizontal ? 'flex-shrink-0 w-64' : ''}`}
                    >
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative">
                                {product.image ? (
                                    <img
                                        src={`/storage/${product.image}`}
                                        alt={product.name}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-semantic-surface flex items-center justify-center">
                                        <span className="text-semantic-textSub">No Image</span>
                                    </div>
                                )}
                                
                                {/* Viewed Time Badge */}
                                <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                    {product.viewed_at}
                                </div>
                            </div>
                            
                            <div className="p-4">
                                <h3 className="font-medium text-semantic-text group-hover:text-brand-600 transition-colors mb-2" style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {product.name}
                                </h3>
                                
                                {product.category && (
                                    <p className="text-xs text-semantic-textSub mb-2">
                                        {product.category}
                                    </p>
                                )}
                                
                                <p className="text-lg font-bold text-brand-600">
                                    {formatPrice(product.price)}
                                </p>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* View All Link */}
            {products.length >= limit && (
                <div className="mt-6 text-center">
                    <Link
                        href="/search/products"
                        className="inline-flex items-center px-4 py-2 border border-brand-600 text-brand-600 rounded-lg hover:bg-brand-600 hover:text-white transition-colors"
                    >
                        <ClockIcon className="w-4 h-4 mr-2" />
                        View Search History
                    </Link>
                </div>
            )}
        </div>
    );
}
