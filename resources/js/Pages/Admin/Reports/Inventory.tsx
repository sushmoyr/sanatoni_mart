import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Product, Category } from '@/types';

interface InventoryStats {
    total_products: number;
    total_stock_value: number;
    low_stock_count: number;
    out_of_stock_count: number;
    unlimited_stock_count: number;
}

interface StockByCategory extends Category {
    total_products: number;
    in_stock_products: number;
    low_stock_products: number;
    out_of_stock_products: number;
}

interface Props {
    lowStockProducts: Product[];
    outOfStockProducts: Product[];
    stockByCategory: StockByCategory[];
    inventoryStats: InventoryStats;
    topProductsByValue: Product[];
}

export default function Inventory({ 
    lowStockProducts, 
    outOfStockProducts, 
    stockByCategory, 
    inventoryStats, 
    topProductsByValue 
}: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    const formatNumber = (number: number) => {
        return new Intl.NumberFormat('en-IN').format(number);
    };

    return (
        <AdminLayout>
            <Head title="Inventory Report" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold text-gray-900">Inventory Report</h1>
                                <Link
                                    href={route('admin.products.index')}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Manage Products
                                </Link>
                            </div>

                            {/* Inventory Statistics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                                <div className="bg-blue-50 p-6 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-blue-100 rounded-md">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-blue-600">Total Products</p>
                                            <p className="text-2xl font-semibold text-blue-900">{formatNumber(inventoryStats.total_products)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-50 p-6 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-green-100 rounded-md">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-green-600">Stock Value</p>
                                            <p className="text-2xl font-semibold text-green-900">{formatPrice(inventoryStats.total_stock_value)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 p-6 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-yellow-100 rounded-md">
                                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-yellow-600">Low Stock</p>
                                            <p className="text-2xl font-semibold text-yellow-900">{formatNumber(inventoryStats.low_stock_count)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-red-50 p-6 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-red-100 rounded-md">
                                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-red-600">Out of Stock</p>
                                            <p className="text-2xl font-semibold text-red-900">{formatNumber(inventoryStats.out_of_stock_count)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-purple-50 p-6 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-purple-100 rounded-md">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-purple-600">Unlimited Stock</p>
                                            <p className="text-2xl font-semibold text-purple-900">{formatNumber(inventoryStats.unlimited_stock_count)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Low Stock Alert */}
                                <div className="bg-white border border-yellow-200 rounded-lg">
                                    <div className="px-6 py-4 border-b border-yellow-200 bg-yellow-50">
                                        <h3 className="text-lg font-semibold text-yellow-800 flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                            Low Stock Alert ({lowStockProducts.length})
                                        </h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {lowStockProducts.length === 0 ? (
                                            <div className="px-6 py-4 text-gray-500 text-center">No low stock products</div>
                                        ) : (
                                            lowStockProducts.map((product) => (
                                                <div key={product.id} className="px-6 py-3 border-b border-gray-100 last:border-b-0">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">{product.name}</h4>
                                                            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                                                            <p className="text-sm text-gray-500">Category: {product.category?.name}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-lg font-semibold text-yellow-600">{product.stock_quantity}</span>
                                                            <p className="text-sm text-gray-500">units left</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Out of Stock Alert */}
                                <div className="bg-white border border-red-200 rounded-lg">
                                    <div className="px-6 py-4 border-b border-red-200 bg-red-50">
                                        <h3 className="text-lg font-semibold text-red-800 flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Out of Stock Alert ({outOfStockProducts.length})
                                        </h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {outOfStockProducts.length === 0 ? (
                                            <div className="px-6 py-4 text-gray-500 text-center">No out of stock products</div>
                                        ) : (
                                            outOfStockProducts.map((product) => (
                                                <div key={product.id} className="px-6 py-3 border-b border-gray-100 last:border-b-0">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">{product.name}</h4>
                                                            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                                                            <p className="text-sm text-gray-500">Category: {product.category?.name}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-lg font-semibold text-red-600">0</span>
                                                            <p className="text-sm text-gray-500">units left</p>
                                                            <Link
                                                                href={route('admin.products.edit', product.id)}
                                                                className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                                            >
                                                                Restock
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Stock by Category */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock by Category</h3>
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Products</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Stock</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Low Stock</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Out of Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {stockByCategory.map((category) => (
                                                <tr key={category.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {category.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatNumber(category.total_products)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                                        {formatNumber(category.in_stock_products)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                                                        {formatNumber(category.low_stock_products)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                                        {formatNumber(category.out_of_stock_products)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Top Products by Stock Value */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products by Stock Value</h3>
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Quantity</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Value</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {topProductsByValue.map((product) => (
                                                <tr key={product.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                {product.images && product.images.length > 0 ? (
                                                                    <img 
                                                                        className="h-10 w-10 rounded object-cover" 
                                                                        src={`/storage/${product.images[0].image_path}`} 
                                                                        alt={product.name}
                                                                    />
                                                                ) : (
                                                                    <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                                                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                                <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {product.category?.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatPrice(product.price)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatNumber(product.stock_quantity)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                                        {formatPrice(product.price * product.stock_quantity)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
