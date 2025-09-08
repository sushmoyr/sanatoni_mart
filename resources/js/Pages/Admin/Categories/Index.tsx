import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Category } from '@/types';
import { Card, Button, Badge } from '@/Components/ui';
import { 
    PlusIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    TagIcon,
    FolderIcon
} from '@heroicons/react/24/outline';

interface Props {
    categories: Category[];
}

export default function Index({ categories }: Props) {
    const handleDelete = (category: Category) => {
        if (confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
            router.delete(route('admin.categories.destroy', category.id), {
                onSuccess: () => {
                    // Success message will be handled by flash message
                },
                onError: (errors) => {
                    alert('Failed to delete category. Please try again.');
                    console.error('Delete error:', errors);
                }
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Categories" />

            <div className="container-custom py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                                Sacred Categories
                            </h1>
                            <p className="text-semantic-textSub">
                                Organize your spiritual products into meaningful categories
                            </p>
                        </div>
                        <Button asChild>
                            <Link href={route('admin.categories.create')}>
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Add Category
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card className="devotional-border">
                    <div className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-semantic-border">
                                <thead className="bg-semantic-surface">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">
                                            Parent
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">
                                            Products
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-semantic-border">
                                    {categories.map((category) => (
                                        <tr key={category.id} className="hover:bg-semantic-surface transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-lg bg-brand-100 flex items-center justify-center">
                                                            {category.icon ? (
                                                                <span className="text-lg">
                                                                    {category.icon}
                                                                </span>
                                                            ) : (
                                                                <FolderIcon className="h-5 w-5 text-brand-600" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-semantic-text">
                                                            {category.name}
                                                        </div>
                                                        {category.description && (
                                                            <div className="text-sm text-semantic-textSub">
                                                                {category.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {category.parent ? (
                                                    <Badge variant="secondary" size="sm">
                                                        <TagIcon className="h-3 w-3 mr-1" />
                                                        {category.parent.name}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-semantic-textSub">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge 
                                                    variant={category.is_active ? "success" : "danger"} 
                                                    size="sm"
                                                >
                                                    {category.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-semantic-text">
                                                    {category.products_count || 0} products
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={route('admin.categories.show', category.id)}>
                                                            <EyeIcon className="h-4 w-4" />
                                                            <span className="sr-only">View</span>
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={route('admin.categories.edit', category.id)}>
                                                            <PencilIcon className="h-4 w-4" />
                                                            <span className="sr-only">Edit</span>
                                                        </Link>
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => handleDelete(category)}
                                                        className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Empty State */}
                        {categories.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FolderIcon className="h-8 w-8 text-brand-600" />
                                </div>
                                <h3 className="text-lg font-serif font-medium text-semantic-text mb-2">
                                    No sacred categories found
                                </h3>
                                <p className="text-semantic-textSub mb-6">
                                    Start organizing your spiritual inventory by creating your first category.
                                </p>
                                <Button asChild>
                                    <Link href={route('admin.categories.create')}>
                                        <PlusIcon className="h-4 w-4 mr-2" />
                                        Create your first category
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}
