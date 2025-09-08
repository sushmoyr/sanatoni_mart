import { useState, FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import { ArrowLeftIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FormData {
    name: string;
    description: string;
    areas: string[];
    shipping_cost: string;
    delivery_time_min: string;
    delivery_time_max: string;
    is_active: boolean;
}

interface Errors {
    name?: string;
    description?: string;
    areas?: string;
    'areas.*'?: string;
    shipping_cost?: string;
    delivery_time_min?: string;
    delivery_time_max?: string;
    is_active?: string;
}

export default function Create() {
    const [data, setData] = useState<FormData>({
        name: '',
        description: '',
        areas: [''],
        shipping_cost: '',
        delivery_time_min: '1',
        delivery_time_max: '3',
        is_active: true,
    });

    const [errors, setErrors] = useState<Errors>({});
    const [processing, setProcessing] = useState(false);
    const [testAddress, setTestAddress] = useState('');
    const [testResult, setTestResult] = useState<any>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        // Filter out empty areas
        const cleanedData = {
            ...data,
            areas: data.areas.filter(area => area.trim() !== ''),
        };

        router.post('/admin/shipping-zones', cleanedData, {
            onSuccess: () => {
                setProcessing(false);
            },
            onError: (errors) => {
                setErrors(errors as Errors);
                setProcessing(false);
            },
        });
    };

    const addArea = () => {
        setData(prev => ({
            ...prev,
            areas: [...prev.areas, '']
        }));
    };

    const removeArea = (index: number) => {
        setData(prev => ({
            ...prev,
            areas: prev.areas.filter((_, i) => i !== index)
        }));
    };

    const updateArea = (index: number, value: string) => {
        setData(prev => ({
            ...prev,
            areas: prev.areas.map((area, i) => i === index ? value : area)
        }));
    };

    const testAreaMatching = () => {
        if (!testAddress.trim()) return;

        router.post('/admin/shipping-zones/test-area', {
            test_address: testAddress,
            areas: data.areas.filter(area => area.trim() !== ''),
        }, {
            onSuccess: (response: any) => {
                setTestResult(response.props);
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Create Shipping Zone" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/admin/shipping-zones"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    <ArrowLeftIcon className="w-5 h-5" />
                                </Link>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Create New Shipping Zone</h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Define a new shipping zone with coverage areas and pricing
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic Information */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="name" value="Zone Name *" />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.name}
                                            onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="e.g., Inside Dhaka"
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="shipping_cost" value="Shipping Cost (৳) *" />
                                        <TextInput
                                            id="shipping_cost"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="mt-1 block w-full"
                                            value={data.shipping_cost}
                                            onChange={(e) => setData(prev => ({ ...prev, shipping_cost: e.target.value }))}
                                            placeholder="60.00"
                                        />
                                        <InputError message={errors.shipping_cost} className="mt-2" />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <InputLabel htmlFor="description" value="Description (Optional)" />
                                    <textarea
                                        id="description"
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.description}
                                        onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Describe this shipping zone..."
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>
                            </div>

                            {/* Delivery Time */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Time</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="delivery_time_min" value="Minimum Delivery Days *" />
                                        <TextInput
                                            id="delivery_time_min"
                                            type="number"
                                            min="1"
                                            max="365"
                                            className="mt-1 block w-full"
                                            value={data.delivery_time_min}
                                            onChange={(e) => setData(prev => ({ ...prev, delivery_time_min: e.target.value }))}
                                        />
                                        <InputError message={errors.delivery_time_min} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="delivery_time_max" value="Maximum Delivery Days *" />
                                        <TextInput
                                            id="delivery_time_max"
                                            type="number"
                                            min="1"
                                            max="365"
                                            className="mt-1 block w-full"
                                            value={data.delivery_time_max}
                                            onChange={(e) => setData(prev => ({ ...prev, delivery_time_max: e.target.value }))}
                                        />
                                        <InputError message={errors.delivery_time_max} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            {/* Coverage Areas */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Coverage Areas</h3>
                                    <button
                                        type="button"
                                        onClick={addArea}
                                        className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-900"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        Add Area
                                    </button>
                                </div>
                                
                                <div className="space-y-3">
                                    {data.areas.map((area, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <TextInput
                                                type="text"
                                                className="flex-1"
                                                value={area}
                                                onChange={(e) => updateArea(index, e.target.value)}
                                                placeholder="e.g., Dhaka, Gulshan, Uttara"
                                            />
                                            {data.areas.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeArea(index)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <XMarkIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <InputError message={errors.areas || errors['areas.*']} className="mt-2" />
                                
                                <p className="mt-3 text-sm text-gray-600">
                                    Add city names, districts, or areas that this zone covers. The system will match customer addresses against these areas.
                                </p>
                            </div>

                            {/* Area Testing */}
                            <div className="bg-blue-50 p-6 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Test Area Matching</h3>
                                
                                <div className="flex gap-3">
                                    <TextInput
                                        type="text"
                                        className="flex-1"
                                        value={testAddress}
                                        onChange={(e) => setTestAddress(e.target.value)}
                                        placeholder="Enter a city or area to test..."
                                    />
                                    <SecondaryButton
                                        type="button"
                                        onClick={testAreaMatching}
                                        disabled={!testAddress.trim()}
                                    >
                                        Test
                                    </SecondaryButton>
                                </div>
                                
                                {testResult && (
                                    <div className="mt-4 p-4 bg-white rounded border">
                                        <div className="text-sm">
                                            <strong>Test Address:</strong> {testResult.test_address}
                                        </div>
                                        <div className="text-sm mt-2">
                                            <strong>Match Result:</strong>{' '}
                                            {testResult.matched_zone ? (
                                                <span className="text-green-600">
                                                    Would match this zone configuration
                                                </span>
                                            ) : (
                                                <span className="text-red-600">
                                                    No match found - consider adding more area keywords
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                <p className="mt-3 text-sm text-gray-600">
                                    Test how customer addresses will match against your defined areas before saving.
                                </p>
                            </div>

                            {/* Status */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Zone Status</h3>
                                
                                <div className="flex items-center">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onChange={(e) => setData(prev => ({ ...prev, is_active: e.target.checked }))}
                                    />
                                    <label htmlFor="is_active" className="ml-2 text-sm text-gray-900">
                                        Activate this shipping zone immediately
                                    </label>
                                </div>
                                <InputError message={errors.is_active} className="mt-2" />
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                                <Link href="/admin/shipping-zones">
                                    <SecondaryButton>Cancel</SecondaryButton>
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Shipping Zone'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
