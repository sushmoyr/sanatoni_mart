import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

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
    shippingZones: {
        data: ShippingZone[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filters: {
        search: string;
        status: string;
    };
}

export default function Index({ shippingZones, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = () => {
        router.get('/admin/shipping-zones', {
            search: search || undefined,
            status: status || undefined,
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        setStatus('');
        router.get('/admin/shipping-zones');
    };

    const handleDelete = (zone: ShippingZone) => {
        if (confirm(`Are you sure you want to delete "${zone.name}"?`)) {
            router.delete(`/admin/shipping-zones/${zone.id}`);
        }
    };

    const toggleStatus = (zone: ShippingZone) => {
        router.post(`/admin/shipping-zones/${zone.id}/toggle-status`);
    };

    return (
        <AdminLayout>
            <Head title="Shipping Zones Management" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Shipping Zones Management</h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Manage shipping zones, costs, and delivery areas
                                    </p>
                                </div>
                                <Link href="/admin/shipping-zones/create">
                                    <PrimaryButton className="flex items-center gap-2">
                                        <PlusIcon className="w-4 h-4" />
                                        Add New Zone
                                    </PrimaryButton>
                                </Link>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="p-6 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Search Zones
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search by zone name..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                        <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="flex items-end gap-2">
                                    <PrimaryButton onClick={handleSearch}>
                                        Search
                                    </PrimaryButton>
                                    <SecondaryButton onClick={handleClearFilters}>
                                        Clear
                                    </SecondaryButton>
                                </div>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="p-6 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{shippingZones.total}</div>
                                    <div className="text-sm text-blue-600">Total Zones</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {shippingZones.data.filter(z => z.is_active).length}
                                    </div>
                                    <div className="text-sm text-green-600">Active Zones</div>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {shippingZones.data.filter(z => !z.is_active).length}
                                    </div>
                                    <div className="text-sm text-yellow-600">Inactive Zones</div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">
                                        ৳{Math.min(...shippingZones.data.map(z => z.shipping_cost))} - ৳{Math.max(...shippingZones.data.map(z => z.shipping_cost))}
                                    </div>
                                    <div className="text-sm text-purple-600">Cost Range</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Zones Table */}
                    <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Zone Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Coverage Areas
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Shipping Cost
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Delivery Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {shippingZones.data.map((zone) => (
                                        <tr key={zone.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{zone.name}</div>
                                                    {zone.description && (
                                                        <div className="text-sm text-gray-500">{zone.description}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {zone.areas.slice(0, 3).map((area, idx) => (
                                                        <span 
                                                            key={idx}
                                                            className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                                                        >
                                                            {area}
                                                        </span>
                                                    ))}
                                                    {zone.areas.length > 3 && (
                                                        <span className="text-xs text-gray-500">
                                                            +{zone.areas.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {zone.formatted_shipping_cost}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{zone.delivery_time_range}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => toggleStatus(zone)}
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        zone.is_active
                                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                    }`}
                                                >
                                                    {zone.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/admin/shipping-zones/${zone.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                        title="View Details"
                                                    >
                                                        <EyeIcon className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/shipping-zones/${zone.id}/edit`}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                        title="Edit Zone"
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(zone)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete Zone"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {shippingZones.last_page > 1 && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex justify-between flex-1 sm:hidden">
                                        {shippingZones.links.map((link, index) => (
                                            link.url && (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                                                        link.active
                                                            ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:text-gray-700'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )
                                        ))}
                                    </div>
                                    <div className="hidden sm:flex sm:items-center sm:justify-between w-full">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Showing <span className="font-medium">{((shippingZones.current_page - 1) * shippingZones.per_page) + 1}</span> to{' '}
                                                <span className="font-medium">
                                                    {Math.min(shippingZones.current_page * shippingZones.per_page, shippingZones.total)}
                                                </span>{' '}
                                                of <span className="font-medium">{shippingZones.total}</span> results
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {shippingZones.links.map((link, index) => (
                                                link.url ? (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        className={`relative inline-flex items-center px-3 py-2 text-sm font-medium border ${
                                                            link.active
                                                                ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:text-gray-700'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ) : (
                                                    <span
                                                        key={index}
                                                        className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-white border border-gray-300 cursor-default"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                )
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Empty State */}
                    {shippingZones.data.length === 0 && (
                        <div className="mt-6 bg-white shadow sm:rounded-lg">
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">🚚</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No shipping zones found</h3>
                                <p className="text-gray-500 mb-6">
                                    {filters.search || filters.status 
                                        ? 'No zones match your current filters. Try adjusting your search criteria.'
                                        : 'Get started by creating your first shipping zone.'
                                    }
                                </p>
                                <Link href="/admin/shipping-zones/create">
                                    <PrimaryButton>
                                        Create First Shipping Zone
                                    </PrimaryButton>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
