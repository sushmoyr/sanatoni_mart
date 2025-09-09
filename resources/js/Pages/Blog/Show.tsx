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
    ShareIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featured_image?: string;
    published_at: string;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
    tags?: string[];
    author?: {
        name: string;
        email: string;
        avatar?: string;
        bio?: string;
    };
    read_time?: number;
    reading_time?: number;
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    twitter_title?: string;
    twitter_description?: string;
    twitter_image?: string;
}

interface RelatedPost {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    featured_image?: string;
    published_at: string;
    category?: {
        name: string;
        slug: string;
    };
    read_time: number;
}

interface Props extends PageProps {
    post: BlogPost;
    relatedPosts: RelatedPost[];
    previousPost?: {
        title: string;
        slug: string;
    };
    nextPost?: {
        title: string;
        slug: string;
    };
}

export default function BlogShow({ auth, post, relatedPosts, previousPost, nextPost }: Props) {
    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const sharePost = (platform: 'twitter' | 'facebook' | 'linkedin') => {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(post.title);
        const text = encodeURIComponent(post.excerpt || post.title);

        let shareUrl = '';
        
        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        // You could add a toast notification here
        alert('Link copied to clipboard!');
    };

    return (
        <Layout>
            <Head title={post.seo_title || post.title}>
                {/* SEO Meta Tags */}
                {post.seo_description && <meta name="description" content={post.seo_description} />}
                {post.seo_keywords && <meta name="keywords" content={post.seo_keywords} />}
                <meta name="author" content={post.author?.name} />

                {/* Open Graph */}
                <meta property="og:title" content={post.og_title || post.title} />
                <meta property="og:description" content={post.og_description || post.excerpt || ''} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
                {post.og_image && <meta property="og:image" content={post.og_image} />}
                <meta property="article:published_time" content={post.published_at} />
                {post.category && <meta property="article:section" content={post.category.name} />}
                {post.tags && post.tags.map((tag, index) => (
                    <meta key={index} property="article:tag" content={tag} />
                ))}

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.twitter_title || post.title} />
                <meta name="twitter:description" content={post.twitter_description || post.excerpt || ''} />
                {post.twitter_image && <meta name="twitter:image" content={post.twitter_image} />}

                {/* Additional SEO */}
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />

                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": post.title,
                        "description": post.excerpt,
                        "image": post.featured_image,
                        "author": {
                            "@type": "Person",
                            "name": post.author?.name
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Sanatoni Mart"
                        },
                        "datePublished": post.published_at,
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": typeof window !== 'undefined' ? window.location.href : ''
                        }
                    })}
                </script>
            </Head>

            <div className="min-h-screen bg-gray-50">
                {/* Article Header */}
                <article className="bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Navigation */}
                        <div className="mb-8">
                            <Link
                                href="/blog"
                                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            >
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                Back to Blog
                            </Link>
                        </div>

                        {/* Category */}
                        {post.category && (
                            <div className="mb-4">
                                <Link
                                    href={`/blog?category=${post.category.slug}`}
                                    className="inline-block bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full hover:bg-indigo-200 transition-colors"
                                >
                                    {post.category.name}
                                </Link>
                            </div>
                        )}

                        {/* Title */}
                        <header className="mb-8">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                                {post.title}
                            </h1>

                            {post.excerpt && (
                                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                                    {post.excerpt}
                                </p>
                            )}

                            {/* Meta Information */}
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
                                {post.author && (
                                    <div className="flex items-center">
                                        {post.author.avatar ? (
                                            <img
                                                src={post.author.avatar}
                                                alt={post.author.name}
                                                className="w-8 h-8 rounded-full mr-2"
                                            />
                                        ) : (
                                            <UserIcon className="h-5 w-5 mr-2" />
                                        )}
                                        <span className="font-medium text-gray-700">{post.author.name}</span>
                                    </div>
                                )}
                                
                                <div className="flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    <time dateTime={post.published_at}>
                                        {formatDate(post.published_at)}
                                    </time>
                                </div>
                                
                                <div className="flex items-center">
                                    <ClockIcon className="h-4 w-4 mr-1" />
                                    <span>{post.reading_time || post.read_time || 5} min read</span>
                                </div>
                            </div>

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex items-center flex-wrap gap-2 mb-6">
                                    <TagIcon className="h-4 w-4 text-gray-400" />
                                    {post.tags.map((tag) => (
                                        <Link
                                            key={tag}
                                            href={`/blog?tag=${tag}`}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm px-3 py-1 rounded-full transition-colors"
                                        >
                                            {tag}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Social Share */}
                            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                                <span className="text-sm font-medium text-gray-700 flex items-center">
                                    <ShareIcon className="h-4 w-4 mr-2" />
                                    Share:
                                </span>
                                <button
                                    onClick={() => sharePost('twitter')}
                                    className="text-gray-500 hover:text-blue-400 transition-colors"
                                    title="Share on Twitter"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                </button>
                                <button
                                    onClick={() => sharePost('facebook')}
                                    className="text-gray-500 hover:text-blue-600 transition-colors"
                                    title="Share on Facebook"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </button>
                                <button
                                    onClick={() => sharePost('linkedin')}
                                    className="text-gray-500 hover:text-blue-700 transition-colors"
                                    title="Share on LinkedIn"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </button>
                                <button
                                    onClick={copyToClipboard}
                                    className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
                                    title="Copy link"
                                >
                                    Copy link
                                </button>
                            </div>
                        </header>

                        {/* Featured Image */}
                        {post.featured_image && (
                            <div className="mb-8">
                                <img
                                    src={post.featured_image}
                                    alt={post.title}
                                    className="w-full h-auto rounded-lg shadow-lg"
                                />
                            </div>
                        )}

                        {/* Article Content */}
                        <div 
                            className="prose prose-lg max-w-none mb-12"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Author Bio */}
                        {post.author?.bio && (
                            <div className="bg-gray-50 rounded-lg p-6 mb-8">
                                <div className="flex items-start space-x-4">
                                    {post.author.avatar ? (
                                        <img
                                            src={post.author.avatar}
                                            alt={post.author.name}
                                            className="w-16 h-16 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                                            <UserIcon className="h-8 w-8 text-gray-500" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            About {post.author.name}
                                        </h3>
                                        <p className="text-gray-600">
                                            {post.author.bio}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </article>

                {/* Navigation between posts */}
                {(previousPost || nextPost) && (
                    <div className="bg-white border-t border-gray-200">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {previousPost && (
                                    <Link
                                        href={`/blog/${previousPost.slug}`}
                                        className="group flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <ArrowLeftIcon className="h-5 w-5 text-gray-400 mt-1 group-hover:text-indigo-600" />
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Previous article</p>
                                            <h3 className="font-medium text-gray-900 group-hover:text-indigo-600">
                                                {previousPost.title}
                                            </h3>
                                        </div>
                                    </Link>
                                )}
                                
                                {nextPost && (
                                    <Link
                                        href={`/blog/${nextPost.slug}`}
                                        className="group flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors md:justify-end md:text-right"
                                    >
                                        <div className="md:order-2">
                                            <p className="text-sm text-gray-500 mb-1">Next article</p>
                                            <h3 className="font-medium text-gray-900 group-hover:text-indigo-600">
                                                {nextPost.title}
                                            </h3>
                                        </div>
                                        <ArrowRightIcon className="h-5 w-5 text-gray-400 mt-1 group-hover:text-indigo-600 md:order-3" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="bg-gray-50 py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {relatedPosts.slice(0, 3).map((relatedPost: RelatedPost) => (
                                    <article key={relatedPost.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
                                        <Link href={`/blog/${relatedPost.slug}`}>
                                            {relatedPost.featured_image ? (
                                                <img
                                                    src={relatedPost.featured_image}
                                                    alt={relatedPost.title}
                                                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                                                />
                                            ) : (
                                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400">No image</span>
                                                </div>
                                            )}
                                            <div className="p-6">
                                                {relatedPost.category && (
                                                    <span className="text-indigo-600 text-sm font-medium">
                                                        {relatedPost.category.name}
                                                    </span>
                                                )}
                                                <h3 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                    {relatedPost.title}
                                                </h3>
                                                {relatedPost.excerpt && (
                                                    <p className="mt-2 text-gray-600 text-sm">
                                                        {relatedPost.excerpt.slice(0, 100)}...
                                                    </p>
                                                )}
                                                <div className="mt-4 flex items-center text-sm text-gray-500">
                                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                                    <time dateTime={relatedPost.published_at}>
                                                        {formatDate(relatedPost.published_at)}
                                                    </time>
                                                    <span className="mx-2">•</span>
                                                    <ClockIcon className="h-4 w-4 mr-1" />
                                                    <span>{relatedPost.read_time} min read</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </Layout>
    );
}
