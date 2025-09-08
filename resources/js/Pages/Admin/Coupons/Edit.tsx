import React, { useState, useEffect } from 'react';
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
}

interface Category {
    id: number;
    name: string;
}

interface Coupon {
    id: number;
    code: string;
    name: string;
    description: string | null;
    type: 'percentage' | 'fixed';
    value: number;
    minimum_order_amount: number | null;
    product_ids: number[] | null;
    category_ids: number[] | null;
    usage_limit: number | null;
    used_count: number;
    per_customer_limit: number | null;
    valid_from: string;
    valid_until: string | null;
    status: 'active' | 'inactive' | 'expired';
}

interface Props extends PageProps {
    coupon: Coupon;
    products: Product[];
    categories: Category[];
}

export default function Edit({ coupon, products, categories }: Props) {
    const [applicationType, setApplicationType] = useState<'all' | 'specific_products' | 'specific_categories'>('all');

    const { data, setData, put, processing, errors, reset } = useForm({
        code: coupon.code,
        name: coupon.name,
        description: coupon.description || '',
        type: coupon.type,
        value: coupon.value.toString(),
        minimum_order_amount: coupon.minimum_order_amount?.toString() || '',
        product_ids: coupon.product_ids || [],
        category_ids: coupon.category_ids || [],
        usage_limit: coupon.usage_limit?.toString() || '',
        per_customer_limit: coupon.per_customer_limit?.toString() || '',
        valid_from: coupon.valid_from.slice(0, 16), // Format for datetime-local input
        valid_until: coupon.valid_until?.slice(0, 16) || '',
        status: coupon.status,
    });

    // Set initial application type based on existing data
    useEffect(() => {
        if (coupon.product_ids && coupon.product_ids.length > 0) {
            setApplicationType('specific_products');
        } else if (coupon.category_ids && coupon.category_ids.length > 0) {
            setApplicationType('specific_categories');
        } else {
            setApplicationType('all');
        }
    }, [coupon]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.coupons.update', coupon.id));
    };

    const cancel = () => {
        router.get(route('admin.coupons.show', coupon.id));
    };

    return (
        <AdminLayout>
            <Head title={`Edit Coupon - ${coupon.name}`} />

            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold leading-6 text-gray-900">Edit Coupon</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Update the discount coupon details and settings
                        </p>
                    </div>
                </div>

                <div className="mt-8 bg-white shadow rounded-lg">
                    <form onSubmit={submit} className="px-6 py-6 space-y-6">
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Basic Information</h3>
                            
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <InputLabel htmlFor="name" value="Coupon Name" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        placeholder="e.g., New Year Special, Summer Sale"
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="code" value="Coupon Code" />
                                    <TextInput
                                        id="code"
                                        type="text"
                                        name="code"
                                        value={data.code}
                                        className="mt-1 block w-full"
                                        placeholder="e.g., SAVE20, WELCOME10"
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                    />
                                    <InputError message={errors.code} className="mt-2" />
                                </div>

                                <div className="sm:col-span-2">
                                    <InputLabel htmlFor="description" value="Description (Optional)" />
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="Brief description of this coupon..."
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="type" value="Discount Type" />
                                    <select
                                        id="type"
                                        name="type"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value as 'fixed' | 'percentage')}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                        <option value="percentage">Percentage Discount</option>
                                        <option value="fixed">Fixed Amount Discount</option>
                                    </select>
                                    <InputError message={errors.type} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="value" value={data.type === 'percentage' ? 'Discount Percentage' : 'Discount Amount'} />
                                    <div className="mt-1 relative">
                                        <TextInput
                                            id="value"
                                            type="number"
                                            name="value"
                                            value={data.value}
                                            step={data.type === 'percentage' ? '0.01' : '1'}
                                            min="0"
                                            max={data.type === 'percentage' ? '100' : undefined}
                                            placeholder={data.type === 'percentage' ? 'e.g., 20' : 'e.g., 500'}
                                            onChange={(e) => setData('value', e.target.value)}
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">
                                                {data.type === 'percentage' ? '%' : '৳'}
                                            </span>
                                        </div>
                                    </div>
                                    <InputError message={errors.value} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Applicability */}
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Coupon Applicability</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <fieldset>
                                        <legend className="text-base font-medium text-gray-900">Apply to:</legend>
                                        <div className="mt-4 space-y-4">
                                            <div className="flex items-center">
                                                <input
                                                    id="all_products"
                                                    name="application_type"
                                                    type="radio"
                                                    checked={applicationType === 'all'}
                                                    onChange={() => {
                                                        setApplicationType('all');
                                                        setData('product_ids', []);
                                                        setData('category_ids', []);
                                                    }}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <label htmlFor="all_products" className="ml-3 block text-sm font-medium text-gray-700">
                                                    All Products
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    id="specific_products"
                                                    name="application_type"
                                                    type="radio"
                                                    checked={applicationType === 'specific_products'}
                                                    onChange={() => {
                                                        setApplicationType('specific_products');
                                                        setData('category_ids', []);
                                                    }}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <label htmlFor="specific_products" className="ml-3 block text-sm font-medium text-gray-700">
                                                    Specific Products
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    id="specific_categories"
                                                    name="application_type"
                                                    type="radio"
                                                    checked={applicationType === 'specific_categories'}
                                                    onChange={() => {
                                                        setApplicationType('specific_categories');
                                                        setData('product_ids', []);
                                                    }}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <label htmlFor="specific_categories" className="ml-3 block text-sm font-medium text-gray-700">
                                                    Specific Categories
                                                </label>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>

                                {applicationType === 'specific_products' && (
                                    <div>
                                        <InputLabel value="Select Products" />
                                        <div className="mt-1 border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                                            {products.map((product) => (
                                                <div key={product.id} className="flex items-center py-1">
                                                    <input
                                                        id={`product-${product.id}`}
                                                        type="checkbox"
                                                        checked={data.product_ids.includes(product.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setData('product_ids', [...data.product_ids, product.id]);
                                                            } else {
                                                                setData('product_ids', data.product_ids.filter(id => id !== product.id));
                                                            }
                                                        }}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor={`product-${product.id}`} className="ml-3 text-sm text-gray-700">
                                                        <span className="font-medium">{product.name}</span>
                                                        <span className="text-gray-500"> (৳{product.price}) - {product.category?.name || 'No Category'}</span>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        <InputError message={errors.product_ids} className="mt-2" />
                                        {data.product_ids.length > 0 && (
                                            <p className="mt-1 text-sm text-green-600">{data.product_ids.length} product(s) selected</p>
                                        )}
                                    </div>
                                )}

                                {applicationType === 'specific_categories' && (
                                    <div>
                                        <InputLabel value="Select Categories" />
                                        <div className="mt-1 border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                                            {categories.map((category) => (
                                                <div key={category.id} className="flex items-center py-1">
                                                    <input
                                                        id={`category-${category.id}`}
                                                        type="checkbox"
                                                        checked={data.category_ids.includes(category.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setData('category_ids', [...data.category_ids, category.id]);
                                                            } else {
                                                                setData('category_ids', data.category_ids.filter(id => id !== category.id));
                                                            }
                                                        }}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor={`category-${category.id}`} className="ml-3 text-sm text-gray-700 font-medium">
                                                        {category.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        <InputError message={errors.category_ids} className="mt-2" />
                                        {data.category_ids.length > 0 && (
                                            <p className="mt-1 text-sm text-green-600">{data.category_ids.length} category(ies) selected</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Validity Period */}
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Validity Period</h3>
                            
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <InputLabel htmlFor="valid_from" value="Valid From" />
                                    <TextInput
                                        id="valid_from"
                                        type="datetime-local"
                                        name="valid_from"
                                        value={data.valid_from}
                                        onChange={(e) => setData('valid_from', e.target.value)}
                                    />
                                    <InputError message={errors.valid_from} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="valid_until" value="Valid Until (Optional)" />
                                    <TextInput
                                        id="valid_until"
                                        type="datetime-local"
                                        name="valid_until"
                                        value={data.valid_until}
                                        onChange={(e) => setData('valid_until', e.target.value)}
                                    />
                                    <InputError message={errors.valid_until} className="mt-2" />
                                    <p className="mt-1 text-sm text-gray-500">Leave empty for no expiry</p>
                                </div>
                            </div>
                        </div>

                        {/* Conditions & Limits */}
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Conditions & Limits</h3>
                            
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <div>
                                    <InputLabel htmlFor="minimum_order_amount" value="Minimum Order Amount (Optional)" />
                                    <div className="mt-1 relative">
                                        <TextInput
                                            id="minimum_order_amount"
                                            type="number"
                                            name="minimum_order_amount"
                                            value={data.minimum_order_amount}
                                            min="0"
                                            step="1"
                                            placeholder="e.g., 1000"
                                            onChange={(e) => setData('minimum_order_amount', e.target.value)}
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">৳</span>
                                        </div>
                                    </div>
                                    <InputError message={errors.minimum_order_amount} className="mt-2" />
                                    <p className="mt-1 text-sm text-gray-500">Minimum cart value required</p>
                                </div>

                                <div>
                                    <InputLabel htmlFor="usage_limit" value="Usage Limit (Optional)" />
                                    <TextInput
                                        id="usage_limit"
                                        type="number"
                                        name="usage_limit"
                                        value={data.usage_limit}
                                        min={coupon.used_count.toString()}
                                        step="1"
                                        placeholder="e.g., 100"
                                        onChange={(e) => setData('usage_limit', e.target.value)}
                                    />
                                    <InputError message={errors.usage_limit} className="mt-2" />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Total uses allowed (minimum: {coupon.used_count} - current usage)
                                    </p>
                                </div>

                                <div>
                                    <InputLabel htmlFor="per_customer_limit" value="Per Customer Limit (Optional)" />
                                    <TextInput
                                        id="per_customer_limit"
                                        type="number"
                                        name="per_customer_limit"
                                        value={data.per_customer_limit}
                                        min="1"
                                        step="1"
                                        placeholder="e.g., 1"
                                        onChange={(e) => setData('per_customer_limit', e.target.value)}
                                    />
                                    <InputError message={errors.per_customer_limit} className="mt-2" />
                                    <p className="mt-1 text-sm text-gray-500">Max uses per customer</p>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Status</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        id="status_active"
                                        name="status"
                                        type="radio"
                                        value="active"
                                        checked={data.status === 'active'}
                                        onChange={(e) => setData('status', e.target.value as 'active' | 'inactive')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="status_active" className="ml-2 block text-sm text-gray-900">
                                        Active
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="status_inactive"
                                        name="status"
                                        type="radio"
                                        value="inactive"
                                        checked={data.status === 'inactive'}
                                        onChange={(e) => setData('status', e.target.value as 'active' | 'inactive')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="status_inactive" className="ml-2 block text-sm text-gray-900">
                                        Inactive
                                    </label>
                                </div>
                                {coupon.status === 'expired' && (
                                    <div className="flex items-center">
                                        <input
                                            id="status_expired"
                                            name="status"
                                            type="radio"
                                            value="expired"
                                            checked={data.status === 'expired'}
                                            disabled
                                            className="h-4 w-4 text-gray-400 border-gray-300"
                                        />
                                        <label htmlFor="status_expired" className="ml-2 block text-sm text-gray-500">
                                            Expired (cannot be changed)
                                        </label>
                                    </div>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Inactive coupons cannot be used by customers
                            </p>
                        </div>

                        {/* Usage Statistics */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Usage Statistics</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Times Used:</span>
                                    <span className="ml-2 font-medium">{coupon.used_count}</span>
                                </div>
                                {coupon.usage_limit && (
                                    <div>
                                        <span className="text-gray-500">Usage Limit:</span>
                                        <span className="ml-2 font-medium">{coupon.usage_limit}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Coupon Preview</h4>
                            <div className="bg-white p-4 rounded border-2 border-dashed border-gray-300">
                                <div className="text-center">
                                    <div className="text-lg font-mono font-bold text-blue-600">
                                        {data.code || 'COUPON_CODE'}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {data.type === 'percentage' 
                                            ? `${data.value || 0}% off`
                                            : `৳${data.value || 0} off`
                                        }
                                        {data.minimum_order_amount && ` on orders above ৳${data.minimum_order_amount}`}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {applicationType === 'all' && 'Applies to all products'}
                                        {applicationType === 'specific_products' && data.product_ids.length > 0 && `Applies to ${data.product_ids.length} selected product(s)`}
                                        {applicationType === 'specific_categories' && data.category_ids.length > 0 && `Applies to ${data.category_ids.length} selected category(ies)`}
                                    </div>
                                    {data.valid_until && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            Expires: {new Date(data.valid_until).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-3">
                            <SecondaryButton type="button" onClick={cancel}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Updating...' : 'Update Coupon'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
