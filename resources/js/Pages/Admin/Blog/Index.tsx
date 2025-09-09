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
    TagIcon,
    UserIcon,
} from '@heroicons/react/24/outline';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    status: 'draft' | 'published' | 'scheduled';
    published_at?: string;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
    tags: string[];
    author?: {
        name: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Props extends PageProps {
    posts: {
        data: BlogPost[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
        category?: string;
        tag?: string;
    };
    categories: Category[];
    tags: string[];
    statuses: { value: string; label: string; color: string }[];
}

export default function BlogIndex({ 
    auth, 
    posts, 
    filters, 
    categories, 
    tags,
    statuses 
}: Props) {
    const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || '');
    const [tagFilter, setTagFilter] = useState(filters.tag || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/blog', {
            search: searchTerm,
            status: statusFilter,
            category: categoryFilter,
            tag: tagFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSelectAll = () => {
        if (selectedPosts.length === posts.data.length) {
            setSelectedPosts([]);
        } else {
            setSelectedPosts(posts.data.map(post => post.id));
        }
    };

    const handleSelectPost = (postId: number) => {
        if (selectedPosts.includes(postId)) {
            setSelectedPosts(selectedPosts.filter(id => id !== postId));
        } else {
            setSelectedPosts([...selectedPosts, postId]);
        }
    };

    const handleBulkAction = (action: 'delete' | 'publish' | 'draft') => {
        if (selectedPosts.length === 0) return;

        const confirmMessage = action === 'delete' 
            ? `Are you sure you want to delete ${selectedPosts.length} post(s)?`
            : `Are you sure you want to ${action} ${selectedPosts.length} post(s)?`;

        if (confirm(confirmMessage)) {
            router.post('/admin/blog/bulk-action', {
                action,
                post_ids: selectedPosts,
            }, {
                onSuccess: () => {
                    setSelectedPosts([]);
                },
            });
        }
    };

    const handleDuplicate = (post: BlogPost) => {
        if (confirm(`Duplicate post "${post.title}"?`)) {
            router.post(`/admin/blog/${post.id}/duplicate`);
        }
    };

    const handleDelete = (post: BlogPost) => {
        if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
            router.delete(`/admin/blog/${post.id}`);
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

    const truncateText = (text: string, maxLength: number = 100) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Blog Posts
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage your blog content and articles
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link
                            href="/admin/blog/categories"
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                        >
                            <UserIcon className="h-4 w-4 mr-2" />
                            Categories
                        </Link>
                        <Link
                            href="/admin/blog/create"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            New Post
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Blog Posts" />

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
                                        placeholder="Search posts..."
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
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.slug}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={tagFilter}
                                        onChange={(e) => setTagFilter(e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">All Tags</option>
                                        {tags.map((tag) => (
                                            <option key={tag} value={tag}>
                                                {tag}
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
                        {selectedPosts.length > 0 && (
                            <div className="p-4 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        {selectedPosts.length} post(s) selected
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

                        {/* Posts Table */}
                        <div className="overflow-x-auto">
                            {posts.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <DocumentDuplicateIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No blog posts found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Get started by creating your first blog post.
                                    </p>
                                    <div className="mt-6">
                                        <Link
                                            href="/admin/blog/create"
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                                        >
                                            <PlusIcon className="h-4 w-4 mr-2" />
                                            Create Post
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
                                                    checked={selectedPosts.length === posts.data.length}
                                                    onChange={handleSelectAll}
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                />
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Published
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {posts.data.map((post) => (
                                            <tr key={post.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPosts.includes(post.id)}
                                                        onChange={() => handleSelectPost(post.id)}
                                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <Link
                                                            href={`/admin/blog/${post.id}/edit`}
                                                            className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                                                        >
                                                            {post.title}
                                                        </Link>
                                                        <span className="text-xs text-gray-500">
                                                            /{post.slug}
                                                        </span>
                                                        {post.excerpt && (
                                                            <p className="text-xs text-gray-600 mt-1">
                                                                {truncateText(post.excerpt, 80)}
                                                            </p>
                                                        )}
                                                        {post.tags.length > 0 && (
                                                            <div className="flex items-center mt-2">
                                                                <TagIcon className="h-3 w-3 text-gray-400 mr-1" />
                                                                <div className="flex flex-wrap gap-1">
                                                                    {post.tags.slice(0, 3).map((tag) => (
                                                                        <span
                                                                            key={tag}
                                                                            className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded"
                                                                        >
                                                                            {tag}
                                                                        </span>
                                                                    ))}
                                                                    {post.tags.length > 3 && (
                                                                        <span className="text-xs text-gray-500">
                                                                            +{post.tags.length - 3} more
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {post.category ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {post.category.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">Uncategorized</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(post.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {post.published_at ? (
                                                        <div className="flex items-center">
                                                            <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                                                            {formatDate(post.published_at)}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">Not published</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={`/blog/${post.slug}`}
                                                            target="_blank"
                                                            className="text-gray-400 hover:text-gray-600"
                                                            title="View post"
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                        </Link>
                                                        <Link
                                                            href={`/admin/blog/${post.id}/edit`}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            title="Edit post"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDuplicate(post)}
                                                            className="text-green-600 hover:text-green-900"
                                                            title="Duplicate post"
                                                        >
                                                            <DocumentDuplicateIcon className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(post)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Delete post"
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
                        {posts.last_page > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {((posts.current_page - 1) * posts.per_page) + 1} to{' '}
                                        {Math.min(posts.current_page * posts.per_page, posts.total)} of{' '}
                                        {posts.total} results
                                    </div>
                                    <div className="flex space-x-2">
                                        {posts.current_page > 1 && (
                                            <Link
                                                href={`/admin/blog?page=${posts.current_page - 1}`}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                            >
                                                Previous
                                            </Link>
                                        )}
                                        {posts.current_page < posts.last_page && (
                                            <Link
                                                href={`/admin/blog?page=${posts.current_page + 1}`}
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
