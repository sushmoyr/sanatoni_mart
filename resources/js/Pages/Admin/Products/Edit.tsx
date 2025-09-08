import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Product, Category, PageProps } from '@/types';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { PlusIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface EditProps extends PageProps {
    product: Product & {
        specifications: { key: string; value: string }[];
        images: { id: number; image_path: string; alt_text: string | null; sort_order: number }[];
    };
    categories: Category[];
}

export default function Edit({ auth, product, categories }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name || '',
        description: product.description || '',
        short_description: product.short_description || '',
        sku: product.sku || '',
        price: product.price || '',
        stock_quantity: product.stock_quantity || '',
        low_stock_threshold: product.low_stock_threshold || 10,
        category_id: product.category_id || '',
        status: product.status || 'active',
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || '',
        specifications: JSON.stringify(product.specifications || []),
    });

    const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>(
        product.specifications || []
    );

    const addSpecification = () => {
        setSpecifications([...specifications, { key: '', value: '' }]);
    };

    const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
        const newSpecs = [...specifications];
        newSpecs[index][field] = value;
        setSpecifications(newSpecs);
        setData('specifications', JSON.stringify(newSpecs));
    };

    const removeSpecification = (index: number) => {
        const newSpecs = specifications.filter((_, i) => i !== index);
        setSpecifications(newSpecs);
        setData('specifications', JSON.stringify(newSpecs));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.products.update', product.id));
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('bn-BD', {
            style: 'currency',
            currency: 'BDT',
            currencyDisplay: 'symbol'
        }).format(price).replace('৳', '৳');
    };

    return (
        <AdminLayout>
            <Head title={`Edit Sacred Product: ${product.name}`} />

            <div className="max-w-7xl mx-auto py-6">
                {/* Header */}
                <Card className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-semantic-text">Edit Sacred Product</h1>
                            <p className="text-semantic-textSub mt-1">Update the divine details of {product.name}</p>
                        </div>
                        <div className="flex space-x-3">
                            <Link href={route('admin.products.show', product.id)}>
                                <Button variant="secondary">
                                    View Product
                                </Button>
                            </Link>
                            <Link href={route('admin.products.index')}>
                                <Button variant="ghost">
                                    Back to Products
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <h2 className="text-lg font-semibold text-semantic-text mb-6">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-semantic-text mb-2">
                                    Sacred Product Name *
                                </label>
                                <Input
                                    value={data.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                                    error={errors.name}
                                    placeholder="Enter divine product name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-semantic-text mb-2">
                                    SKU *
                                </label>
                                <Input
                                    value={data.sku}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('sku', e.target.value)}
                                    error={errors.sku}
                                    placeholder="Enter unique product identifier"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-semantic-text mb-2">
                                    Short Description *
                                </label>
                                <Input
                                    value={data.short_description}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('short_description', e.target.value)}
                                    error={errors.short_description}
                                    placeholder="Brief description for sacred product listing"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-semantic-text mb-2">
                                    Full Description *
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                    className="w-full border border-semantic-border rounded-lg px-3 py-2 text-semantic-text bg-white focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                                    rows={4}
                                    placeholder="Detailed description of the sacred product..."
                                />
                                {errors.description && (
                                    <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-semantic-text mb-2">
                                    Sacred Category *
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData('category_id', e.target.value)}
                                    className="w-full border border-semantic-border rounded-lg px-3 py-2 text-semantic-text bg-white focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                                >
                                    <option value="">Select a sacred category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="text-red-600 text-sm mt-1">{errors.category_id}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-semantic-text mb-2">
                                    Product Status *
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData('status', e.target.value)}
                                    className="w-full border border-semantic-border rounded-lg px-3 py-2 text-semantic-text bg-white focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="draft">Draft</option>
                                </select>
                                {errors.status && (
                                    <p className="text-red-600 text-sm mt-1">{errors.status}</p>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Pricing and Inventory */}
                    <Card>
                        <h2 className="text-lg font-semibold text-semantic-text mb-6">Pricing & Inventory</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-semantic-text mb-2">
                                    Price (৳) *
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('price', e.target.value)}
                                    error={errors.price}
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-semantic-text mb-2">
                                    Stock Quantity *
                                </label>
                                <Input
                                    type="number"
                                    value={data.stock_quantity}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('stock_quantity', e.target.value)}
                                    error={errors.stock_quantity}
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-semantic-text mb-2">
                                    Low Stock Threshold
                                </label>
                                <Input
                                    type="number"
                                    value={data.low_stock_threshold}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('low_stock_threshold', parseInt(e.target.value) || 0)}
                                    error={errors.low_stock_threshold}
                                    placeholder="10"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Product Images */}
                    <Card>
                        <h2 className="text-lg font-semibold text-semantic-text mb-6">Sacred Product Images</h2>
                        {product.images && product.images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {product.images.map((image) => (
                                    <div key={image.id} className="relative group">
                                        <img
                                            src={`/storage/${image.image_path}`}
                                            alt={image.alt_text || product.name}
                                            className="w-full h-32 object-cover rounded-lg border border-semantic-border"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm">Sacred Image {image.sort_order}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-semantic-border rounded-lg p-8 text-center mb-6">
                                <PhotoIcon className="w-12 h-12 text-semantic-textSub mx-auto mb-4" />
                                <p className="text-semantic-textSub">No sacred images uploaded yet</p>
                            </div>
                        )}
                        <p className="text-sm text-semantic-textSub">
                            Image management will be available in a future update. 
                            Current images can be managed through the file system.
                        </p>
                    </Card>

                    {/* Specifications */}
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-semantic-text">Sacred Specifications</h2>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={addSpecification}
                            >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Add Specification
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {specifications.map((spec, index) => (
                                <div key={index} className="flex gap-4 items-start">
                                    <div className="flex-1">
                                        <Input
                                            value={spec.key}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSpecification(index, 'key', e.target.value)}
                                            placeholder="Specification name (e.g., Material, Dimensions)"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Input
                                            value={spec.value}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSpecification(index, 'value', e.target.value)}
                                            placeholder="Specification value (e.g., Brass, 6 inches)"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => removeSpecification(index)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}

                            {specifications.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed border-semantic-border rounded-lg">
                                    <p className="text-semantic-textSub">No specifications added yet</p>
                                    <p className="text-sm text-semantic-textSub mt-1">
                                        Add specifications like material, dimensions, origin, etc.
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* SEO Settings */}
                    <Card>
                        <h2 className="text-lg font-semibold text-semantic-text mb-6">SEO Settings</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-semantic-text mb-2">
                                    Meta Title
                                </label>
                                <Input
                                    value={data.meta_title}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('meta_title', e.target.value)}
                                    error={errors.meta_title}
                                    placeholder="SEO title for search engines"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-semantic-text mb-2">
                                    Meta Description
                                </label>
                                <textarea
                                    value={data.meta_description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('meta_description', e.target.value)}
                                    className="w-full border border-semantic-border rounded-lg px-3 py-2 text-semantic-text bg-white focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                                    rows={3}
                                    placeholder="SEO description for search engines..."
                                />
                                {errors.meta_description && (
                                    <p className="text-red-600 text-sm mt-1">{errors.meta_description}</p>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Form Actions */}
                    <Card>
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-semantic-textSub">
                                * Required fields must be filled with sacred details
                            </div>
                            <div className="flex space-x-3">
                                <Link href={route('admin.products.index')}>
                                    <Button variant="ghost" disabled={processing}>
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={processing}
                                >
                                    {processing ? 'Updating Sacred Product...' : 'Update Sacred Product'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
