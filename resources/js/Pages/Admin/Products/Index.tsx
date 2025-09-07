import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Product, Category } from '@/types';

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    products: PaginatedProducts;
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
        status?: string;
        stock_status?: string;
        price_min?: string;
        price_max?: string;
        sort_by?: string;
        sort_direction?: string;
    };
}

export default function Index({ products, categories, filters: initialFilters }: Props) {
    const [filters, setFilters] = useState({
        search: initialFilters?.search || '',
        category: initialFilters?.category || '',
        status: initialFilters?.status || '',
        stock_status: initialFilters?.stock_status || '',
        price_min: initialFilters?.price_min || '',
        price_max: initialFilters?.price_max || '',
        sort_by: initialFilters?.sort_by || 'created_at',
        sort_direction: initialFilters?.sort_direction || 'desc'
    });

    const [showFilters, setShowFilters] = useState(false);

    const applyFilters = () => {
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== '')
        );
        
        router.get(route('admin.products.index'), cleanFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            category: '',
            status: '',
            stock_status: '',
            price_min: '',
            price_max: '',
            sort_by: 'created_at',
            sort_direction: 'desc'
        });
        router.get(route('admin.products.index'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    const handleDelete = (product: Product) => {
        if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
            router.delete(route('admin.products.destroy', product.id), {
                onSuccess: () => {
                    // Success message will be handled by flash message
                },
                onError: (errors) => {
                    alert('Failed to delete product. Please try again.');
                    console.error('Delete error:', errors);
                }
            });
        }
    };

    const getStatusBadge = (status: string, isActive: boolean) => {
        if (!isActive) {
            return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Inactive</span>;
        }
        
        switch (status) {
            case 'published':
                return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Published</span>;
            case 'draft':
                return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Draft</span>;
            case 'archived':
                return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Archived</span>;
            default:
                return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    const getStockStatus = (product: Product) => {
        if (!product.manage_stock) {
            return <span className="text-green-600">∞ Unlimited</span>;
        }
        
        if (product.stock_quantity <= 0) {
            return <span className="text-red-600">Out of Stock</span>;
        } else if (product.stock_quantity <= 5) {
            return <span className="text-yellow-600">Low Stock ({product.stock_quantity})</span>;
        } else {
            return <span className="text-green-600">In Stock ({product.stock_quantity})</span>;
        }
    };

    return (
        <AdminLayout>
            <Head title="Products" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                                        </svg>
                                        Filters
                                    </button>
                                    <Link
                                        href={route('admin.products.create')}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Add Product
                                    </Link>
                                </div>
                            </div>

                            {/* Search and Filter Section */}
                            <div className="mb-6">
                                {/* Search Bar */}
                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={filters.search}
                                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                            onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={applyFilters}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                                        >
                                            Search
                                        </button>
                                        <button
                                            onClick={resetFilters}
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>

                                {/* Advanced Filters */}
                                {showFilters && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {/* Category Filter */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                                <select
                                                    value={filters.category}
                                                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                >
                                                    <option value="">All Categories</option>
                                                    {categories.map((category) => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Status Filter */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                                <select
                                                    value={filters.status}
                                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                >
                                                    <option value="">All Status</option>
                                                    <option value="published">Published</option>
                                                    <option value="draft">Draft</option>
                                                    <option value="archived">Archived</option>
                                                </select>
                                            </div>

                                            {/* Stock Status Filter */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                                                <select
                                                    value={filters.stock_status}
                                                    onChange={(e) => setFilters({ ...filters, stock_status: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                >
                                                    <option value="">All Stock</option>
                                                    <option value="in_stock">In Stock</option>
                                                    <option value="low_stock">Low Stock</option>
                                                    <option value="out_of_stock">Out of Stock</option>
                                                </select>
                                            </div>

                                            {/* Sort By */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                                                <select
                                                    value={`${filters.sort_by}-${filters.sort_direction}`}
                                                    onChange={(e) => {
                                                        const [sort_by, sort_direction] = e.target.value.split('-');
                                                        setFilters({ ...filters, sort_by, sort_direction });
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                >
                                                    <option value="created_at-desc">Newest First</option>
                                                    <option value="created_at-asc">Oldest First</option>
                                                    <option value="name-asc">Name A-Z</option>
                                                    <option value="name-desc">Name Z-A</option>
                                                    <option value="price-asc">Price Low-High</option>
                                                    <option value="price-desc">Price High-Low</option>
                                                    <option value="stock_quantity-asc">Stock Low-High</option>
                                                    <option value="stock_quantity-desc">Stock High-Low</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Price Range */}
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    placeholder="Min Price"
                                                    value={filters.price_min}
                                                    onChange={(e) => setFilters({ ...filters, price_min: e.target.value })}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                                <span className="self-center text-gray-500">to</span>
                                                <input
                                                    type="number"
                                                    placeholder="Max Price"
                                                    value={filters.price_max}
                                                    onChange={(e) => setFilters({ ...filters, price_max: e.target.value })}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex justify-end">
                                            <button
                                                onClick={applyFilters}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
                                            >
                                                Apply Filters
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Products Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stock
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.data.map((product) => (
                                            <tr key={product.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-12 w-12">
                                                            {product.main_image ? (
                                                                <img
                                                                    className="h-12 w-12 rounded-md object-cover"
                                                                    src={`/storage/${product.main_image}`}
                                                                    alt={product.name}
                                                                />
                                                            ) : (
                                                                <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center">
                                                                    <span className="text-gray-400 text-xs">No Image</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {product.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                SKU: {product.sku}
                                                            </div>
                                                            {product.featured && (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                    ⭐ Featured
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {product.category?.name || 'Uncategorized'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div>
                                                        {product.sale_price ? (
                                                            <>
                                                                <span className="line-through text-gray-500">
                                                                    {formatPrice(product.price)}
                                                                </span>
                                                                <br />
                                                                <span className="text-red-600 font-semibold">
                                                                    {formatPrice(product.sale_price)}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="font-semibold">
                                                                {formatPrice(product.price)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {getStockStatus(product)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(product.status, product.is_active)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        href={route('admin.products.show', product.id)}
                                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={route('admin.products.edit', product.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        className="text-red-600 hover:text-red-900"
                                                        onClick={() => handleDelete(product)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {products.last_page > 1 && (
                                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-6">
                                    <div className="flex flex-1 justify-between sm:hidden">
                                        {products.links[0]?.url && (
                                            <Link
                                                href={products.links[0].url}
                                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Previous
                                            </Link>
                                        )}
                                        {products.links[products.links.length - 1]?.url && (
                                            <Link
                                                href={products.links[products.links.length - 1].url!}
                                                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Next
                                            </Link>
                                        )}
                                    </div>
                                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Showing{' '}
                                                <span className="font-medium">
                                                    {(products.current_page - 1) * products.per_page + 1}
                                                </span>{' '}
                                                to{' '}
                                                <span className="font-medium">
                                                    {Math.min(products.current_page * products.per_page, products.total)}
                                                </span>{' '}
                                                of <span className="font-medium">{products.total}</span> results
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                                {products.links.map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                            link.active
                                                                ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                                                        } ${
                                                            index === 0 ? 'rounded-l-md' : ''
                                                        } ${
                                                            index === products.links.length - 1 ? 'rounded-r-md' : ''
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {products.data.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">No products found.</p>
                                    <Link
                                        href={route('admin.products.create')}
                                        className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Create your first product
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
