import React, { FormEventHandler, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Category } from '@/types';
import { Card, Button, Input, Badge } from '@/Components/ui';
import { 
    ArrowLeftIcon,
    CubeIcon,
    PhotoIcon,
    PlusIcon,
    XMarkIcon,
    TagIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface Props {
    categories: Category[];
}

export default function Create({ categories }: Props) {
    const [images, setImages] = useState<any[]>([]);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        short_description: '',
        price: '',
        sale_price: '',
        category_id: '',
        manage_stock: true,
        stock_quantity: 0,
        allow_backorders: false,
        featured: false,
        is_active: true,
        status: 'draft',
        weight: '',
        specifications: {} as Record<string, string>,
        meta_title: '',
        meta_description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // For now, we'll handle images separately since the form data is complex
        // In a real implementation, you'd process images on the backend after product creation
        post(route('admin.products.store'), {
            onSuccess: () => {
                reset();
                setImages([]);
            },
        });
    };

    const addSpecification = () => {
        const key = prompt('Enter specification name (e.g., Material, Color, Size):');
        if (key && key.trim()) {
            setData('specifications', {
                ...data.specifications,
                [key.trim()]: ''
            });
        }
    };

    const updateSpecification = (key: string, value: string) => {
        setData('specifications', {
            ...data.specifications,
            [key]: value
        });
    };

    const removeSpecification = (key: string) => {
        const newSpecs = { ...data.specifications };
        delete newSpecs[key];
        setData('specifications', newSpecs);
    };

    return (
        <AdminLayout>
            <Head title="Create Product" />

            <div className="container-custom py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                                Create Sacred Product
                            </h1>
                            <p className="text-semantic-textSub">
                                Add a new spiritual product to your inventory
                            </p>
                        </div>
                        <Button variant="secondary" asChild>
                            <Link href={route('admin.products.index')}>
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                Back to Products
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="max-w-4xl">
                    <form onSubmit={submit} className="space-y-8">
                        {/* Basic Information */}
                        <Card className="devotional-border">
                            <div className="p-6">
                                <h3 className="text-lg font-serif font-medium text-semantic-text mb-6 flex items-center">
                                    <CubeIcon className="h-5 w-5 mr-2 text-brand-600" />
                                    Basic Information
                                </h3>
                                
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-semantic-text mb-2">
                                            Product Name *
                                        </label>
                                        <Input
                                            type="text"
                                            value={data.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                                            placeholder="Enter sacred product name..."
                                            required
                                            leftIcon={<TagIcon className="h-4 w-4" />}
                                        />
                                        {errors.name && (
                                            <p className="mt-2 text-sm text-danger-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-semantic-text mb-2">
                                            Short Description
                                        </label>
                                        <textarea
                                            value={data.short_description}
                                            onChange={(e) => setData('short_description', e.target.value)}
                                            className="w-full px-3 py-2 border border-semantic-border rounded-md shadow-e1 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-semantic-text"
                                            rows={2}
                                            placeholder="Brief product description for listings..."
                                        />
                                        {errors.short_description && (
                                            <p className="mt-2 text-sm text-danger-600">{errors.short_description}</p>
                                        )}
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-semantic-text mb-2">
                                            Full Description *
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="w-full px-3 py-2 border border-semantic-border rounded-md shadow-e1 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-semantic-text"
                                            rows={4}
                                            placeholder="Detailed product description..."
                                            required
                                        />
                                        {errors.description && (
                                            <p className="mt-2 text-sm text-danger-600">{errors.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Pricing */}
                        <Card className="devotional-border">
                            <div className="p-6">
                                <h3 className="text-lg font-serif font-medium text-semantic-text mb-6 flex items-center">
                                    <CurrencyDollarIcon className="h-5 w-5 mr-2 text-brand-600" />
                                    Pricing
                                </h3>
                                
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <div>
                                        <label className="block text-sm font-medium text-semantic-text mb-2">
                                            Regular Price (৳) *
                                        </label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.price}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('price', e.target.value)}
                                            placeholder="0.00"
                                            required
                                        />
                                        {errors.price && (
                                            <p className="mt-2 text-sm text-danger-600">{errors.price}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-semantic-text mb-2">
                                            Sale Price (৳)
                                        </label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.sale_price}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('sale_price', e.target.value)}
                                            placeholder="0.00"
                                        />
                                        {errors.sale_price && (
                                            <p className="mt-2 text-sm text-danger-600">{errors.sale_price}</p>
                                        )}
                                        <p className="mt-1 text-sm text-semantic-textSub">
                                            Optional. Must be less than regular price.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-semantic-text mb-2">
                                            Category *
                                        </label>
                                        <select
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-semantic-border rounded-md shadow-e1 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-semantic-text"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.parent ? `${category.parent.name} > ${category.name}` : category.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category_id && (
                                            <p className="mt-2 text-sm text-danger-600">{errors.category_id}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Inventory Management */}
                        <Card className="devotional-border">
                            <div className="p-6">
                                <h3 className="text-lg font-serif font-medium text-semantic-text mb-6">
                                    Inventory Management
                                </h3>
                                
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center">
                                            <input
                                                id="manage_stock"
                                                type="checkbox"
                                                checked={data.manage_stock}
                                                onChange={(e) => setData('manage_stock', e.target.checked)}
                                                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-semantic-border rounded"
                                            />
                                            <label htmlFor="manage_stock" className="ml-2 text-sm font-medium text-semantic-text">
                                                Track Stock Quantity
                                            </label>
                                        </div>
                                        <p className="mt-1 text-sm text-semantic-textSub">
                                            Uncheck for unlimited stock items (like digital products or fresh flowers)
                                        </p>
                                    </div>

                                    {data.manage_stock && (
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-semantic-text mb-2">
                                                    Stock Quantity
                                                </label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={data.stock_quantity.toString()}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('stock_quantity', parseInt(e.target.value) || 0)}
                                                    placeholder="0"
                                                />
                                                {errors.stock_quantity && (
                                                    <p className="mt-2 text-sm text-danger-600">{errors.stock_quantity}</p>
                                                )}
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    id="allow_backorders"
                                                    type="checkbox"
                                                    checked={data.allow_backorders}
                                                    onChange={(e) => setData('allow_backorders', e.target.checked)}
                                                    className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-semantic-border rounded"
                                                />
                                                <div className="ml-2">
                                                    <label htmlFor="allow_backorders" className="text-sm font-medium text-semantic-text">
                                                        Allow Backorders
                                                    </label>
                                                    <p className="text-sm text-semantic-textSub">
                                                        Allow customers to order when out of stock
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Product Details */}
                        <Card className="devotional-border">
                            <div className="p-6">
                                <h3 className="text-lg font-serif font-medium text-semantic-text mb-6">
                                    Product Details
                                </h3>
                                
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-semantic-text mb-2">
                                            Weight (kg)
                                        </label>
                                        <Input
                                            type="number"
                                            step="0.001"
                                            min="0"
                                            value={data.weight}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('weight', e.target.value)}
                                            placeholder="0.000"
                                        />
                                        {errors.weight && (
                                            <p className="mt-2 text-sm text-danger-600">{errors.weight}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Specifications */}
                        <Card className="devotional-border">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-serif font-medium text-semantic-text">
                                        Specifications
                                    </h3>
                                    <Button type="button" variant="secondary" size="sm" onClick={addSpecification}>
                                        <PlusIcon className="h-4 w-4 mr-2" />
                                        Add Specification
                                    </Button>
                                </div>
                                
                                <div className="space-y-4">
                                    {Object.entries(data.specifications).map(([key, value]) => (
                                        <div key={key} className="flex items-start space-x-3">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-semantic-text mb-2">
                                                    {key}
                                                </label>
                                                <Input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSpecification(key, e.target.value)}
                                                    placeholder={`Enter ${key.toLowerCase()}`}
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeSpecification(key)}
                                                className="text-danger-600 hover:text-danger-700 hover:bg-danger-50 mt-7"
                                            >
                                                <XMarkIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {Object.keys(data.specifications).length === 0 && (
                                        <p className="text-semantic-textSub text-sm">
                                            No specifications added. Click "Add Specification" to add product details like material, color, size, etc.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Status and Settings */}
                        <Card className="devotional-border">
                            <div className="p-6">
                                <h3 className="text-lg font-serif font-medium text-semantic-text mb-6">
                                    Status & Settings
                                </h3>
                                
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <div>
                                        <label className="block text-sm font-medium text-semantic-text mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="w-full px-3 py-2 border border-semantic-border rounded-md shadow-e1 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-semantic-text"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                        {errors.status && (
                                            <p className="mt-2 text-sm text-danger-600">{errors.status}</p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center mt-6">
                                            <input
                                                id="is_active"
                                                type="checkbox"
                                                checked={data.is_active}
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-semantic-border rounded"
                                            />
                                            <label htmlFor="is_active" className="ml-2 text-sm font-medium text-semantic-text">
                                                Active
                                            </label>
                                        </div>
                                        <p className="mt-1 text-sm text-semantic-textSub">
                                            Only active products are shown to customers
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center mt-6">
                                            <input
                                                id="featured"
                                                type="checkbox"
                                                checked={data.featured}
                                                onChange={(e) => setData('featured', e.target.checked)}
                                                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-semantic-border rounded"
                                            />
                                            <label htmlFor="featured" className="ml-2 text-sm font-medium text-semantic-text">
                                                Featured Product
                                            </label>
                                        </div>
                                        <p className="mt-1 text-sm text-semantic-textSub">
                                            Featured products appear prominently on the homepage
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Product Images */}
                        <Card className="devotional-border">
                            <div className="p-6">
                                <h3 className="text-lg font-serif font-medium text-semantic-text mb-6 flex items-center">
                                    <PhotoIcon className="h-5 w-5 mr-2 text-brand-600" />
                                    Product Images
                                </h3>
                                
                                <div className="border-2 border-dashed border-semantic-border rounded-lg p-6 text-center">
                                    <PhotoIcon className="h-12 w-12 text-semantic-textSub mx-auto mb-4" />
                                    <p className="text-semantic-text font-medium mb-2">Upload Sacred Product Images</p>
                                    <p className="text-semantic-textSub text-sm">
                                        Drag and drop images here, or click to select files
                                    </p>
                                    <p className="text-semantic-textSub text-xs mt-2">
                                        Upload up to 10 images. The first image will be used as the primary image.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* SEO Settings */}
                        <Card className="devotional-border">
                            <div className="p-6">
                                <h3 className="text-lg font-serif font-medium text-semantic-text mb-6">
                                    SEO Settings
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-semantic-text mb-2">
                                            Meta Title
                                        </label>
                                        <Input
                                            type="text"
                                            value={data.meta_title}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('meta_title', e.target.value)}
                                            placeholder="Leave blank to use product name"
                                        />
                                        {errors.meta_title && (
                                            <p className="mt-2 text-sm text-danger-600">{errors.meta_title}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-semantic-text mb-2">
                                            Meta Description
                                        </label>
                                        <textarea
                                            value={data.meta_description}
                                            onChange={(e) => setData('meta_description', e.target.value)}
                                            className="w-full px-3 py-2 border border-semantic-border rounded-md shadow-e1 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-semantic-text"
                                            rows={3}
                                            placeholder="Leave blank to use short description"
                                        />
                                        {errors.meta_description && (
                                            <p className="mt-2 text-sm text-danger-600">{errors.meta_description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-4">
                            <Button variant="secondary" asChild>
                                <Link href={route('admin.products.index')}>
                                    Cancel
                                </Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Sacred Product'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
