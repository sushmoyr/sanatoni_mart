import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Product, Category } from '@/types/index';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

interface ShowProps extends PageProps {
    product: Product;
}

export default function Show({ auth, ziggy, product }: ShowProps) {
    const formatCurrency = (amount: number) => {
        return `৳${amount.toLocaleString('en-IN')}`;
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
                    <Card>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link
                                    href={route('admin.products.index')}
                                    className="text-semantic-textSub hover:text-semantic-text transition-colors duration-200"
                                >
                                    <ArrowLeftIcon className="h-5 w-5" />
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-bold text-semantic-text">Sacred Product Details</h1>
                                    <p className="text-semantic-textSub mt-1">{product.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Badge variant={product.status === 'active' ? 'success' : 'warning'}>
                                    {product.status}
                                </Badge>
                                {product.featured && (
                                    <Badge variant="info">Featured</Badge>
                                )}
                                <Link href={route('admin.products.edit', product.id)}>
                                    <Button variant="primary" size="sm" className="inline-flex items-center">
                                        <PencilIcon className="h-4 w-4 mr-1.5" />
                                        Edit Product
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Product Images Section */}
                    <Card className="mb-6">
                        <h3 className="text-lg font-semibold text-semantic-text mb-4">Sacred Product Images</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {product.images && product.images.length > 0 ? (
                                product.images.map((image, index) => (
                                    <div key={index} className="relative border border-semantic-border rounded-lg p-2 hover:border-brand-600 transition-colors duration-200">
                                        <img
                                            src={`/storage/${image.image_path}`}
                                            alt={image.alt_text || product.name}
                                            className="w-full h-48 object-cover rounded"
                                        />
                                        {image.is_main && (
                                            <Badge variant="info" className="absolute top-3 left-3">Primary</Badge>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-4 text-center py-12 text-semantic-textSub">
                                    <p>No sacred images available for this product.</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Basic Information */}
                    <Card className="mb-6">
                        <h3 className="text-lg font-semibold text-semantic-text mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-semantic-textSub">Product Name</label>
                                <p className="mt-1 text-semantic-text font-medium">{product.name}</p>
                            </div>
                                
                            <div>
                                <label className="block text-sm font-medium text-semantic-textSub">SKU</label>
                                <p className="mt-1 text-semantic-text font-mono">{product.sku}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-semantic-textSub">Category</label>
                                <p className="mt-1 text-semantic-text">
                                    {product.category?.name || 'No category assigned'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-semantic-textSub">Status</label>
                                <div className="mt-1">
                                    <Badge variant={product.status === 'active' ? 'success' : 'warning'}>
                                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                                    </Badge>
                                </div>
                            </div>

                            {product.featured && (
                                <div>
                                    <label className="block text-sm font-medium text-semantic-textSub">Featured Product</label>
                                    <div className="mt-1">
                                        <Badge variant="info">Sacred Featured Product</Badge>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-semantic-textSub">Description</label>
                                <div className="mt-1 text-semantic-text prose prose-sm max-w-none" 
                                     dangerouslySetInnerHTML={{ __html: product.description || '' }} />
                            </div>
                        </div>
                    </Card>

                    {/* Pricing Information */}
                    <Card className="mb-6">
                        <h3 className="text-lg font-semibold text-semantic-text mb-4">Sacred Pricing</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-semantic-textSub">Regular Price</label>
                                <p className="mt-1 text-lg font-semibold text-semantic-text">
                                    {formatCurrency(product.price)}
                                </p>
                            </div>
                            
                            {product.sale_price && (
                                <div>
                                    <label className="block text-sm font-medium text-semantic-textSub">Sale Price</label>
                                    <p className="mt-1 text-lg font-semibold text-green-600">
                                        {formatCurrency(product.sale_price)}
                                    </p>
                                </div>
                            )}

                            {product.sale_price && (
                                <div>
                                    <label className="block text-sm font-medium text-semantic-textSub">Savings</label>
                                    <p className="mt-1 text-sm text-green-600">
                                        {formatCurrency(product.price - product.sale_price)} 
                                        ({Math.round(((product.price - product.sale_price) / product.price) * 100)}% off)
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Inventory Information */}
                    <Card className="mb-6">
                        <h3 className="text-lg font-semibold text-semantic-text mb-4">Sacred Inventory</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-semantic-textSub">Stock Management</label>
                                <p className="mt-1 text-semantic-text">
                                    {product.manage_stock ? 'Track Quantity' : 'Don\'t Track Quantity'}
                                </p>
                            </div>
                            
                            {product.manage_stock && (
                                <div>
                                    <label className="block text-sm font-medium text-semantic-textSub">Stock Quantity</label>
                                    <p className={`mt-1 font-medium ${
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
                                <label className="block text-sm font-medium text-semantic-textSub">Stock Status</label>
                                <div className="mt-1">
                                    <Badge variant={
                                        !product.manage_stock 
                                            ? 'info'
                                            : product.stock_quantity && product.stock_quantity > 0
                                            ? 'success'
                                            : 'danger'
                                    }>
                                        {!product.manage_stock 
                                            ? 'Unlimited' 
                                            : product.stock_quantity && product.stock_quantity > 0
                                            ? `In Stock (${product.stock_quantity})`
                                            : 'Out of Stock'
                                        }
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Specifications */}
                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                        <Card className="mb-6">
                            <h3 className="text-lg font-semibold text-semantic-text mb-4">Sacred Specifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(product.specifications).map(([key, value]) => (
                                    <div key={key} className="border-b border-semantic-border pb-3">
                                        <dt className="text-sm font-medium text-semantic-textSub">{key}</dt>
                                        <dd className="mt-1 text-semantic-text">{value as string}</dd>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* SEO Information */}
                    <Card className="mb-6">
                        <h3 className="text-lg font-semibold text-semantic-text mb-4">SEO Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-semantic-textSub">Meta Title</label>
                                <p className="mt-1 text-semantic-text">{product.meta_title || 'Not set'}</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-semantic-textSub">Meta Description</label>
                                <p className="mt-1 text-semantic-text">{product.meta_description || 'Not set'}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Timestamps */}
                    <Card>
                        <h3 className="text-lg font-semibold text-semantic-text mb-4">Record Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-semantic-textSub">Created</label>
                                <p className="mt-1 text-semantic-text">{formatDate(product.created_at)}</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-semantic-textSub">Last Updated</label>
                                <p className="mt-1 text-semantic-text">{formatDate(product.updated_at)}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
