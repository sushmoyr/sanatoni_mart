import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Product, Category } from '@/types';
import { 
    CubeIcon, 
    CurrencyDollarIcon, 
    ExclamationTriangleIcon, 
    XMarkIcon,
    BoltIcon,
    ChartBarIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

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
        return `৳${price.toLocaleString('en-IN')}`;
    };

    const formatNumber = (number: number) => {
        return new Intl.NumberFormat('en-IN').format(number);
    };

    return (
        <AdminLayout>
            <Head title="Sacred Inventory Report" />

            <div className="max-w-7xl mx-auto py-6">
                {/* Header */}
                <Card className="mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <ChartBarIcon className="h-8 w-8 text-brand-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-semantic-text">Sacred Inventory Report</h1>
                                <p className="text-semantic-textSub mt-1">Monitor sacred product stock levels and values</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <Link href={route('admin.products.index')}>
                                <Button variant="primary">
                                    Manage Products
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>

                {/* Inventory Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <Card className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <CubeIcon className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-semantic-textSub mb-1">Total Products</p>
                        <p className="text-2xl font-bold text-semantic-text">{formatNumber(inventoryStats.total_products)}</p>
                    </Card>

                    <Card className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-green-100 rounded-full">
                                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-semantic-textSub mb-1">Stock Value</p>
                        <p className="text-2xl font-bold text-semantic-text">{formatPrice(inventoryStats.total_stock_value)}</p>
                    </Card>

                    <Card className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-semantic-textSub mb-1">Low Stock</p>
                        <p className="text-2xl font-bold text-semantic-text">{formatNumber(inventoryStats.low_stock_count)}</p>
                    </Card>

                    <Card className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-red-100 rounded-full">
                                <XMarkIcon className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-semantic-textSub mb-1">Out of Stock</p>
                        <p className="text-2xl font-bold text-semantic-text">{formatNumber(inventoryStats.out_of_stock_count)}</p>
                    </Card>

                    <Card className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-purple-100 rounded-full">
                                <BoltIcon className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-semantic-textSub mb-1">Unlimited Stock</p>
                        <p className="text-2xl font-bold text-semantic-text">{formatNumber(inventoryStats.unlimited_stock_count)}</p>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Low Stock Alert */}
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-2">
                                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                                <h3 className="text-lg font-semibold text-semantic-text">Low Stock Alert</h3>
                                <Badge variant="warning">{lowStockProducts.length}</Badge>
                            </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto space-y-3">
                            {lowStockProducts.length === 0 ? (
                                <div className="text-center py-8 text-semantic-textSub">
                                    No low stock sacred products
                                </div>
                            ) : (
                                lowStockProducts.map((product) => (
                                    <div key={product.id} className="flex justify-between items-start p-4 bg-semantic-surface rounded-lg border border-semantic-border">
                                        <div>
                                            <h4 className="font-medium text-semantic-text">{product.name}</h4>
                                            <p className="text-sm text-semantic-textSub">SKU: {product.sku}</p>
                                            <p className="text-sm text-semantic-textSub">Category: {product.category?.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-semibold text-yellow-600">{product.stock_quantity}</span>
                                            <p className="text-sm text-semantic-textSub">units left</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    {/* Out of Stock Alert */}
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-2">
                                <XMarkIcon className="h-5 w-5 text-red-600" />
                                <h3 className="text-lg font-semibold text-semantic-text">Out of Stock Alert</h3>
                                <Badge variant="danger">{outOfStockProducts.length}</Badge>
                            </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto space-y-3">
                            {outOfStockProducts.length === 0 ? (
                                <div className="text-center py-8 text-semantic-textSub">
                                    No out of stock sacred products
                                </div>
                            ) : (
                                outOfStockProducts.map((product) => (
                                    <div key={product.id} className="flex justify-between items-start p-4 bg-semantic-surface rounded-lg border border-semantic-border">
                                        <div>
                                            <h4 className="font-medium text-semantic-text">{product.name}</h4>
                                            <p className="text-sm text-semantic-textSub">SKU: {product.sku}</p>
                                            <p className="text-sm text-semantic-textSub">Category: {product.category?.name}</p>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <div>
                                                <span className="text-lg font-semibold text-red-600">0</span>
                                                <p className="text-sm text-semantic-textSub">units left</p>
                                            </div>
                                            <Link href={route('admin.products.edit', product.id)}>
                                                <Button size="sm" variant="primary">
                                                    Restock
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Stock by Category */}
                <Card className="mb-8">
                    <h3 className="text-lg font-semibold text-semantic-text mb-6">Stock by Sacred Category</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-semantic-border">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">Total Products</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">In Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">Low Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">Out of Stock</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-semantic-border">
                                {stockByCategory.map((category) => (
                                    <tr key={category.id} className="hover:bg-semantic-surface transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-semantic-text">
                                            {category.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-semantic-text">
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
                </Card>

                {/* Top Products by Stock Value */}
                <Card>
                    <h3 className="text-lg font-semibold text-semantic-text mb-6">Top Sacred Products by Stock Value</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-semantic-border">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">Stock Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">Stock Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-semantic-border">
                                {topProductsByValue.map((product) => (
                                    <tr key={product.id} className="hover:bg-semantic-surface transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {product.images && product.images.length > 0 ? (
                                                        <img 
                                                            className="h-10 w-10 rounded object-cover border border-semantic-border" 
                                                            src={`/storage/${product.images[0].image_path}`} 
                                                            alt={product.name}
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded bg-semantic-surface border border-semantic-border flex items-center justify-center">
                                                            <PhotoIcon className="w-5 h-5 text-semantic-textSub" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-semantic-text">{product.name}</div>
                                                    <div className="text-sm text-semantic-textSub">SKU: {product.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-semantic-text">
                                            {product.category?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-semantic-text">
                                            {formatPrice(product.price)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-semantic-text">
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
                </Card>
            </div>
        </AdminLayout>
    );
}
