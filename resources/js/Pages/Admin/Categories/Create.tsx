import React, { FormEventHandler } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Category } from '@/types';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';

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

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold text-gray-900">Create Category</h1>
                                <Link
                                    href={route('admin.categories.index')}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    ← Back to Categories
                                </Link>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="name" value="Category Name" />
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="mt-1 block w-full"
                                            isFocused={true}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="description" value="Description" />
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={data.description}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            rows={3}
                                            onChange={(e) => setData('description', e.target.value)}
                                        />
                                        <InputError message={errors.description} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="icon" value="Icon (Emoji)" />
                                        <TextInput
                                            id="icon"
                                            name="icon"
                                            value={data.icon}
                                            className="mt-1 block w-full"
                                            placeholder="🕉️"
                                            onChange={(e) => setData('icon', e.target.value)}
                                        />
                                        <InputError message={errors.icon} className="mt-2" />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Optional emoji or icon for the category
                                        </p>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="parent_id" value="Parent Category" />
                                        <select
                                            id="parent_id"
                                            name="parent_id"
                                            value={data.parent_id}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            onChange={(e) => setData('parent_id', e.target.value)}
                                        >
                                            <option value="">No Parent (Top Level)</option>
                                            {parentCategories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.parent_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="sort_order" value="Sort Order" />
                                        <TextInput
                                            id="sort_order"
                                            name="sort_order"
                                            type="number"
                                            value={data.sort_order.toString()}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                        />
                                        <InputError message={errors.sort_order} className="mt-2" />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Lower numbers appear first
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center">
                                            <input
                                                id="is_active"
                                                name="is_active"
                                                type="checkbox"
                                                checked={data.is_active}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                            />
                                            <InputLabel
                                                htmlFor="is_active"
                                                value="Active"
                                                className="ml-2"
                                            />
                                        </div>
                                        <InputError message={errors.is_active} className="mt-2" />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Only active categories are shown to customers
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-4">
                                    <SecondaryButton>
                                        <Link href={route('admin.categories.index')}>
                                            Cancel
                                        </Link>
                                    </SecondaryButton>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Category'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
