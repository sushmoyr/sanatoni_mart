import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import WysiwygEditor from '@/Components/ContentManagement/WysiwygEditor';
import SeoForm from '@/Components/ContentManagement/SeoForm';
import { 
    ArrowLeftIcon,
    EyeIcon,
    CheckIcon,
    TagIcon,
    CalendarIcon,
    UserIcon,
} from '@heroicons/react/24/outline';

interface BlogPost {
    id?: number;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    status: 'draft' | 'published' | 'scheduled';
    published_at?: string;
    category_id?: number;
    tags: string[];
    featured_image?: string;
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
    social_image?: string;
    og_title?: string;
    og_description?: string;
    twitter_title?: string;
    twitter_description?: string;
    created_at?: string;
    updated_at?: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface BlogPostData {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    status: 'draft' | 'published' | 'scheduled';
    published_at?: string;
    category_id?: number;
    tags: string[];
    featured_image?: string;
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
    social_image?: string;
    og_title?: string;
    og_description?: string;
    twitter_title?: string;
    twitter_description?: string;
}

interface Props extends PageProps {
    post?: BlogPost;
    categories: Category[];
    allTags: string[];
}

export default function CreateEditBlogPost({ auth, post, categories, allTags }: Props) {
    const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');
    const [tagInput, setTagInput] = useState('');

    const { data, setData, post: submitPost, put, processing, errors, reset } = useForm({
        title: post?.title || '',
        slug: post?.slug || '',
        content: post?.content || '',
        excerpt: post?.excerpt || '',
        status: post?.status || 'draft',
        published_at: post?.published_at || '',
        category_id: post?.category_id,
        tags: post?.tags || [],
        featured_image: post?.featured_image || '',
        seo_title: post?.seo_title || '',
        seo_description: post?.seo_description || '',
        seo_keywords: post?.seo_keywords || '',
        social_image: post?.social_image || '',
        og_title: post?.og_title || '',
        og_description: post?.og_description || '',
        twitter_title: post?.twitter_title || '',
        twitter_description: post?.twitter_description || '',
    });

    const isEditing = !!post?.id;

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const handleTitleChange = (title: string) => {
        setData({
            ...data,
            title,
            slug: data.slug || generateSlug(title),
        });
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = tagInput.trim();
            if (tag && !data.tags.includes(tag)) {
                setData('tags', [...data.tags, tag]);
                setTagInput('');
            }
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setData('tags', data.tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEditing) {
            put(`/admin/blog/${post!.id}`, {
                onSuccess: () => {
                    alert('Blog post updated successfully!');
                },
            });
        } else {
            submitPost('/admin/blog', {
                onSuccess: () => {
                    reset();
                    router.visit('/admin/blog');
                },
            });
        }
    };

    const handleSave = (status: 'draft' | 'published') => {
        setData('status', status);
        if (status === 'published' && !data.published_at) {
            setData('published_at', new Date().toISOString().slice(0, 16));
        }
        setTimeout(() => {
            const form = document.getElementById('blog-form') as HTMLFormElement;
            if (form) form.requestSubmit();
        }, 0);
    };

    const handlePreview = () => {
        if (isEditing) {
            window.open(`/blog/${data.slug}/preview`, '_blank');
        } else {
            alert('Please save as draft first to preview');
        }
    };

    const tabs = [
        { key: 'content', label: 'Content', description: 'Write your blog post' },
        { key: 'seo', label: 'SEO Settings', description: 'Optimize for search' },
    ] as const;

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
                                {isEditing ? `Edit "${post!.title}"` : 'Create New Blog Post'}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {isEditing ? 'Update your blog post content and settings' : 'Create a new blog post for your website'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        {isEditing && (
                            <button
                                onClick={handlePreview}
                                className="flex items-center px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                            >
                                <EyeIcon className="h-4 w-4 mr-2" />
                                Preview
                            </button>
                        )}
                        <button
                            onClick={() => handleSave('draft')}
                            disabled={processing}
                            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 text-sm"
                        >
                            Save Draft
                        </button>
                        <button
                            onClick={() => handleSave('published')}
                            disabled={processing}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
                        >
                            <CheckIcon className="h-4 w-4 mr-2" />
                            {isEditing ? 'Update' : 'Publish'}
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={isEditing ? `Edit ${post!.title}` : 'Create New Blog Post'} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <form id="blog-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Post Information</h3>
                                <p className="text-sm text-gray-600 mt-1">Basic details about your blog post</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Post Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => handleTitleChange(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Enter post title..."
                                            required
                                        />
                                        {errors.title && (
                                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
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
                                            placeholder="post-url-slug"
                                            required
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            URL: /blog/{data.slug}
                                        </p>
                                        {errors.slug && (
                                            <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <UserIcon className="h-4 w-4 inline mr-1" />
                                            Category
                                        </label>
                                        <select
                                            value={data.category_id || ''}
                                            onChange={(e) => setData('category_id', e.target.value ? parseInt(e.target.value) : undefined)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value as any)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                            <option value="scheduled">Scheduled</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <CalendarIcon className="h-4 w-4 inline mr-1" />
                                            Publish Date
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={data.published_at}
                                            onChange={(e) => setData('published_at', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Post Excerpt
                                    </label>
                                    <textarea
                                        value={data.excerpt}
                                        onChange={(e) => setData('excerpt', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Brief description of this post..."
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Optional short description for post previews and social media
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <TagIcon className="h-4 w-4 inline mr-1" />
                                        Tags
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={handleAddTag}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Type a tag and press Enter..."
                                        />
                                        {data.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {data.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                                    >
                                                        {tag}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveTag(tag)}
                                                            className="ml-1 text-indigo-600 hover:text-indigo-800"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Tabs */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            {/* Tab Navigation */}
                            <div className="border-b border-gray-200">
                                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.key}
                                            type="button"
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                                activeTab === tab.key
                                                    ? 'border-indigo-500 text-indigo-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex flex-col items-center">
                                                {tab.label}
                                                <span className="text-xs text-gray-400 mt-1">
                                                    {tab.description}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                {activeTab === 'content' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Post Content
                                            </label>
                                            <WysiwygEditor
                                                value={data.content}
                                                onChange={(content) => setData('content', content)}
                                                placeholder="Start writing your blog post..."
                                            />
                                            {errors.content && (
                                                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'seo' && (
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-lg font-medium text-gray-900">SEO Optimization</h4>
                                            <p className="text-sm text-gray-600">
                                                Optimize your blog post for search engines and social media
                                            </p>
                                        </div>
                                        <SeoForm
                                            initialData={{
                                                meta_title: data.seo_title,
                                                meta_description: data.seo_description,
                                                meta_keywords: data.seo_keywords,
                                                og_image: data.social_image,
                                                og_title: data.og_title,
                                                og_description: data.og_description,
                                                twitter_title: data.twitter_title,
                                                twitter_description: data.twitter_description,
                                            }}
                                            onChange={(seoData) => {
                                                setData({
                                                    ...data,
                                                    seo_title: seoData.meta_title,
                                                    seo_description: seoData.meta_description,
                                                    seo_keywords: seoData.meta_keywords,
                                                    social_image: seoData.og_image,
                                                    og_title: seoData.og_title,
                                                    og_description: seoData.og_description,
                                                    twitter_title: seoData.twitter_title,
                                                    twitter_description: seoData.twitter_description,
                                                });
                                            }}
                                            contentTitle={data.title}
                                            contentDescription={data.excerpt}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
