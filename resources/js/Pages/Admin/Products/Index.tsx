import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
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
}

export default function Index({ products, categories }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
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
                                    <Link
                                        href={route('admin.products.create')}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Add Product
                                    </Link>
                                </div>
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
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this product?')) {
                                                                // Handle delete
                                                            }
                                                        }}
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
