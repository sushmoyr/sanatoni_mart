import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface Props extends PageProps {
    
}

export default function Create({}: Props) {
    const [generatingCode, setGeneratingCode] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        type: 'percentage',
        value: '',
        minimum_amount: '',
        maximum_discount: '',
        usage_limit: '',
        expires_at: '',
        is_active: true,
    });

    const generateCouponCode = async () => {
        setGeneratingCode(true);
        try {
            const response = await fetch(route('admin.coupons.generate-code'));
            const result = await response.json();
            if (result.code) {
                setData('code', result.code);
            }
        } catch (error) {
            console.error('Failed to generate coupon code:', error);
        } finally {
            setGeneratingCode(false);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.coupons.store'));
    };

    const cancel = () => {
        router.get(route('admin.coupons.index'));
    };

    return (
        <AdminLayout>
            <Head title="Create Coupon" />

            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold leading-6 text-gray-900">Create Coupon</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Create a new discount coupon for promotional campaigns
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
                                    <InputLabel htmlFor="code" value="Coupon Code" />
                                    <div className="mt-1 flex">
                                        <TextInput
                                            id="code"
                                            type="text"
                                            name="code"
                                            value={data.code}
                                            className="flex-1"
                                            placeholder="e.g., SAVE20, WELCOME10"
                                            onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        />
                                        <button
                                            type="button"
                                            onClick={generateCouponCode}
                                            disabled={generatingCode}
                                            className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            {generatingCode ? 'Generating...' : 'Generate'}
                                        </button>
                                    </div>
                                    <InputError message={errors.code} className="mt-2" />
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

                                <div>
                                    <InputLabel htmlFor="expires_at" value="Expiry Date (Optional)" />
                                    <TextInput
                                        id="expires_at"
                                        type="datetime-local"
                                        name="expires_at"
                                        value={data.expires_at}
                                        onChange={(e) => setData('expires_at', e.target.value)}
                                    />
                                    <InputError message={errors.expires_at} className="mt-2" />
                                    <p className="mt-1 text-sm text-gray-500">Leave empty for no expiry</p>
                                </div>
                            </div>
                        </div>

                        {/* Conditions & Limits */}
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Conditions & Limits</h3>
                            
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <div>
                                    <InputLabel htmlFor="minimum_amount" value="Minimum Order Amount (Optional)" />
                                    <div className="mt-1 relative">
                                        <TextInput
                                            id="minimum_amount"
                                            type="number"
                                            name="minimum_amount"
                                            value={data.minimum_amount}
                                            min="0"
                                            step="1"
                                            placeholder="e.g., 1000"
                                            onChange={(e) => setData('minimum_amount', e.target.value)}
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">৳</span>
                                        </div>
                                    </div>
                                    <InputError message={errors.minimum_amount} className="mt-2" />
                                    <p className="mt-1 text-sm text-gray-500">Minimum cart value required</p>
                                </div>

                                <div>
                                    <InputLabel htmlFor="maximum_discount" value="Maximum Discount (Optional)" />
                                    <div className="mt-1 relative">
                                        <TextInput
                                            id="maximum_discount"
                                            type="number"
                                            name="maximum_discount"
                                            value={data.maximum_discount}
                                            min="0"
                                            step="1"
                                            placeholder="e.g., 2000"
                                            onChange={(e) => setData('maximum_discount', e.target.value)}
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">৳</span>
                                        </div>
                                    </div>
                                    <InputError message={errors.maximum_discount} className="mt-2" />
                                    <p className="mt-1 text-sm text-gray-500">Maximum discount cap</p>
                                </div>

                                <div>
                                    <InputLabel htmlFor="usage_limit" value="Usage Limit (Optional)" />
                                    <TextInput
                                        id="usage_limit"
                                        type="number"
                                        name="usage_limit"
                                        value={data.usage_limit}
                                        min="1"
                                        step="1"
                                        placeholder="e.g., 100"
                                        onChange={(e) => setData('usage_limit', e.target.value)}
                                    />
                                    <InputError message={errors.usage_limit} className="mt-2" />
                                    <p className="mt-1 text-sm text-gray-500">Total number of uses allowed</p>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Status</h3>
                            
                            <div className="flex items-center">
                                <input
                                    id="is_active"
                                    name="is_active"
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                    Active Coupon
                                </label>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Inactive coupons cannot be used by customers
                            </p>
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
                                        {data.minimum_amount && ` on orders above ৳${data.minimum_amount}`}
                                        {data.maximum_discount && data.type === 'percentage' && ` (max ৳${data.maximum_discount})`}
                                    </div>
                                    {data.expires_at && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            Expires: {new Date(data.expires_at).toLocaleDateString()}
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
                                {processing ? 'Creating...' : 'Create Coupon'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
