import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    DocumentDuplicateIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline';

interface Page {
    id: number;
    title: string;
    slug: string;
    status: 'draft' | 'published' | 'scheduled';
    template: string;
    published_at?: string;
    created_at: string;
    updated_at: string;
}

interface Props extends PageProps {
    pages: {
        data: Page[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
        template?: string;
    };
    templates: { value: string; label: string }[];
    statuses: { value: string; label: string; color: string }[];
}

export default function PagesIndex({ 
    auth, 
    pages, 
    filters, 
    templates, 
    statuses 
}: Props) {
    const [selectedPages, setSelectedPages] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [templateFilter, setTemplateFilter] = useState(filters.template || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/pages', {
            search: searchTerm,
            status: statusFilter,
            template: templateFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSelectAll = () => {
        if (selectedPages.length === pages.data.length) {
            setSelectedPages([]);
        } else {
            setSelectedPages(pages.data.map(page => page.id));
        }
    };

    const handleSelectPage = (pageId: number) => {
        if (selectedPages.includes(pageId)) {
            setSelectedPages(selectedPages.filter(id => id !== pageId));
        } else {
            setSelectedPages([...selectedPages, pageId]);
        }
    };

    const handleBulkAction = (action: 'delete' | 'publish' | 'draft') => {
        if (selectedPages.length === 0) return;

        const confirmMessage = action === 'delete' 
            ? `Are you sure you want to delete ${selectedPages.length} page(s)?`
            : `Are you sure you want to ${action} ${selectedPages.length} page(s)?`;

        if (confirm(confirmMessage)) {
            router.post('/admin/pages/bulk-action', {
                action,
                page_ids: selectedPages,
            }, {
                onSuccess: () => {
                    setSelectedPages([]);
                },
            });
        }
    };

    const handleDuplicate = (page: Page) => {
        if (confirm(`Duplicate page "${page.title}"?`)) {
            router.post(`/admin/pages/${page.id}/duplicate`);
        }
    };

    const handleDelete = (page: Page) => {
        if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
            router.delete(`/admin/pages/${page.id}`);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = statuses.find(s => s.value === status);
        if (!statusConfig) return null;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                {statusConfig.label}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Pages
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage your website pages and content
                        </p>
                    </div>
                    <Link
                        href="/admin/pages/create"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        New Page
                    </Link>
                </div>
            }
        >
            <Head title="Pages" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Filters and Search */}
                        <div className="p-6 border-b border-gray-200">
                            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search pages..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <FunnelIcon className="h-5 w-5 text-gray-400" />
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">All Status</option>
                                            {statuses.map((status) => (
                                                <option key={status.value} value={status.value}>
                                                    {status.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <select
                                        value={templateFilter}
                                        onChange={(e) => setTemplateFilter(e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">All Templates</option>
                                        {templates.map((template) => (
                                            <option key={template.value} value={template.value}>
                                                {template.label}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="submit"
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        Filter
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Bulk Actions */}
                        {selectedPages.length > 0 && (
                            <div className="p-4 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        {selectedPages.length} page(s) selected
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleBulkAction('publish')}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Publish
                                        </button>
                                        <button
                                            onClick={() => handleBulkAction('draft')}
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Draft
                                        </button>
                                        <button
                                            onClick={() => handleBulkAction('delete')}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center"
                                        >
                                            <TrashIcon className="h-4 w-4 mr-1" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pages Table */}
                        <div className="overflow-x-auto">
                            {pages.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <DocumentDuplicateIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No pages found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Get started by creating your first page.
                                    </p>
                                    <div className="mt-6">
                                        <Link
                                            href="/admin/pages/create"
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                                        >
                                            <PlusIcon className="h-4 w-4 mr-2" />
                                            Create Page
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPages.length === pages.data.length}
                                                    onChange={handleSelectAll}
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                />
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Template
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {pages.data.map((page) => (
                                            <tr key={page.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPages.includes(page.id)}
                                                        onChange={() => handleSelectPage(page.id)}
                                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <Link
                                                            href={`/admin/pages/${page.id}/edit`}
                                                            className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                                                        >
                                                            {page.title}
                                                        </Link>
                                                        <span className="text-xs text-gray-500">
                                                            /{page.slug}
                                                        </span>
                                                        {page.published_at && (
                                                            <div className="flex items-center mt-1 text-xs text-gray-500">
                                                                <CalendarIcon className="h-3 w-3 mr-1" />
                                                                Published: {formatDate(page.published_at)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(page.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {templates.find(t => t.value === page.template)?.label || page.template}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(page.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={`/pages/${page.slug}`}
                                                            target="_blank"
                                                            className="text-gray-400 hover:text-gray-600"
                                                            title="View page"
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                        </Link>
                                                        <Link
                                                            href={`/admin/pages/${page.id}/edit`}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            title="Edit page"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDuplicate(page)}
                                                            className="text-green-600 hover:text-green-900"
                                                            title="Duplicate page"
                                                        >
                                                            <DocumentDuplicateIcon className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(page)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Delete page"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Pagination */}
                        {pages.last_page > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {((pages.current_page - 1) * pages.per_page) + 1} to{' '}
                                        {Math.min(pages.current_page * pages.per_page, pages.total)} of{' '}
                                        {pages.total} results
                                    </div>
                                    <div className="flex space-x-2">
                                        {pages.current_page > 1 && (
                                            <Link
                                                href={`/admin/pages?page=${pages.current_page - 1}`}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                            >
                                                Previous
                                            </Link>
                                        )}
                                        {pages.current_page < pages.last_page && (
                                            <Link
                                                href={`/admin/pages?page=${pages.current_page + 1}`}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                            >
                                                Next
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
