import React, { FormEventHandler } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Category } from '@/types';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';

interface Props {
    categories: Category[];
}

export default function Create({ categories }: Props) {
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
        post(route('admin.products.store'), {
            onSuccess: () => reset(),
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

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold text-gray-900">Create Product</h1>
                                <Link
                                    href={route('admin.products.index')}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    ← Back to Products
                                </Link>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="name" value="Product Name" />
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="mt-1 block w-full"
                                            isFocused={true}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="short_description" value="Short Description" />
                                        <textarea
                                            id="short_description"
                                            name="short_description"
                                            value={data.short_description}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            rows={2}
                                            onChange={(e) => setData('short_description', e.target.value)}
                                            placeholder="Brief product description for listings"
                                        />
                                        <InputError message={errors.short_description} className="mt-2" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="description" value="Description" />
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={data.description}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            rows={4}
                                            onChange={(e) => setData('description', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.description} className="mt-2" />
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <div>
                                        <InputLabel htmlFor="price" value="Regular Price (₹)" />
                                        <TextInput
                                            id="price"
                                            name="price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.price}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('price', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.price} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="sale_price" value="Sale Price (₹)" />
                                        <TextInput
                                            id="sale_price"
                                            name="sale_price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.sale_price}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('sale_price', e.target.value)}
                                        />
                                        <InputError message={errors.sale_price} className="mt-2" />
                                        <p className="mt-1 text-sm text-gray-500">Optional. Must be less than regular price.</p>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="category_id" value="Category" />
                                        <select
                                            id="category_id"
                                            name="category_id"
                                            value={data.category_id}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            onChange={(e) => setData('category_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.parent ? `${category.parent.name} > ${category.name}` : category.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.category_id} className="mt-2" />
                                    </div>
                                </div>

                                {/* Inventory Management */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Management</h3>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                        <div className="sm:col-span-3">
                                            <div className="flex items-center">
                                                <input
                                                    id="manage_stock"
                                                    name="manage_stock"
                                                    type="checkbox"
                                                    checked={data.manage_stock}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    onChange={(e) => setData('manage_stock', e.target.checked)}
                                                />
                                                <InputLabel
                                                    htmlFor="manage_stock"
                                                    value="Track Stock Quantity"
                                                    className="ml-2"
                                                />
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Uncheck for unlimited stock items (like digital products or fresh flowers)
                                            </p>
                                        </div>

                                        {data.manage_stock && (
                                            <>
                                                <div>
                                                    <InputLabel htmlFor="stock_quantity" value="Stock Quantity" />
                                                    <TextInput
                                                        id="stock_quantity"
                                                        name="stock_quantity"
                                                        type="number"
                                                        min="0"
                                                        value={data.stock_quantity.toString()}
                                                        className="mt-1 block w-full"
                                                        onChange={(e) => setData('stock_quantity', parseInt(e.target.value) || 0)}
                                                    />
                                                    <InputError message={errors.stock_quantity} className="mt-2" />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <div className="flex items-center">
                                                        <input
                                                            id="allow_backorders"
                                                            name="allow_backorders"
                                                            type="checkbox"
                                                            checked={data.allow_backorders}
                                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                            onChange={(e) => setData('allow_backorders', e.target.checked)}
                                                        />
                                                        <InputLabel
                                                            htmlFor="allow_backorders"
                                                            value="Allow Backorders"
                                                            className="ml-2"
                                                        />
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Allow customers to order when out of stock
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <InputLabel htmlFor="weight" value="Weight (kg)" />
                                            <TextInput
                                                id="weight"
                                                name="weight"
                                                type="number"
                                                step="0.001"
                                                min="0"
                                                value={data.weight}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('weight', e.target.value)}
                                            />
                                            <InputError message={errors.weight} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Specifications */}
                                <div className="border-t pt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">Specifications</h3>
                                        <button
                                            type="button"
                                            onClick={addSpecification}
                                            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded"
                                        >
                                            + Add Specification
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {Object.entries(data.specifications).map(([key, value]) => (
                                            <div key={key} className="flex items-center space-x-3">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        {key}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={value}
                                                        onChange={(e) => updateSpecification(key, e.target.value)}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        placeholder={`Enter ${key.toLowerCase()}`}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSpecification(key)}
                                                    className="text-red-600 hover:text-red-800 text-sm mt-6"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                        {Object.keys(data.specifications).length === 0 && (
                                            <p className="text-gray-500 text-sm">
                                                No specifications added. Click "Add Specification" to add product details like material, color, size, etc.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Status and Settings */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Status & Settings</h3>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                        <div>
                                            <InputLabel htmlFor="status" value="Status" />
                                            <select
                                                id="status"
                                                name="status"
                                                value={data.status}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                onChange={(e) => setData('status', e.target.value)}
                                            >
                                                <option value="draft">Draft</option>
                                                <option value="published">Published</option>
                                                <option value="archived">Archived</option>
                                            </select>
                                            <InputError message={errors.status} className="mt-2" />
                                        </div>

                                        <div>
                                            <div className="flex items-center mt-6">
                                                <input
                                                    id="is_active"
                                                    name="is_active"
                                                    type="checkbox"
                                                    checked={data.is_active}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    onChange={(e) => setData('is_active', e.target.checked)}
                                                />
                                                <InputLabel
                                                    htmlFor="is_active"
                                                    value="Active"
                                                    className="ml-2"
                                                />
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Only active products are shown to customers
                                            </p>
                                        </div>

                                        <div>
                                            <div className="flex items-center mt-6">
                                                <input
                                                    id="featured"
                                                    name="featured"
                                                    type="checkbox"
                                                    checked={data.featured}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    onChange={(e) => setData('featured', e.target.checked)}
                                                />
                                                <InputLabel
                                                    htmlFor="featured"
                                                    value="Featured Product"
                                                    className="ml-2"
                                                />
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Featured products appear prominently on the homepage
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* SEO */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <InputLabel htmlFor="meta_title" value="Meta Title" />
                                            <TextInput
                                                id="meta_title"
                                                name="meta_title"
                                                value={data.meta_title}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('meta_title', e.target.value)}
                                                placeholder="Leave blank to use product name"
                                            />
                                            <InputError message={errors.meta_title} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="meta_description" value="Meta Description" />
                                            <textarea
                                                id="meta_description"
                                                name="meta_description"
                                                value={data.meta_description}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                rows={3}
                                                onChange={(e) => setData('meta_description', e.target.value)}
                                                placeholder="Leave blank to use short description"
                                            />
                                            <InputError message={errors.meta_description} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                                    <SecondaryButton>
                                        <Link href={route('admin.products.index')}>
                                            Cancel
                                        </Link>
                                    </SecondaryButton>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Product'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
