import React from 'react';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import GuestLayout from '@/Layouts/GuestLayout';

interface Props extends PageProps {
    posts: any;
    categories: any;
    featured_posts: any;
    filters: any;
    popular_tags: any;
}

export default function BlogIndexSimple({ auth, posts, categories, featured_posts, filters, popular_tags }: Props) {
    return (
        <GuestLayout>
            <Head title="Blog" />
            <div className="min-h-screen bg-gray-50 p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Blog</h1>
                
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-semibold mb-4">Debug Info:</h2>
                    <div className="space-y-2 text-sm">
                        <p><strong>Posts:</strong> {JSON.stringify(posts)}</p>
                        <p><strong>Categories:</strong> {JSON.stringify(categories)}</p>
                        <p><strong>Featured Posts:</strong> {JSON.stringify(featured_posts)}</p>
                        <p><strong>Popular Tags:</strong> {JSON.stringify(popular_tags)}</p>
                        <p><strong>Filters:</strong> {JSON.stringify(filters)}</p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
