import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import BrandedStoreLayout from '@/Layouts/BrandedStoreLayout';
import { PageProps } from '@/types';
import FlashSaleBanner from '@/Components/Promotional/FlashSaleBanner';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

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
}

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    original_price: number;
    flash_sale_price: number;
    discount_amount: number;
    discount_percentage: number;
    sku: string;
    description: string;
    images: Array<{ image_path: string }>;
    category: {
        id: number;
        name: string;
    };
    order_items_count?: number;
}

interface Props extends PageProps {
    flashSale: FlashSale;
    products: Product[];
}

export default function Show({ flashSale, products, auth }: Props) {
    const [sortBy, setSortBy] = useState('name');
    const [filterBy, setFilterBy] = useState('all');

    // Sort products
    const sortedProducts = React.useMemo(() => {
        let filtered = [...products];

        // Apply filters
        if (filterBy !== 'all') {
            if (filterBy === 'high-discount') {
                filtered = filtered.filter(p => p.discount_percentage >= 30);
            } else if (filterBy === 'popular') {
                filtered = filtered.filter(p => (p.order_items_count || 0) > 0);
            }
        }

        // Apply sorting
        return filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.flash_sale_price - b.flash_sale_price;
                case 'price-high':
                    return b.flash_sale_price - a.flash_sale_price;
                case 'discount':
                    return b.discount_percentage - a.discount_percentage;
                case 'popular':
                    return (b.order_items_count || 0) - (a.order_items_count || 0);
                default:
                    return a.name.localeCompare(b.name);
            }
        });
    }, [products, sortBy, filterBy]);

    return (
        <BrandedStoreLayout>
            <Head title={`${flashSale.title} - Flash Sale`} />

            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
                {/* Flash Sale Banner */}
                <section className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <FlashSaleBanner
                            flashSale={{
                                id: flashSale.id,
                                title: flashSale.title,
                                description: flashSale.description,
                                discount_percentage: flashSale.discount_percentage,
                                starts_at: flashSale.start_date,
                                ends_at: flashSale.end_date,
                                is_active: flashSale.is_active,
                                products_count: flashSale.products_count
                            }}
                            variant="banner"
                            showCountdown={true}
                        />
                    </div>
                </section>

                {/* Breadcrumb */}
                <section className="py-4 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="flex items-center space-x-4">
                                <li>
                                    <Link href={route('welcome')} className="text-gray-400 hover:text-gray-500">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <span className="text-gray-400">/</span>
                                        <Link
                                            href={route('flash-sales.index')}
                                            className="ml-4 text-gray-400 hover:text-gray-500"
                                        >
                                            Flash Sales
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <span className="text-gray-400">/</span>
                                        <span className="ml-4 text-gray-500 font-medium">{flashSale.title}</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </section>

                {/* Filters and Sorting */}
                <section className="py-6 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                                {/* Results Count */}
                                <div className="text-gray-600">
                                    Showing {sortedProducts.length} of {products.length} products
                                </div>

                                {/* Filters and Sort */}
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                    {/* Filter */}
                                    <select
                                        value={filterBy}
                                        onChange={(e) => setFilterBy(e.target.value)}
                                        className="rounded-md border-gray-300 text-sm focus:border-red-500 focus:ring-red-500"
                                    >
                                        <option value="all">All Products</option>
                                        <option value="high-discount">High Discount (30%+)</option>
                                        <option value="popular">Popular Items</option>
                                    </select>

                                    {/* Sort */}
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="rounded-md border-gray-300 text-sm focus:border-red-500 focus:ring-red-500"
                                    >
                                        <option value="name">Sort by Name</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="discount">Highest Discount</option>
                                        <option value="popular">Most Popular</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Products Grid */}
                <section className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        {sortedProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {sortedProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} auth={auth} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📦</div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                    No Products Match Your Filter
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Try adjusting your filters to see more products.
                                </p>
                                <button
                                    onClick={() => {
                                        setFilterBy('all');
                                        setSortBy('name');
                                    }}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </BrandedStoreLayout>
    );
}

function ProductCard({ product, auth }: { product: Product; auth: any }) {
    const [isInWishlist, setIsInWishlist] = useState(false);

    const addToCart = () => {
        router.post(route('cart.store'), {
            product_id: product.id,
            quantity: 1,
        });
    };

    const toggleWishlist = () => {
        if (!auth.user) {
            // Redirect to login if not authenticated
            window.location.href = route('login');
            return;
        }

        router.post(route('wishlist.toggle'), {
            product_id: product.id,
        }, {
            onSuccess: () => {
                setIsInWishlist(!isInWishlist);
            },
        });
    };

    const discountPercentage = Math.round(
        ((product.original_price - product.flash_sale_price) / product.original_price) * 100
    );

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
            {/* Image with Discount Badge */}
            <div className="relative aspect-square overflow-hidden">
                {product.images && product.images.length > 0 ? (
                    <img
                        src={product.images[0].image_path}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                )}

                {/* Discount Badge */}
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                    -{discountPercentage}%
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={toggleWishlist}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                    {isInWishlist ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                    ) : (
                        <HeartIcon className="h-5 w-5 text-gray-600" />
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Category */}
                <div className="text-sm text-gray-500 mb-1">
                    {product.category.name}
                </div>

                {/* Product Name */}
                <Link
                    href={route('products.show', product.slug)}
                    className="block font-semibold text-gray-900 hover:text-red-600 transition-colors mb-2 line-clamp-2"
                >
                    {product.name}
                </Link>

                {/* Prices */}
                <div className="flex items-center space-x-2 mb-3">
                    <span className="text-lg font-bold text-red-600">
                        ৳{Number(product.flash_sale_price).toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                        ৳{Number(product.original_price).toFixed(2)}
                    </span>
                </div>

                {/* Savings */}
                <div className="text-sm text-green-600 font-medium mb-3">
                    You save ৳{Number(product.discount_amount).toFixed(2)}
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={addToCart}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                    <ShoppingCartIcon className="h-5 w-5" />
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    );
}