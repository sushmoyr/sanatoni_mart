import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

interface Review {
    id: number;
    rating: number;
    comment: string;
    status: string;
    customer: {
        name: string;
        email: string;
    };
    product: {
        name: string;
        slug: string;
    };
    created_at: string;
}

interface ReviewsData {
    data: Review[];
    current_page: number;
    last_page: number;
    total: number;
    meta?: any;
    links?: any[];
}

interface Stats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    avg_rating: number;
}

interface Props {
    reviews: ReviewsData;
    stats: Stats;
    filters: any;
}

export default function ReviewsIndexMinimal({ reviews, stats, filters }: Props) {
    console.log('Minimal component - Reviews data:', reviews);
    console.log('Minimal component - Stats data:', stats);
    console.log('Minimal component - Filters data:', filters);

    return (
        <AdminLayout>
            <Head title="Reviews Management" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-6">Reviews Management - Minimal Version</h1>
                            
                            {/* Basic Stats Display */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{stats?.total || 0}</div>
                                    <div className="text-sm text-gray-600">Total Reviews</div>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</div>
                                    <div className="text-sm text-gray-600">Pending</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{stats?.approved || 0}</div>
                                    <div className="text-sm text-gray-600">Approved</div>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-red-600">{stats?.rejected || 0}</div>
                                    <div className="text-sm text-gray-600">Rejected</div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{stats?.avg_rating?.toFixed(1) || 0}</div>
                                    <div className="text-sm text-gray-600">Avg Rating</div>
                                </div>
                            </div>

                            {/* Basic Reviews List */}
                            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                                <ul className="divide-y divide-gray-200">
                                    {reviews?.data?.map((review) => (
                                        <li key={review.id} className="px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {review.customer?.name || 'Unknown Customer'}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Product: {review.product?.name || 'Unknown Product'}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Rating: {review.rating}/5 stars
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        review.status === 'approved' 
                                                            ? 'bg-green-100 text-green-800'
                                                            : review.status === 'rejected'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {review.status}
                                                    </span>
                                                </div>
                                            </div>
                                            {review.comment && (
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-700">{review.comment}</p>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Pagination Info */}
                            {reviews?.meta && (
                                <div className="mt-4 text-sm text-gray-700">
                                    Showing {reviews.meta.from || 0} to {reviews.meta.to || 0} of {reviews.meta.total || 0} results
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}