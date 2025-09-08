import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';

interface FlashSale {
    id: number;
    name: string;
    description?: string;
    discount_percentage: number;
    product_ids: number[];
    start_date: string;
    end_date: string;
    status: 'active' | 'inactive' | 'scheduled' | 'expired';
    is_featured: boolean;
    max_usage?: number;
    used_count: number;
    created_at: string;
    updated_at: string;
}

interface Props extends PageProps {
    flashSales: {
        data: FlashSale[];
        links: any[];
        meta: any;
    };
    stats: {
        total: number;
        active: number;
        scheduled: number;
        expired: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ flashSales, stats, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = () => {
        router.get(route('admin.flash-sales.index'), {
            search: search || undefined,
            status: status || undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setStatus('');
        router.get(route('admin.flash-sales.index'));
    };

    const toggleStatus = (flashSale: FlashSale) => {
        router.post(route('admin.flash-sales.toggle-status', flashSale.id), {}, {
            preserveScroll: true,
        });
    };

    const getStatusBadge = (flashSale: FlashSale) => {
        const now = new Date();
        const startDate = new Date(flashSale.start_date);
        const endDate = new Date(flashSale.end_date);
        
        if (flashSale.status === 'active' && now >= startDate && now <= endDate) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
        } else if (flashSale.status === 'scheduled' || now < startDate) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Scheduled</span>;
        } else if (now > endDate || flashSale.status === 'expired') {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Expired</span>;
        } else {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Inactive</span>;
        }
    };

    const getTimeRemaining = (endDate: string) => {
        const now = new Date();
        const end = new Date(endDate);
        const diff = end.getTime() - now.getTime();
        
        if (diff <= 0) return 'Expired';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) return `${days}d ${hours}h remaining`;
        return `${hours}h remaining`;
    };

    return (
        <AdminLayout>
            <Head title="Flash Sales" />

            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold leading-6 text-gray-900">Flash Sales</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Manage time-bound promotional sales with automatic discounts
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <Link
                            href={route('admin.flash-sales.create')}
                            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            Create Flash Sale
                        </Link>
                    </div>
                </div>

                {/* Statistics */}
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-4">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <span className="text-2xl">⚡</span>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                                        <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <span className="text-2xl">🟢</span>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
                                        <dd className="text-lg font-medium text-green-600">{stats.active}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <span className="text-2xl">🔵</span>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Scheduled</dt>
                                        <dd className="text-lg font-medium text-blue-600">{stats.scheduled}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <span className="text-2xl">⚫</span>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Expired</dt>
                                        <dd className="text-lg font-medium text-gray-600">{stats.expired}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mt-8 bg-white shadow rounded-lg p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                                Search
                            </label>
                            <input
                                type="text"
                                id="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name..."
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="inactive">Inactive</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>
                        <div className="flex items-end space-x-2">
                            <button
                                onClick={handleFilter}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Filter
                            </button>
                            <button
                                onClick={handleReset}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Flash Sales Table */}
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Flash Sale
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Discount
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Duration
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Usage
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {flashSales?.data?.length > 0 ? (
                                            flashSales.data.map((flashSale) => (
                                                <tr key={flashSale.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div>
                                                                <div className="flex items-center">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {flashSale.name}
                                                                    </div>
                                                                    {flashSale.is_featured && (
                                                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                            Featured
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {flashSale.product_ids.length} products
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {flashSale.discount_percentage}% off
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div>
                                                            <div>
                                                                {new Date(flashSale.start_date).toLocaleDateString()} - {new Date(flashSale.end_date).toLocaleDateString()}
                                                            </div>
                                                            <div className="text-xs">
                                                                {getTimeRemaining(flashSale.end_date)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div>
                                                            {flashSale.used_count}
                                                            {flashSale.max_usage && ` / ${flashSale.max_usage}`}
                                                        </div>
                                                        {flashSale.max_usage && (
                                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                                <div 
                                                                    className="bg-blue-600 h-2 rounded-full" 
                                                                    style={{ width: `${Math.min((flashSale.used_count / flashSale.max_usage) * 100, 100)}%` }}
                                                                ></div>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(flashSale)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                        <Link
                                                            href={route('admin.flash-sales.show', flashSale.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            View
                                                        </Link>
                                                        <Link
                                                            href={route('admin.flash-sales.edit', flashSale.id)}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => toggleStatus(flashSale)}
                                                            className="text-purple-600 hover:text-purple-900"
                                                        >
                                                            {flashSale.status === 'active' ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center">
                                                    <div className="text-gray-500">
                                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14l9 11v-7h28v-8H13z" />
                                                        </svg>
                                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No flash sales found</h3>
                                                        <p className="mt-1 text-sm text-gray-500">Get started by creating your first flash sale.</p>
                                                        <div className="mt-6">
                                                            <Link
                                                                href={route('admin.flash-sales.create')}
                                                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                            >
                                                                Create Flash Sale
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                {flashSales?.meta?.last_page > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                            {flashSales?.links?.find(link => link.label === 'Previous') && (
                                <Link
                                    href={flashSales.links.find(link => link.label === 'Previous').url}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Previous
                                </Link>
                            )}
                            {flashSales?.links?.find(link => link.label === 'Next') && (
                                <Link
                                    href={flashSales.links.find(link => link.label === 'Next').url}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{flashSales?.meta?.from || 0}</span> to{' '}
                                    <span className="font-medium">{flashSales?.meta?.to || 0}</span> of{' '}
                                    <span className="font-medium">{flashSales?.meta?.total || 0}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    {flashSales?.links?.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                link.active
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            } ${index === 0 ? 'rounded-l-md' : ''} ${
                                                index === flashSales.links.length - 1 ? 'rounded-r-md' : ''
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
