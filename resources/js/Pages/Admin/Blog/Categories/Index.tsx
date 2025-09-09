import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    FolderIcon,
    ArrowLeftIcon,
} from '@heroicons/react/24/outline';

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    posts_count: number;
    created_at: string;
    updated_at: string;
}

interface CategoryData {
    name: string;
    slug: string;
    description?: string;
}

interface Props extends PageProps {
    categories: Category[];
}

export default function BlogCategories({ auth, categories }: Props) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm<CategoryData>({
        name: '',
        slug: '',
        description: '',
    });

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const handleNameChange = (name: string) => {
        setData(prev => ({
            ...prev,
            name,
            slug: prev.slug || generateSlug(name),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingCategory) {
            put(`/admin/blog/categories/${editingCategory.id}`, {
                onSuccess: () => {
                    reset();
                    setEditingCategory(null);
                },
            });
        } else {
            post('/admin/blog/categories', {
                onSuccess: () => {
                    reset();
                    setIsCreating(false);
                },
            });
        }
    };

    const handleEdit = (category: Category) => {
        setData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
        });
        setEditingCategory(category);
        setIsCreating(false);
    };

    const handleDelete = (category: Category) => {
        if (category.posts_count > 0) {
            alert(`Cannot delete category "${category.name}" because it has ${category.posts_count} posts.`);
            return;
        }

        if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
            router.delete(`/admin/blog/categories/${category.id}`);
        }
    };

    const handleCancel = () => {
        reset();
        setIsCreating(false);
        setEditingCategory(null);
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
                    <div className="flex items-center">
                        <button
                            onClick={() => router.visit('/admin/blog')}
                            className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                        <div>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                Blog Categories
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Organize your blog posts into categories
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setIsCreating(true);
                            setEditingCategory(null);
                            reset();
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        New Category
                    </button>
                </div>
            }
        >
            <Head title="Blog Categories" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Category Form */}
                        {(isCreating || editingCategory) && (
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="p-6 border-b border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {editingCategory ? 'Edit Category' : 'Create New Category'}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {editingCategory ? 'Update category details' : 'Add a new category for your blog posts'}
                                        </p>
                                    </div>
                                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Category Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => handleNameChange(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Enter category name..."
                                                required
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                URL Slug *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.slug}
                                                onChange={(e) => setData('slug', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="category-url-slug"
                                                required
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                URL: /blog/category/{data.slug}
                                            </p>
                                            {errors.slug && (
                                                <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Brief description of this category..."
                                            />
                                            {errors.description && (
                                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                                            >
                                                {editingCategory ? 'Update Category' : 'Create Category'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md text-sm font-medium"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Categories List */}
                        <div className={`${(isCreating || editingCategory) ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Categories</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {categories.length} categor{categories.length === 1 ? 'y' : 'ies'} total
                                    </p>
                                </div>

                                {categories.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Get started by creating your first category.
                                        </p>
                                        <div className="mt-6">
                                            <button
                                                onClick={() => {
                                                    setIsCreating(true);
                                                    reset();
                                                }}
                                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                                            >
                                                <PlusIcon className="h-4 w-4 mr-2" />
                                                Create Category
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-200">
                                        {categories.map((category) => (
                                            <div key={category.id} className="p-6 hover:bg-gray-50">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-medium text-gray-900">
                                                            {category.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            /blog/category/{category.slug}
                                                        </p>
                                                        {category.description && (
                                                            <p className="text-sm text-gray-600 mt-2">
                                                                {category.description}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center mt-3 text-xs text-gray-500 space-x-4">
                                                            <span className="flex items-center">
                                                                <FolderIcon className="h-4 w-4 mr-1" />
                                                                {category.posts_count} post{category.posts_count !== 1 ? 's' : ''}
                                                            </span>
                                                            <span>
                                                                Created {formatDate(category.created_at)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2 ml-6">
                                                        <button
                                                            onClick={() => handleEdit(category)}
                                                            className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50"
                                                            title="Edit category"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(category)}
                                                            className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50"
                                                            title="Delete category"
                                                            disabled={category.posts_count > 0}
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
