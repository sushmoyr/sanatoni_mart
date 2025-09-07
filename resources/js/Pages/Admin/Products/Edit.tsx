import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Product, Category } from '@/types/index';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState } from 'react';

interface EditProps extends PageProps {
    product: Product;
    categories: Category[];
}

export default function Edit({ auth, ziggy, product, categories }: EditProps) {
    const [manageStock, setManageStock] = useState(product.manage_stock);
    const [specifications, setSpecifications] = useState<Record<string, string>>(
        product.specifications || {}
    );

    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        short_description: product.short_description || '',
        description: product.description || '',
        category_id: product.category_id,
        price: product.price.toString(),
        sale_price: product.sale_price?.toString() || '',
        manage_stock: product.manage_stock,
        stock_quantity: product.stock_quantity?.toString() || '0',
        featured: product.featured,
        status: product.status,
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || '',
        specifications: product.specifications || {},
    } as {
        name: string;
        short_description: string;
        description: string;
        category_id: number;
        price: string;
        sale_price: string;
        manage_stock: boolean;
        stock_quantity: string;
        featured: boolean;
        status: string;
        meta_title: string;
        meta_description: string;
        specifications: Record<string, any>;
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.products.update', product.id));
    };

    const addSpecification = () => {
        const key = `spec_${Date.now()}`;
        setSpecifications(prev => ({ ...prev, [key]: '' }));
    };

    const updateSpecification = (oldKey: string, newKey: string, value: string) => {
        setSpecifications(prev => {
            const updated = { ...prev };
            if (oldKey !== newKey) {
                delete updated[oldKey];
            }
            updated[newKey] = value;
            setData('specifications', updated);
            return updated;
        });
    };

    const removeSpecification = (key: string) => {
        setSpecifications(prev => {
            const updated = { ...prev };
            delete updated[key];
            setData('specifications', updated);
            return updated;
        });
    };

    return (
        <AdminLayout>
            <Head title={`Edit Product: ${product.name}`} />

            <div className="py-6">
                {/* Page Header */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Edit Product: {product.name}
                        </h1>
                        <Link
                            href={route('admin.products.index')}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                        >
                            Back to Products
                        </Link>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                    Basic Information
                                </h3>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="name" value="Product Name *" />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            className="mt-1 block w-full"
                                            autoComplete="name"
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="category_id" value="Category *" />
                                        <select
                                            id="category_id"
                                            name="category_id"
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', parseInt(e.target.value))}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.category_id} className="mt-2" />
                                    </div>

                                    <div className="col-span-2">
                                        <InputLabel htmlFor="short_description" value="Short Description" />
                                        <textarea
                                            id="short_description"
                                            name="short_description"
                                            value={data.short_description}
                                            onChange={(e) => setData('short_description', e.target.value)}
                                            rows={2}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Brief product description for listings"
                                        />
                                        <InputError message={errors.short_description} className="mt-2" />
                                    </div>

                                    <div className="col-span-2">
                                        <InputLabel htmlFor="description" value="Description" />
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={4}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Detailed product description"
                                        />
                                        <InputError message={errors.description} className="mt-2" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                    Pricing
                                </h3>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="price" value="Regular Price (₹) *" />
                                        <TextInput
                                            id="price"
                                            type="number"
                                            name="price"
                                            value={data.price}
                                            className="mt-1 block w-full"
                                            step="0.01"
                                            min="0"
                                            onChange={(e) => setData('price', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.price} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="sale_price" value="Sale Price (₹)" />
                                        <TextInput
                                            id="sale_price"
                                            type="number"
                                            name="sale_price"
                                            value={data.sale_price}
                                            className="mt-1 block w-full"
                                            step="0.01"
                                            min="0"
                                            onChange={(e) => setData('sale_price', e.target.value)}
                                        />
                                        <InputError message={errors.sale_price} className="mt-2" />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Leave empty if no sale price
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inventory */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                    Inventory Management
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <input
                                            id="manage_stock"
                                            name="manage_stock"
                                            type="checkbox"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            checked={manageStock}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setManageStock(checked);
                                                setData(prev => ({ ...prev, manage_stock: checked }));
                                            }}
                                        />
                                        <label htmlFor="manage_stock" className="ml-2 block text-sm text-gray-900">
                                            Track stock quantity for this product
                                        </label>
                                    </div>

                                    {manageStock && (
                                        <div>
                                            <InputLabel htmlFor="stock_quantity" value="Stock Quantity" />
                                            <TextInput
                                                id="stock_quantity"
                                                type="number"
                                                name="stock_quantity"
                                                value={data.stock_quantity}
                                                className="mt-1 block w-full sm:w-48"
                                                min="0"
                                                onChange={(e) => setData('stock_quantity', e.target.value)}
                                            />
                                            <InputError message={errors.stock_quantity} className="mt-2" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Specifications */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        Product Specifications
                                    </h3>
                                    <SecondaryButton type="button" onClick={addSpecification}>
                                        Add Specification
                                    </SecondaryButton>
                                </div>
                                <div className="space-y-3">
                                    {Object.entries(specifications).map(([key, value]) => (
                                        <div key={key} className="flex gap-3 items-start">
                                            <div className="flex-1">
                                                <TextInput
                                                    type="text"
                                                    placeholder="Specification name (e.g., Material, Dimensions)"
                                                    value={key.startsWith('spec_') ? '' : key}
                                                    onChange={(e) => updateSpecification(key, e.target.value, value)}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <TextInput
                                                    type="text"
                                                    placeholder="Specification value"
                                                    value={value}
                                                    onChange={(e) => updateSpecification(key, key, e.target.value)}
                                                    className="w-full"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeSpecification(key)}
                                                className="text-red-600 hover:text-red-800 p-2"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    {Object.keys(specifications).length === 0 && (
                                        <p className="text-gray-500 text-sm">
                                            No specifications added yet. Click "Add Specification" to get started.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Status & Settings */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                    Status & Settings
                                </h3>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="status" value="Product Status *" />
                                        <select
                                            id="status"
                                            name="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                        <InputError message={errors.status} className="mt-2" />
                                    </div>

                                    <div className="flex items-center pt-6">
                                        <input
                                            id="featured"
                                            name="featured"
                                            type="checkbox"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            checked={data.featured}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setData(prev => ({ ...prev, featured: checked }));
                                            }}
                                        />
                                        <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                                            Featured Product
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SEO */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                    SEO Settings
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="meta_title" value="Meta Title" />
                                        <TextInput
                                            id="meta_title"
                                            type="text"
                                            name="meta_title"
                                            value={data.meta_title}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('meta_title', e.target.value)}
                                        />
                                        <InputError message={errors.meta_title} className="mt-2" />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Recommended length: 50-60 characters
                                        </p>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="meta_description" value="Meta Description" />
                                        <textarea
                                            id="meta_description"
                                            name="meta_description"
                                            value={data.meta_description}
                                            onChange={(e) => setData('meta_description', e.target.value)}
                                            rows={3}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Brief description for search engines"
                                        />
                                        <InputError message={errors.meta_description} className="mt-2" />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Recommended length: 150-160 characters
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end space-x-3">
                            <Link
                                href={route('admin.products.show', product.id)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                            >
                                Cancel
                            </Link>
                            <PrimaryButton className="ml-4" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Product'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
