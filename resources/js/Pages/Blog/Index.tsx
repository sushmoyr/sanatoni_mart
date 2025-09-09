import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import {
    CalendarIcon,
    ClockIcon,
    TagIcon,
    UserIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    featured_image?: string;
    published_at: string;
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
    read_time: number;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    posts_count: number;
}

interface Props extends PageProps {
    posts: {
        data: BlogPost[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    } | null;
    categories: Category[] | null;
    featured_posts: BlogPost[] | null;
    filters: {
        search?: string;
        category?: string;
        tag?: string;
    } | null;
    popular_tags: string[] | null;
}

export default function BlogIndex({ 
    auth, 
    posts = null, 
    categories = [], 
    featured_posts = [], 
    filters = {},
    popular_tags = [] 
}: Props) {
    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const truncateText = (text: string, maxLength: number = 150) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    return (
        <Layout>
            <Head title="Blog">
                <meta name="description" content="Read our latest blog posts and articles about our products, industry insights, and company updates." />
                <meta name="keywords" content="blog, articles, news, updates, insights" />
                
                {/* Open Graph */}
                <meta property="og:title" content="Blog" />
                <meta property="og:description" content="Read our latest blog posts and articles about our products, industry insights, and company updates." />
                <meta property="og:type" content="website" />
                
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Blog" />
                <meta name="twitter:description" content="Read our latest blog posts and articles about our products, industry insights, and company updates." />
            </Head>

            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                                Our Blog
                            </h1>
                            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                                Stay up to date with the latest news, insights, and stories from our team.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="mt-12 max-w-xl mx-auto">
                            <form method="GET" action="/blog" className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="search"
                                    defaultValue={filters?.search || ''}
                                    placeholder="Search articles..."
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <button
                                    type="submit"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <span className="sr-only">Search</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Featured Posts */}
                {featured_posts && featured_posts.length > 0 && (
                    <section className="bg-white py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {featured_posts.slice(0, 3).map((post) => (
                                    <article key={post.id} className="group">
                                        <Link href={`/blog/${post.slug}`}>
                                            <div className="relative overflow-hidden rounded-lg mb-4">
                                                {post.featured_image ? (
                                                    <img
                                                        src={post.featured_image}
                                                        alt={post.title}
                                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-400">No image</span>
                                                    </div>
                                                )}
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                        Featured
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                {post.category && (
                                                    <span className="text-indigo-600 text-sm font-medium">
                                                        {post.category.name}
                                                    </span>
                                                )}
                                                <h3 className="mt-2 text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                    {post.title}
                                                </h3>
                                                {post.excerpt && (
                                                    <p className="mt-2 text-gray-600">
                                                        {truncateText(post.excerpt)}
                                                    </p>
                                                )}
                                                <div className="mt-4 flex items-center text-sm text-gray-500">
                                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                                    <time dateTime={post.published_at}>
                                                        {formatDate(post.published_at)}
                                                    </time>
                                                    <span className="mx-2">•</span>
                                                    <ClockIcon className="h-4 w-4 mr-1" />
                                                    <span>{post.read_time} min read</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid gap-8 lg:grid-cols-4">
                        {/* Blog Posts */}
                        <div className="lg:col-span-3">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Latest Articles
                                    {filters?.search && (
                                        <span className="text-lg font-normal text-gray-600 ml-2">
                                            for "{filters.search}"
                                        </span>
                                    )}
                                    {filters?.category && (
                                        <span className="text-lg font-normal text-gray-600 ml-2">
                                            in {categories?.find(c => c.slug === filters.category)?.name}
                                        </span>
                                    )}
                                </h2>
                                <div className="text-sm text-gray-500">
                                    {posts?.total || 0} article{(posts?.total || 0) !== 1 ? 's' : ''} found
                                </div>
                            </div>

                            {(posts?.data || []).length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 text-lg">
                                        No articles found.
                                    </div>
                                    {(filters?.search || filters?.category) && (
                                        <Link
                                            href="/blog"
                                            className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
                                        >
                                            View all articles
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {(posts?.data || []).map((post) => (
                                        <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                            <div className="md:flex">
                                                {post.featured_image && (
                                                    <div className="md:w-1/3">
                                                        <Link href={`/blog/${post.slug}`}>
                                                            <img
                                                                src={post.featured_image}
                                                                alt={post.title}
                                                                className="w-full h-48 md:h-full object-cover hover:opacity-90 transition-opacity"
                                                            />
                                                        </Link>
                                                    </div>
                                                )}
                                                <div className={`p-6 ${post.featured_image ? 'md:w-2/3' : 'w-full'}`}>
                                                    <div className="flex items-center justify-between mb-3">
                                                        {post.category && (
                                                            <Link
                                                                href={`/blog?category=${post.category.slug}`}
                                                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                                            >
                                                                {post.category.name}
                                                            </Link>
                                                        )}
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <CalendarIcon className="h-4 w-4 mr-1" />
                                                            <time dateTime={post.published_at}>
                                                                {formatDate(post.published_at)}
                                                            </time>
                                                        </div>
                                                    </div>
                                                    
                                                    <Link href={`/blog/${post.slug}`}>
                                                        <h3 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors mb-3">
                                                            {post.title}
                                                        </h3>
                                                    </Link>
                                                    
                                                    {post.excerpt && (
                                                        <p className="text-gray-600 mb-4">
                                                            {truncateText(post.excerpt, 200)}
                                                        </p>
                                                    )}
                                                    
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                            {post.author && (
                                                                <div className="flex items-center text-sm text-gray-500">
                                                                    <UserIcon className="h-4 w-4 mr-1" />
                                                                    <span>{post.author.name}</span>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <ClockIcon className="h-4 w-4 mr-1" />
                                                                <span>{post.read_time} min read</span>
                                                            </div>
                                                        </div>
                                                        
                                                        {(post.tags || []).length > 0 && (
                                                            <div className="flex items-center space-x-2">
                                                                <TagIcon className="h-4 w-4 text-gray-400" />
                                                                <div className="flex flex-wrap gap-1">
                                                                    {(post.tags || []).slice(0, 3).map((tag: string) => (
                                                                        <Link
                                                                            key={tag}
                                                                            href={`/blog?tag=${tag}`}
                                                                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded transition-colors"
                                                                        >
                                                                            {tag}
                                                                        </Link>
                                                                    ))}
                                                                    {(post.tags || []).length > 3 && (
                                                                        <span className="text-xs text-gray-500">
                                                                            +{(post.tags || []).length - 3}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {(posts?.last_page || 0) > 1 && (
                                <div className="mt-12 flex items-center justify-center">
                                    <nav className="flex items-center space-x-2">
                                        {(posts?.current_page || 0) > 1 && (
                                            <Link
                                                href={`/blog?page=${(posts?.current_page || 1) - 1}`}
                                                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                            >
                                                Previous
                                            </Link>
                                        )}
                                        
                                        {[...Array(Math.min(5, posts?.last_page || 0))].map((_, index) => {
                                            const page = index + 1;
                                            const isActive = page === (posts?.current_page || 1);
                                            
                                            return (
                                                <Link
                                                    key={page}
                                                    href={`/blog?page=${page}`}
                                                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                                        isActive
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {page}
                                                </Link>
                                            );
                                        })}
                                        
                                        {(posts?.current_page || 0) < (posts?.last_page || 0) && (
                                            <Link
                                                href={`/blog?page=${(posts?.current_page || 1) + 1}`}
                                                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                            >
                                                Next
                                            </Link>
                                        )}
                                    </nav>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="space-y-8">
                                {/* Categories */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                                    <div className="space-y-2">
                                        <Link
                                            href="/blog"
                                            className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                                                !filters?.category
                                                    ? 'bg-indigo-100 text-indigo-700'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            All Categories
                                        </Link>
                                        {categories?.map((category) => (
                                            <Link
                                                key={category.id}
                                                href={`/blog?category=${category.slug}`}
                                                className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                                                    filters?.category === category.slug
                                                        ? 'bg-indigo-100 text-indigo-700'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                <span>{category.name}</span>
                                                <span className="text-gray-400">
                                                    {category.posts_count}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Popular Tags */}
                                {popular_tags && popular_tags.length > 0 && (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {popular_tags.map((tag) => (
                                                <Link
                                                    key={tag}
                                                    href={`/blog?tag=${tag}`}
                                                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                                        filters?.tag === tag
                                                            ? 'bg-indigo-100 text-indigo-700'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {tag}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
