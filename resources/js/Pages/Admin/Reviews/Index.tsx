import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Card } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { 
    MagnifyingGlassIcon,
    EyeIcon,
    CheckIcon,
    XMarkIcon,
    StarIcon,
    ShieldCheckIcon,
    CalendarDaysIcon,
    UserIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface ProductReview {
    id: number;
    user_id: number;
    product_id: number;
    rating: number;
    title: string;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    helpful_votes: number;
    verified_purchase_data?: any;
    approved_at?: string;
    approved_by?: number;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    product: {
        id: number;
        name: string;
        slug: string;
        main_image?: string;
    };
    approver?: {
        id: number;
        name: string;
    };
}

interface ReviewStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    avg_rating: number;
    total_votes: number;
}

interface Props extends PageProps {
    reviews: {
        data: ProductReview[];
        links: any[];
        meta: any;
    };
    stats: ReviewStats;
    filters: {
        search?: string;
        status?: string;
        rating?: string;
        verified_only?: boolean;
    };
}

export default function ReviewsIndex({ reviews, stats, filters }: Props) {
    // Debug data structure
    console.log('Reviews data:', reviews);
    console.log('Stats data:', stats);
    console.log('Filters data:', filters);

    // Ensure reviews structure exists
    if (!reviews || !reviews.data) {
        console.error('Invalid reviews data structure:', reviews);
        return (
            <AdminLayout>
                <Head title="Reviews Management" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h1 className="text-2xl font-bold text-red-600">Error: Invalid reviews data structure</h1>
                                <p className="mt-2 text-gray-600">Please refresh the page or contact support.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    // Initialize state with safe defaults
    const [selectedReviews, setSelectedReviews] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [ratingFilter, setRatingFilter] = useState(filters?.rating || '');
    const [verifiedOnly, setVerifiedOnly] = useState(Boolean(filters?.verified_only));

    const handleSearch = () => {
        const params: Record<string, string> = {};
        
        // Ensure only non-empty string values are added
        if (searchTerm?.trim()) params.search = searchTerm.trim();
        if (statusFilter?.trim()) params.status = statusFilter.trim();
        if (ratingFilter?.trim()) params.rating = ratingFilter.trim();
        if (verifiedOnly) params.verified_only = '1';
        
        try {
            router.get(route('admin.reviews.index'), params, { 
                preserveState: true,
                replace: true,
                onError: (errors) => {
                    console.error('Search error:', errors);
                }
            });
        } catch (error) {
            console.error('Router error:', error);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked && reviews?.data?.length) {
            setSelectedReviews(reviews.data.map(review => review.id));
        } else {
            setSelectedReviews([]);
        }
    };

    const handleSelectReview = (reviewId: number, checked: boolean) => {
        if (checked) {
            setSelectedReviews([...selectedReviews, reviewId]);
        } else {
            setSelectedReviews(selectedReviews.filter(id => id !== reviewId));
        }
    };

    const handleBulkApprove = () => {
        if (selectedReviews.length === 0) return;
        
        try {
            router.post(route('admin.reviews.bulk-approve'), {
                review_ids: selectedReviews
            }, {
                onSuccess: () => {
                    setSelectedReviews([]);
                },
                onError: (errors) => {
                    console.error('Bulk approve error:', errors);
                }
            });
        } catch (error) {
            console.error('Bulk approve router error:', error);
        }
    };

    const handleBulkReject = () => {
        if (selectedReviews.length === 0) return;
        
        try {
            router.post(route('admin.reviews.bulk-reject'), {
                review_ids: selectedReviews
            }, {
                onSuccess: () => {
                    setSelectedReviews([]);
                },
                onError: (errors) => {
                    console.error('Bulk reject error:', errors);
                }
            });
        } catch (error) {
            console.error('Bulk reject router error:', error);
        }
    };

    const handleApprove = (reviewId: number) => {
        if (!reviewId) return;
        
        try {
            router.post(route('admin.reviews.approve', reviewId), {}, {
                onError: (errors) => {
                    console.error('Approve error:', errors);
                }
            });
        } catch (error) {
            console.error('Approve router error:', error);
        }
    };

    const handleReject = (reviewId: number) => {
        if (!reviewId) return;
        
        try {
            router.post(route('admin.reviews.reject', reviewId), {}, {
                onError: (errors) => {
                    console.error('Reject error:', errors);
                }
            });
        } catch (error) {
            console.error('Reject router error:', error);
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                        key={star}
                        className={cn(
                            "h-4 w-4",
                            star <= rating 
                                ? "text-amber-400 fill-current" 
                                : "text-gray-300"
                        )}
                    />
                ))}
            </div>
        );
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            pending: 'warning',
            approved: 'success',
            rejected: 'danger'
        } as const;
        
        return (
            <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    return (
        <AdminLayout>
            <Head title="Review Management" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
                        <p className="text-gray-600">Manage customer product reviews and ratings</p>
                    </div>
                    <Link href={route('admin.reviews.statistics')}>
                        <Button variant="secondary">
                            <ChartBarIcon className="h-4 w-4 mr-2" />
                            View Statistics
                        </Button>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <Card className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-sm text-gray-600">Total Reviews</div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
                            <div className="text-sm text-gray-600">Pending</div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                            <div className="text-sm text-gray-600">Approved</div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                            <div className="text-sm text-gray-600">Rejected</div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{stats.avg_rating.toFixed(1)}</div>
                            <div className="text-sm text-gray-600">Avg Rating</div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{stats.total_votes}</div>
                            <div className="text-sm text-gray-600">Total Votes</div>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Search
                            </label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Search reviews, products, users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rating
                            </label>
                            <select
                                value={ratingFilter}
                                onChange={(e) => setRatingFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Ratings</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Verified Only
                            </label>
                            <div className="flex items-center pt-2">
                                <input
                                    type="checkbox"
                                    checked={verifiedOnly}
                                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">Verified purchases only</span>
                            </div>
                        </div>

                        <div className="flex items-end">
                            <Button onClick={handleSearch} className="w-full">
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Bulk Actions */}
                {selectedReviews.length > 0 && (
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                {selectedReviews.length} review(s) selected
                            </span>
                            <div className="flex space-x-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleBulkApprove}
                                >
                                    <CheckIcon className="h-4 w-4 mr-1" />
                                    Approve Selected
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleBulkReject}
                                >
                                    <XMarkIcon className="h-4 w-4 mr-1" />
                                    Reject Selected
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Reviews List */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            checked={selectedReviews.length === reviews.data.length && reviews.data.length > 0}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Review
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rating
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reviews.data.map((review) => (
                                    <tr key={review.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedReviews.includes(review.id)}
                                                onChange={(e) => handleSelectReview(review.id, e.target.checked)}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs">
                                                <div className="font-medium text-gray-900 truncate">
                                                    {review.title}
                                                </div>
                                                <div className="text-sm text-gray-500 truncate">
                                                    {review.comment}
                                                </div>
                                                <div className="flex items-center mt-1 space-x-2">
                                                    {review.verified_purchase_data && (
                                                        <div className="flex items-center text-xs text-green-600">
                                                            <ShieldCheckIcon className="h-3 w-3 mr-1" />
                                                            Verified
                                                        </div>
                                                    )}
                                                    {review.helpful_votes > 0 && (
                                                        <div className="text-xs text-gray-500">
                                                            {review.helpful_votes} helpful votes
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link 
                                                href={route('products.show', review.product.slug)}
                                                className="flex items-center space-x-2 hover:text-blue-600"
                                            >
                                                {review.product.main_image && (
                                                    <img
                                                        src={`/storage/${review.product.main_image}`}
                                                        alt={review.product.name}
                                                        className="h-8 w-8 rounded object-cover"
                                                    />
                                                )}
                                                <span className="text-sm font-medium truncate max-w-xs">
                                                    {review.product.name}
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8">
                                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <UserIcon className="h-4 w-4 text-gray-500" />
                                                    </div>
                                                </div>
                                                <div className="ml-2">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {review.user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {review.user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {renderStars(review.rating)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(review.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <CalendarDaysIcon className="h-4 w-4 mr-1" />
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                {review.id && (
                                                    <Link href={route('admin.reviews.show', review.id)}>
                                                        <Button variant="ghost" size="sm">
                                                            <EyeIcon className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {review.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleApprove(review.id)}
                                                            className="text-green-600 hover:text-green-700"
                                                        >
                                                            <CheckIcon className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleReject(review.id)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <XMarkIcon className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {reviews.links && reviews.links.length > 0 && (
                        <div className="px-6 py-3 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-700">
                                    Showing {reviews.meta?.from || 0} to {reviews.meta?.to || 0} of {reviews.meta?.total || 0} results
                                </div>
                                <div className="flex space-x-1">
                                    {reviews.links
                                        .filter((link: any) => link && link.url && link.url !== null && link.url.trim() !== '')
                                        .map((link: any, index: number) => {
                                            // Additional safety check
                                            if (!link || !link.url) return null;
                                            
                                            return (
                                                <Link
                                                    key={`pagination-${index}-${link.url}`}
                                                    href={link.url}
                                                    className={cn(
                                                        "px-3 py-2 text-sm border rounded",
                                                        link.active
                                                            ? "bg-blue-500 text-white border-blue-500"
                                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    )}
                                                    preserveState
                                                >
                                                    <span dangerouslySetInnerHTML={{ __html: link.label || '' }} />
                                                </Link>
                                            );
                                        })
                                        .filter(Boolean)
                                    }
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AdminLayout>
    );
}