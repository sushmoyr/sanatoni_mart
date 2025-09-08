import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { ArrowLeftIcon, PencilIcon, MapPinIcon, ClockIcon, CurrencyBangladeshiIcon } from '@heroicons/react/24/outline';

interface ShippingZone {
    id: number;
    name: string;
    description: string | null;
    areas: string[];
    shipping_cost: number;
    delivery_time_min: number;
    delivery_time_max: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    formatted_shipping_cost: string;
    delivery_time_range: string;
}

interface Props {
    shippingZone: ShippingZone;
}

export default function Show({ shippingZone }: Props) {
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${shippingZone.name}"? This action cannot be undone.`)) {
            router.delete(`/admin/shipping-zones/${shippingZone.id}`);
        }
    };

    const toggleStatus = () => {
        router.post(`/admin/shipping-zones/${shippingZone.id}/toggle-status`);
    };

    return (
        <AdminLayout>
            <Head title={`Shipping Zone: ${shippingZone.name}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Link
                                        href="/admin/shipping-zones"
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        <ArrowLeftIcon className="w-5 h-5" />
                                    </Link>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                            {shippingZone.name}
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                shippingZone.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {shippingZone.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </h2>
                                        {shippingZone.description && (
                                            <p className="mt-1 text-sm text-gray-600">{shippingZone.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <SecondaryButton onClick={toggleStatus}>
                                        {shippingZone.is_active ? 'Deactivate' : 'Activate'}
                                    </SecondaryButton>
                                    <Link href={`/admin/shipping-zones/${shippingZone.id}/edit`}>
                                        <PrimaryButton className="flex items-center gap-2">
                                            <PencilIcon className="w-4 h-4" />
                                            Edit Zone
                                        </PrimaryButton>
                                    </Link>
                                    <DangerButton onClick={handleDelete}>
                                        Delete
                                    </DangerButton>
                                </div>
                            </div>
                        </div>

                        {/* Zone Details */}
                        <div className="p-6">
                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-blue-50 p-6 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <CurrencyBangladeshiIcon className="w-8 h-8 text-blue-600" />
                                        <div>
                                            <div className="text-2xl font-bold text-blue-600">
                                                {shippingZone.formatted_shipping_cost}
                                            </div>
                                            <div className="text-sm text-blue-600">Shipping Cost</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-50 p-6 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <ClockIcon className="w-8 h-8 text-green-600" />
                                        <div>
                                            <div className="text-2xl font-bold text-green-600">
                                                {shippingZone.delivery_time_range}
                                            </div>
                                            <div className="text-sm text-green-600">Delivery Time</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-purple-50 p-6 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <MapPinIcon className="w-8 h-8 text-purple-600" />
                                        <div>
                                            <div className="text-2xl font-bold text-purple-600">
                                                {shippingZone.areas.length}
                                            </div>
                                            <div className="text-sm text-purple-600">Coverage Areas</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Coverage Areas */}
                            <div className="bg-gray-50 p-6 rounded-lg mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <MapPinIcon className="w-5 h-5" />
                                    Coverage Areas
                                </h3>
                                
                                {shippingZone.areas.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {shippingZone.areas.map((area, index) => (
                                            <div
                                                key={index}
                                                className="bg-white p-3 rounded border border-gray-200 text-sm font-medium text-gray-700"
                                            >
                                                {area}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-center py-8">
                                        No coverage areas defined for this zone.
                                    </div>
                                )}
                            </div>

                            {/* Delivery Details */}
                            <div className="bg-gray-50 p-6 rounded-lg mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <ClockIcon className="w-5 h-5" />
                                    Delivery Information
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 mb-1">Minimum Delivery Days</div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {shippingZone.delivery_time_min} day{shippingZone.delivery_time_min !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 mb-1">Maximum Delivery Days</div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {shippingZone.delivery_time_max} day{shippingZone.delivery_time_max !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 mb-1">Shipping Cost</div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            ৳{shippingZone.shipping_cost.toFixed(2)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 mb-1">Status</div>
                                        <div className={`text-lg font-semibold ${
                                            shippingZone.is_active ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {shippingZone.is_active ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Zone History */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Zone Information</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 mb-1">Zone ID</div>
                                        <div className="text-lg font-semibold text-gray-900">#{shippingZone.id}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 mb-1">Created Date</div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {new Date(shippingZone.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 mb-1">Last Updated</div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {new Date(shippingZone.updated_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 mb-1">Coverage Summary</div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {shippingZone.areas.length} area{shippingZone.areas.length !== 1 ? 's' : ''} covered
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Zone Actions</h3>
                                    <p className="text-sm text-gray-600">Manage this shipping zone</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Link href="/admin/shipping-zones">
                                        <SecondaryButton>Back to Zones</SecondaryButton>
                                    </Link>
                                    <Link href={`/admin/shipping-zones/${shippingZone.id}/edit`}>
                                        <PrimaryButton>Edit Zone</PrimaryButton>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
