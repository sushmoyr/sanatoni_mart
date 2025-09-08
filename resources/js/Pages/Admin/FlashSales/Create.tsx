import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface Product {
    id: number;
    name: string;
    price: number;
    sku: string;
    category: {
        id: number;
        name: string;
    };
    images: Array<{
        id: number;
        image_path: string;
        is_primary: boolean;
    }>;
}

interface Props extends PageProps {
    products?: Product[];
}

export default function Create({ products = [] }: Props) {
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        discount_percentage: '',
        product_ids: [] as number[],
        start_date: '',
        end_date: '',
        max_usage: '',
        is_featured: false,
    });

    const filteredProducts = products?.filter(product =>
        product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleProductSelect = (productId: number) => {
        const newSelection = selectedProducts.includes(productId)
            ? selectedProducts.filter(id => id !== productId)
            : [...selectedProducts, productId];
        
        setSelectedProducts(newSelection);
        setData('product_ids', newSelection);
    };

    const handleSelectAll = () => {
        const allIds = filteredProducts.map(p => p.id);
        setSelectedProducts(allIds);
        setData('product_ids', allIds);
    };

    const handleClearAll = () => {
        setSelectedProducts([]);
        setData('product_ids', []);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.flash-sales.store'));
    };

    return (
        <AdminLayout>
            <Head title="Create Flash Sale" />

            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold leading-6 text-gray-900">Create Flash Sale</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Create a new time-bound promotional sale with automatic discounts
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="mt-8 space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h3>
                        
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="name" value="Flash Sale Name" className="required" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="e.g., Weekend Flash Sale"
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="discount_percentage" value="Discount Percentage" className="required" />
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <TextInput
                                        id="discount_percentage"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="99.99"
                                        value={data.discount_percentage}
                                        onChange={(e) => setData('discount_percentage', e.target.value)}
                                        className="block w-full pr-10"
                                        placeholder="0.00"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">%</span>
                                    </div>
                                </div>
                                <InputError message={errors.discount_percentage} className="mt-2" />
                            </div>

                            <div className="col-span-2">
                                <InputLabel htmlFor="description" value="Description" />
                                <textarea
                                    id="description"
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    placeholder="Optional description for this flash sale..."
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    {/* Schedule & Limits */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-6">Schedule & Limits</h3>
                        
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                            <div>
                                <InputLabel htmlFor="start_date" value="Start Date & Time" className="required" />
                                <TextInput
                                    id="start_date"
                                    type="datetime-local"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.start_date} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="end_date" value="End Date & Time" className="required" />
                                <TextInput
                                    id="end_date"
                                    type="datetime-local"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.end_date} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="max_usage" value="Maximum Usage Limit" />
                                <TextInput
                                    id="max_usage"
                                    type="number"
                                    min="1"
                                    value={data.max_usage}
                                    onChange={(e) => setData('max_usage', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="Unlimited"
                                />
                                <p className="mt-1 text-sm text-gray-500">Leave empty for unlimited usage</p>
                                <InputError message={errors.max_usage} className="mt-2" />
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center">
                                <input
                                    id="is_featured"
                                    type="checkbox"
                                    checked={data.is_featured}
                                    onChange={(e) => setData('is_featured', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                                    Featured Flash Sale
                                </label>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">Featured sales will be highlighted on the homepage</p>
                        </div>
                    </div>

                    {/* Product Selection */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-medium text-gray-900">Product Selection</h3>
                            <div className="text-sm text-gray-500">
                                {selectedProducts.length} of {products?.length || 0} products selected
                            </div>
                        </div>

                        {/* Search and Bulk Actions */}
                        <div className="mb-6 flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <TextInput
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search products by name or SKU..."
                                    className="w-full"
                                />
                            </div>
                            <div className="flex gap-2">
                                <SecondaryButton onClick={handleSelectAll} type="button">
                                    Select All ({filteredProducts.length})
                                </SecondaryButton>
                                <SecondaryButton onClick={handleClearAll} type="button">
                                    Clear All
                                </SecondaryButton>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
                            <div className="grid grid-cols-1 divide-y divide-gray-200">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className={`p-4 hover:bg-gray-50 cursor-pointer ${
                                            selectedProducts.includes(product.id) ? 'bg-blue-50' : ''
                                        }`}
                                        onClick={() => handleProductSelect(product.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.includes(product.id)}
                                                    onChange={() => handleProductSelect(product.id)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                {product?.images?.length > 0 && (
                                                    <img
                                                        src={`/storage/${product.images[0].image_path}`}
                                                        alt={product?.name}
                                                        className="h-12 w-12 object-cover rounded"
                                                    />
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {product?.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        SKU: {product?.sku} | Category: {product?.category?.name}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                ৳{product?.price}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-sm text-gray-500">No products found</div>
                            </div>
                        )}

                        <InputError message={errors.product_ids} className="mt-2" />
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3">
                        <SecondaryButton
                            type="button"
                            onClick={() => router.get(route('admin.flash-sales.index'))}
                        >
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Creating...' : 'Create Flash Sale'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
