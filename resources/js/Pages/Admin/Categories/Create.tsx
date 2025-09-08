import React, { FormEventHandler } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Category } from '@/types';
import { Card, Button, Input } from '@/Components/ui';
import { ArrowLeftIcon, TagIcon } from '@heroicons/react/24/outline';

interface Props {
    parentCategories: Category[];
}

export default function Create({ parentCategories }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        icon: '',
        parent_id: '',
        is_active: true,
        sort_order: 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.categories.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout>
            <Head title="Create Category" />

            <div className="container-custom py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                                Create Sacred Category
                            </h1>
                            <p className="text-semantic-textSub">
                                Add a new category to organize your spiritual products
                            </p>
                        </div>
                        <Button variant="secondary" asChild>
                            <Link href={route('admin.categories.index')}>
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                Back to Categories
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="max-w-3xl">
                    <Card className="devotional-border">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-semantic-text mb-2">
                                            Category Name
                                        </label>
                                        <Input
                                            type="text"
                                            value={data.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                                            placeholder="Enter category name..."
                                            required
                                            leftIcon={<TagIcon className="h-4 w-4" />}
                                        />
                                        {errors.name && (
                                            <p className="mt-2 text-sm text-danger-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-semantic-text mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="w-full px-3 py-2 border border-semantic-border rounded-md shadow-e1 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-semantic-text"
                                            rows={3}
                                            placeholder="Describe this category..."
                                        />
                                        {errors.description && (
                                            <p className="mt-2 text-sm text-danger-600">{errors.description}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-semantic-text mb-2">
                                            Icon (Emoji)
                                        </label>
                                        <Input
                                            type="text"
                                            value={data.icon}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('icon', e.target.value)}
                                            placeholder="🕉️"
                                        />
                                        {errors.icon && (
                                            <p className="mt-2 text-sm text-danger-600">{errors.icon}</p>
                                        )}
                                        <p className="mt-1 text-sm text-semantic-textSub">
                                            Optional emoji or icon for the category
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-semantic-text mb-2">
                                            Parent Category
                                        </label>
                                        <select
                                            value={data.parent_id}
                                            onChange={(e) => setData('parent_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-semantic-border rounded-md shadow-e1 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-semantic-text"
                                        >
                                            <option value="">No Parent (Top Level)</option>
                                            {parentCategories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.parent_id && (
                                            <p className="mt-2 text-sm text-danger-600">{errors.parent_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-semantic-text mb-2">
                                            Sort Order
                                        </label>
                                        <Input
                                            type="number"
                                            value={data.sort_order.toString()}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('sort_order', parseInt(e.target.value) || 0)}
                                            placeholder="0"
                                        />
                                        {errors.sort_order && (
                                            <p className="mt-2 text-sm text-danger-600">{errors.sort_order}</p>
                                        )}
                                        <p className="mt-1 text-sm text-semantic-textSub">
                                            Lower numbers appear first
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center">
                                            <input
                                                id="is_active"
                                                type="checkbox"
                                                checked={data.is_active}
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-semantic-border rounded"
                                            />
                                            <label htmlFor="is_active" className="ml-2 text-sm font-medium text-semantic-text">
                                                Active
                                            </label>
                                        </div>
                                        {errors.is_active && (
                                            <p className="mt-2 text-sm text-danger-600">{errors.is_active}</p>
                                        )}
                                        <p className="mt-1 text-sm text-semantic-textSub">
                                            Only active categories are shown to customers
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-semantic-border">
                                    <Button variant="secondary" asChild>
                                        <Link href={route('admin.categories.index')}>
                                            Cancel
                                        </Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Category'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
