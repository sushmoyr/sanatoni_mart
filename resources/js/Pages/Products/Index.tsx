import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';
import { Product, Category, PageProps } from '@/types';

interface ProductsIndexProps extends PageProps {
    products: {
        data: Product[];
        links: any[];
        meta: any;
    };
    categories: Category[];
    filters: {
        category?: string;
        min_price?: string;
        max_price?: string;
        search?: string;
        sort?: string;
        order?: string;
    };
}

export default function ProductsIndex({ auth, products, categories = [], filters = {} }: ProductsIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');

    const handleFilter = () => {
        const filterData: any = {};
        if (searchTerm) filterData.search = searchTerm;
        if (selectedCategory) filterData.category = selectedCategory;
        if (minPrice) filterData.min_price = minPrice;
        if (maxPrice) filterData.max_price = maxPrice;

        router.get(route('products.index'), filterData, { preserveState: true });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setMinPrice('');
        setMaxPrice('');
        router.get(route('products.index'));
    };

    const productsList = products?.data || [];

    return (
        <StoreLayout title="Products" description="Discover our collection of religious products">
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                        <p className="mt-2 text-gray-600">
                            Discover our collection of religious products
                        </p>
                    </div>

                    {/* Simple Search */}
                    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search products..."
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <button
                                onClick={handleFilter}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                            >
                                Search
                            </button>
                            {(searchTerm || selectedCategory || minPrice || maxPrice) && (
                                <button
                                    onClick={clearFilters}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Products Grid */}
                    {productsList.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {productsList.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Try adjusting your search to find what you're looking for.
                            </p>
                        </div>
                    )}

                    {/* Simple Pagination */}
                    {products?.links && products.links.length > 3 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex space-x-2">
                                {products.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url}
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                                            link.active
                                                ? 'bg-indigo-600 text-white'
                                                : link.url
                                                ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </StoreLayout>
    );
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <Link href={route('products.show', product.id)} className="block">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg">
                    <img
                        src={product.main_image || '/images/placeholder.jpg'}
                        alt={product.name}
                        className="h-48 w-full object-cover object-center"
                    />
                </div>
                <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {product.short_description}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                        <p className="text-lg font-medium text-gray-900">
                            ৳{product.price}
                        </p>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {product.category?.name}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
