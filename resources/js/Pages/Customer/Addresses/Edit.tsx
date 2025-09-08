import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Card, Button, Input } from '@/Components/ui';
import { 
    MapPinIcon,
    HomeIcon,
    BuildingOfficeIcon,
    EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';

interface Address {
    id: number;
    type: 'home' | 'work' | 'other';
    name?: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    is_default: boolean;
}

interface AddressEditProps extends PageProps {
    address: Address;
}

export default function AddressEdit({ auth, address }: AddressEditProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        type: address.type,
        name: address.name || '',
        address_line_1: address.address_line_1,
        address_line_2: address.address_line_2 || '',
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country,
        is_default: address.is_default
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('addresses.update', address.id));
    };

    const addressTypes = [
        { value: 'home', label: 'Home', icon: HomeIcon },
        { value: 'work', label: 'Work', icon: BuildingOfficeIcon },
        { value: 'other', label: 'Other', icon: EllipsisHorizontalIcon }
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Edit Address" />

            <div className="py-12">
                <div className="container-custom max-w-2xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                            Edit Address
                        </h1>
                        <p className="text-semantic-textSub">
                            Update your address details
                        </p>
                    </div>

                    <Card>
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Address Type */}
                                <div>
                                    <label className="block text-sm font-medium text-semantic-text mb-3">
                                        Address Type *
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {addressTypes.map((type) => {
                                            const Icon = type.icon;
                                            const isSelected = data.type === type.value;
                                            
                                            return (
                                                <button
                                                    key={type.value}
                                                    type="button"
                                                    onClick={() => setData('type', type.value as any)}
                                                    className={`p-4 border-2 rounded-lg transition-all ${
                                                        isSelected
                                                            ? 'border-brand-500 bg-brand-50 text-brand-700'
                                                            : 'border-semantic-border hover:border-brand-300 text-semantic-textSub'
                                                    }`}
                                                >
                                                    <Icon className="w-6 h-6 mx-auto mb-2" />
                                                    <span className="text-sm font-medium">{type.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.type && (
                                        <p className="mt-1 text-sm text-danger-600">{errors.type}</p>
                                    )}
                                </div>

                                {/* Address Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-semantic-text mb-2">
                                        Address Name (Optional)
                                    </label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        error={errors.name}
                                        placeholder="e.g., Home, Office, Mom's House"
                                        className="w-full"
                                    />
                                    <p className="mt-1 text-xs text-semantic-textSub">
                                        Give this address a memorable name
                                    </p>
                                </div>

                                {/* Address Lines */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label htmlFor="address_line_1" className="block text-sm font-medium text-semantic-text mb-2">
                                            Address Line 1 *
                                        </label>
                                        <Input
                                            id="address_line_1"
                                            type="text"
                                            value={data.address_line_1}
                                            onChange={(e) => setData('address_line_1', e.target.value)}
                                            error={errors.address_line_1}
                                            placeholder="Street address, house number"
                                            required
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="address_line_2" className="block text-sm font-medium text-semantic-text mb-2">
                                            Address Line 2 (Optional)
                                        </label>
                                        <Input
                                            id="address_line_2"
                                            type="text"
                                            value={data.address_line_2}
                                            onChange={(e) => setData('address_line_2', e.target.value)}
                                            error={errors.address_line_2}
                                            placeholder="Apartment, suite, floor, etc."
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                {/* City and State */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-semantic-text mb-2">
                                            City *
                                        </label>
                                        <Input
                                            id="city"
                                            type="text"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            error={errors.city}
                                            placeholder="e.g., Dhaka"
                                            required
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-semantic-text mb-2">
                                            State/Division *
                                        </label>
                                        <Input
                                            id="state"
                                            type="text"
                                            value={data.state}
                                            onChange={(e) => setData('state', e.target.value)}
                                            error={errors.state}
                                            placeholder="e.g., Dhaka Division"
                                            required
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                {/* Postal Code and Country */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="postal_code" className="block text-sm font-medium text-semantic-text mb-2">
                                            Postal Code *
                                        </label>
                                        <Input
                                            id="postal_code"
                                            type="text"
                                            value={data.postal_code}
                                            onChange={(e) => setData('postal_code', e.target.value)}
                                            error={errors.postal_code}
                                            placeholder="e.g., 1000"
                                            required
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-semantic-text mb-2">
                                            Country *
                                        </label>
                                        <select
                                            id="country"
                                            value={data.country}
                                            onChange={(e) => setData('country', e.target.value)}
                                            className="w-full px-3 py-2 border border-semantic-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                            required
                                        >
                                            <option value="Bangladesh">Bangladesh</option>
                                            <option value="India">India</option>
                                            <option value="Pakistan">Pakistan</option>
                                            <option value="Nepal">Nepal</option>
                                            <option value="Sri Lanka">Sri Lanka</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {errors.country && (
                                            <p className="mt-1 text-sm text-danger-600">{errors.country}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Default Address */}
                                <div className="flex items-center justify-between p-4 bg-semantic-surface rounded-lg">
                                    <div>
                                        <h4 className="text-sm font-medium text-semantic-text">Set as Default Address</h4>
                                        <p className="text-sm text-semantic-textSub">This address will be selected automatically during checkout</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.is_default}
                                            onChange={(e) => setData('is_default', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                                    </label>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="flex-1"
                                    >
                                        {processing ? 'Updating...' : 'Update Address'}
                                    </Button>
                                    
                                    <Button 
                                        type="button" 
                                        variant="secondary"
                                        onClick={() => window.history.back()}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Card>

                    {/* Delivery Info */}
                    <div className="mt-6">
                        <Card className="border-brand-200 bg-brand-50">
                            <div className="p-4">
                                <div className="flex items-start space-x-3">
                                    <MapPinIcon className="w-5 h-5 text-brand-600 mt-0.5" />
                                    <div>
                                        <h3 className="text-sm font-semibold text-brand-900 mb-1">
                                            Delivery Information
                                        </h3>
                                        <p className="text-sm text-brand-700">
                                            Make sure your address is complete and accurate. This will help our delivery partners find you easily.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
