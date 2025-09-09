import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface PageData {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    status: 'draft' | 'published' | 'scheduled';
    published_at?: string;
    template: 'default' | 'homepage' | 'contact' | 'about' | 'landing';
    sections?: any[];
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
    social_image?: string;
    og_title?: string;
    og_description?: string;
    twitter_title?: string;
    twitter_description?: string;
}

interface Page extends PageData {
    id?: number;
    created_at?: string;
    updated_at?: string;
}

interface Props extends PageProps {
    page?: Page;
    templates: { value: string; label: string }[];
}

export default function CreateEditPage({ auth, page, templates }: Props) {
    const [formData, setFormData] = useState<PageData>({
        title: page?.title || '',
        slug: page?.slug || '',
        content: page?.content || '',
        excerpt: page?.excerpt || '',
        status: page?.status || 'draft',
        published_at: page?.published_at || '',
        template: page?.template || 'default',
        sections: page?.sections || [],
        seo_title: page?.seo_title || '',
        seo_description: page?.seo_description || '',
        seo_keywords: page?.seo_keywords || '',
        social_image: page?.social_image || '',
        og_title: page?.og_title || '',
        og_description: page?.og_description || '',
        twitter_title: page?.twitter_title || '',
        twitter_description: page?.twitter_description || '',
    });

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEditing = !!page?.id;

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const handleTitleChange = (title: string) => {
        setFormData(prev => ({
            ...prev,
            title,
            slug: prev.slug || generateSlug(title),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        if (isEditing) {
            router.put(`/admin/pages/${page!.id}`, formData as any, {
                onSuccess: () => {
                    setProcessing(false);
                },
                onError: (errors) => {
                    setProcessing(false);
                    setErrors(errors as Record<string, string>);
                }
            });
        } else {
            router.post('/admin/pages', formData as any, {
                onSuccess: () => {
                    setProcessing(false);
                    router.visit('/admin/pages');
                },
                onError: (errors) => {
                    setProcessing(false);
                    setErrors(errors as Record<string, string>);
                }
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        {isEditing ? 'Edit Page' : 'Create New Page'}
                    </h2>
                </div>
            }
        >
            <Head title={isEditing ? 'Edit Page' : 'Create Page'} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="title" value="Title" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        placeholder="Enter page title"
                                        className="mt-1 block w-full"
                                        autoFocus
                                    />
                                    <InputError message={errors.title} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="slug" value="URL Slug" />
                                    <TextInput
                                        id="slug"
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                        placeholder="page-url-slug"
                                        className="mt-1 block w-full"
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        URL: /pages/{formData.slug}
                                    </p>
                                    <InputError message={errors.slug} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="template" value="Page Template" />
                                    <select
                                        id="template"
                                        value={formData.template}
                                        onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value as any }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        {templates.map(template => (
                                            <option key={template.value} value={template.value}>
                                                {template.label}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.template} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="Status" />
                                    <select
                                        id="status"
                                        value={formData.status}
                                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="scheduled">Scheduled</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="excerpt" value="Excerpt (Optional)" />
                                    <textarea
                                        id="excerpt"
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                        rows={3}
                                        placeholder="Brief description of the page..."
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <InputError message={errors.excerpt} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="content" value="Content" />
                                    <textarea
                                        id="content"
                                        value={formData.content}
                                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                        rows={10}
                                        placeholder="Enter page content..."
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <InputError message={errors.content} className="mt-1" />
                                </div>

                                <div className="flex items-center justify-end space-x-4">
                                    <SecondaryButton
                                        type="button"
                                        onClick={() => router.visit('/admin/pages')}
                                    >
                                        Cancel
                                    </SecondaryButton>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Saving...' : (isEditing ? 'Update Page' : 'Create Page')}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
