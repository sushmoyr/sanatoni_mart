import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Product, Category } from '@/types/index';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

interface ShowProps extends PageProps {
    product: Product;
}

export default function Show({ auth, ziggy, product }: ShowProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout>
            <Head title={`Product: ${product.name}`} />

            <div className="py-6">
                {/* Page Header */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Product Details: {product.name}
                        </h1>
                        <div className="flex space-x-3">
                            <Link
                                href={route('admin.products.edit', product.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                            >
                                Edit Product
                            </Link>
                            <Link
                                href={route('admin.products.index')}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                            >
                                Back to Products
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Product Images Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">Product Images</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {product.images && product.images.length > 0 ? (
                                    product.images.map((image, index) => (
                                        <div key={index} className="border rounded-lg p-2">
                                            <img
                                                src={`/storage/${image.image_path}`}
                                                alt={image.alt_text || product.name}
                                                className="w-full h-48 object-cover rounded"
                                            />
                                            {image.is_main && (
                                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-4 text-center py-8 text-gray-500">
                                        <div className="text-4xl mb-2">📷</div>
                                        <p>No images uploaded</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                    <p className="mt-1 text-sm text-gray-900">{product.name}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">SKU</label>
                                    <p className="mt-1 text-sm text-gray-900 font-mono">{product.sku}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {product.category ? product.category.name : 'No category assigned'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        product.status === 'published' 
                                            ? 'bg-green-100 text-green-800'
                                            : product.status === 'draft'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                                    </span>
                                </div>

                                {product.featured && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Featured</label>
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                            ⭐ Featured Product
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700">Short Description</label>
                                <p className="mt-1 text-sm text-gray-900">{product.short_description || 'No short description'}</p>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <div className="mt-1 text-sm text-gray-900" 
                                     dangerouslySetInnerHTML={{ __html: product.description || 'No description' }}>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Information */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">Pricing</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Regular Price</label>
                                    <p className="mt-1 text-lg font-semibold text-gray-900">
                                        {formatCurrency(product.price)}
                                    </p>
                                </div>
                                
                                {product.sale_price && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Sale Price</label>
                                        <p className="mt-1 text-lg font-semibold text-green-600">
                                            {formatCurrency(product.sale_price)}
                                        </p>
                                    </div>
                                )}

                                {product.sale_price && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Savings</label>
                                        <p className="mt-1 text-sm text-green-600">
                                            {formatCurrency(product.price - product.sale_price)} 
                                            ({Math.round(((product.price - product.sale_price) / product.price) * 100)}% off)
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Inventory Information */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">Inventory</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Stock Management</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {product.manage_stock ? 'Track Quantity' : 'Don\'t Track Quantity'}
                                    </p>
                                </div>
                                
                                {product.manage_stock && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                                        <p className={`mt-1 text-sm font-medium ${
                                            product.stock_quantity && product.stock_quantity > 10 
                                                ? 'text-green-600' 
                                                : product.stock_quantity && product.stock_quantity > 0
                                                ? 'text-yellow-600'
                                                : 'text-red-600'
                                        }`}>
                                            {product.stock_quantity || 0} units
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Stock Status</label>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        !product.manage_stock 
                                            ? 'bg-blue-100 text-blue-800'
                                            : product.stock_quantity && product.stock_quantity > 0
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {!product.manage_stock 
                                            ? 'Unlimited' 
                                            : product.stock_quantity && product.stock_quantity > 0
                                            ? `In Stock (${product.stock_quantity})`
                                            : 'Out of Stock'
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Specifications */}
                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                            <div className="p-6 text-gray-900">
                                <h3 className="text-lg font-medium mb-4">Specifications</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="border-b border-gray-200 pb-2">
                                            <dt className="text-sm font-medium text-gray-500">{key}</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{value as string}</dd>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SEO Information */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">SEO Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Meta Title</label>
                                    <p className="mt-1 text-sm text-gray-900">{product.meta_title || 'Not set'}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                                    <p className="mt-1 text-sm text-gray-900">{product.meta_description || 'Not set'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">Record Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Created</label>
                                    <p className="mt-1 text-sm text-gray-900">{formatDate(product.created_at)}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                                    <p className="mt-1 text-sm text-gray-900">{formatDate(product.updated_at)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
