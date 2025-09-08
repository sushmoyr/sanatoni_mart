import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';

interface Newsletter {
    id: number;
    subject: string;
    content: string;
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
    scheduled_at?: string;
    sent_at?: string;
    subscriber_count: number;
    sent_count: number;
    open_count: number;
    click_count: number;
    created_at: string;
    updated_at: string;
}

interface Props extends PageProps {
    newsletters: {
        data: Newsletter[];
        links: any[];
        meta: any;
    };
    stats: {
        total: number;
        sent: number;
        draft: number;
        scheduled: number;
        total_subscribers: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ newsletters, stats, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = () => {
        router.get(route('admin.newsletters.index'), {
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
        router.get(route('admin.newsletters.index'));
    };

    const sendNewsletter = (newsletter: Newsletter) => {
        if (confirm(`Send newsletter "${newsletter.subject}" to ${newsletter.subscriber_count} subscribers?`)) {
            router.post(route('admin.newsletters.send-now', newsletter.id), {}, {
                preserveScroll: true,
            });
        }
    };

    const duplicateNewsletter = (newsletter: Newsletter) => {
        router.post(route('admin.newsletters.duplicate', newsletter.id), {}, {
            preserveScroll: true,
        });
    };

    const getStatusBadge = (newsletter: Newsletter) => {
        const statusConfig = {
            draft: { label: 'Draft', className: 'bg-gray-100 text-gray-800' },
            scheduled: { label: 'Scheduled', className: 'bg-blue-100 text-blue-800' },
            sending: { label: 'Sending', className: 'bg-yellow-100 text-yellow-800' },
            sent: { label: 'Sent', className: 'bg-green-100 text-green-800' },
            failed: { label: 'Failed', className: 'bg-red-100 text-red-800' },
        };

        const config = statusConfig[newsletter.status];
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
                {config.label}
            </span>
        );
    };

    const getEngagementRate = (newsletter: Newsletter) => {
        if (newsletter.sent_count === 0) return 0;
        return ((newsletter.open_count / newsletter.sent_count) * 100).toFixed(1);
    };

    const getClickRate = (newsletter: Newsletter) => {
        if (newsletter.open_count === 0) return 0;
        return ((newsletter.click_count / newsletter.open_count) * 100).toFixed(1);
    };

    return (
        <AdminLayout>
            <Head title="Newsletters" />

            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold leading-6 text-gray-900">Newsletters</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Create and manage email newsletters for your subscribers
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none space-x-3">
                        <Link
                            href={route('admin.newsletters.subscriber-analytics')}
                            className="inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                        >
                            Subscriber Analytics
                        </Link>
                        <Link
                            href={route('admin.newsletters.create')}
                            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            Create Newsletter
                        </Link>
                    </div>
                </div>

                {/* Statistics */}
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-5">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <span className="text-2xl">📧</span>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Newsletters</dt>
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
                                    <span className="text-2xl">✅</span>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Sent</dt>
                                        <dd className="text-lg font-medium text-green-600">{stats.sent}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <span className="text-2xl">📝</span>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Draft</dt>
                                        <dd className="text-lg font-medium text-gray-600">{stats.draft}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <span className="text-2xl">🕒</span>
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
                                    <span className="text-2xl">👥</span>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Subscribers</dt>
                                        <dd className="text-lg font-medium text-purple-600">{stats.total_subscribers}</dd>
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
                                placeholder="Search by subject..."
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
                                <option value="draft">Draft</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="sending">Sending</option>
                                <option value="sent">Sent</option>
                                <option value="failed">Failed</option>
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

                {/* Newsletters Table */}
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Newsletter
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Recipients
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Engagement
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Schedule
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
                                        {newsletters?.data?.length > 0 ? (
                                            newsletters.data.map((newsletter) => (
                                                <tr key={newsletter.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {newsletter.subject}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    Created: {new Date(newsletter.created_at).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <div>
                                                            <div>Total: {newsletter.subscriber_count}</div>
                                                            <div className="text-gray-500">Sent: {newsletter.sent_count}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {newsletter.status === 'sent' ? (
                                                            <div>
                                                                <div>Opens: {newsletter.open_count} ({getEngagementRate(newsletter)}%)</div>
                                                                <div>Clicks: {newsletter.click_count} ({getClickRate(newsletter)}%)</div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">Not sent yet</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {newsletter.scheduled_at ? (
                                                            <div>
                                                                <div>Scheduled</div>
                                                                <div>{new Date(newsletter.scheduled_at).toLocaleString()}</div>
                                                            </div>
                                                        ) : newsletter.sent_at ? (
                                                            <div>
                                                                <div>Sent</div>
                                                                <div>{new Date(newsletter.sent_at).toLocaleString()}</div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">Not scheduled</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(newsletter)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                        <Link
                                                            href={route('admin.newsletters.show', newsletter.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            View
                                                        </Link>
                                                        <Link
                                                            href={route('admin.newsletters.preview', newsletter.id)}
                                                            className="text-purple-600 hover:text-purple-900"
                                                            target="_blank"
                                                        >
                                                            Preview
                                                        </Link>
                                                        {newsletter.status === 'draft' && (
                                                            <>
                                                                <Link
                                                                    href={route('admin.newsletters.edit', newsletter.id)}
                                                                    className="text-green-600 hover:text-green-900"
                                                                >
                                                                    Edit
                                                                </Link>
                                                                <button
                                                                    onClick={() => sendNewsletter(newsletter)}
                                                                    className="text-orange-600 hover:text-orange-900"
                                                                >
                                                                    Send Now
                                                                </button>
                                                            </>
                                                        )}
                                                        <button
                                                            onClick={() => duplicateNewsletter(newsletter)}
                                                            className="text-gray-600 hover:text-gray-900"
                                                        >
                                                            Duplicate
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
                                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No newsletters found</h3>
                                                        <p className="mt-1 text-sm text-gray-500">Get started by creating your first newsletter.</p>
                                                        <div className="mt-6">
                                                            <Link
                                                                href={route('admin.newsletters.create')}
                                                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                            >
                                                                Create Newsletter
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
                {newsletters?.meta?.last_page > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                            {newsletters?.links?.find(link => link.label === 'Previous') && (
                                <Link
                                    href={newsletters.links.find(link => link.label === 'Previous').url}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Previous
                                </Link>
                            )}
                            {newsletters?.links?.find(link => link.label === 'Next') && (
                                <Link
                                    href={newsletters.links.find(link => link.label === 'Next').url}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{newsletters?.meta?.from || 0}</span> to{' '}
                                    <span className="font-medium">{newsletters?.meta?.to || 0}</span> of{' '}
                                    <span className="font-medium">{newsletters?.meta?.total || 0}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    {newsletters?.links?.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                link.active
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            } ${index === 0 ? 'rounded-l-md' : ''} ${
                                                index === newsletters.links.length - 1 ? 'rounded-r-md' : ''
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
