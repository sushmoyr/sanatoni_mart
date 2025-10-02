import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Card } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { 
    ArrowLeftIcon,
    StarIcon,
    ShieldCheckIcon,
    CalendarDaysIcon,
    UserIcon,
    HandThumbUpIcon,
    HandThumbDownIcon,
    EyeIcon,
    CheckIcon,
    XMarkIcon
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
    verified_purchase_data?: {
        order_id: number;
        order_date: string;
    };
    approved_at?: string;
    approved_by?: number;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
        email: string;
        profile_picture?: string;
    };
    product: {
        id: number;
        name: string;
        slug: string;
        main_image?: string;
        price: number;
    };
    approver?: {
        id: number;
        name: string;
    };
    helpful_votes_breakdown?: {
        helpful: number;
        not_helpful: number;
    };
}

interface Props extends PageProps {
    review: ProductReview;
}

export default function ReviewsShow({ review }: Props) {
    const handleApprove = () => {
        router.post(route('admin.reviews.approve', review.id), {}, {
            onSuccess: () => {
                // Success message will be shown via flash message
            }
        });
    };

    const handleReject = () => {
        router.post(route('admin.reviews.reject', review.id), {}, {
            onSuccess: () => {
                // Success message will be shown via flash message
            }
        });
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                        key={star}
                        className={cn(
                            "h-5 w-5",
                            star <= rating 
                                ? "text-amber-400 fill-current" 
                                : "text-gray-300"
                        )}
                    />
                ))}
                <span className="ml-2 text-lg font-medium text-gray-900">
                    {rating}.0
                </span>
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
            <Badge variant={variants[status as keyof typeof variants] || 'secondary'} size="md">
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    return (
        <AdminLayout>
            <Head title={`Review: ${review.title}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href={route('admin.reviews.index')}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                Back to Reviews
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Review Details</h1>
                            <p className="text-gray-600">Review ID: #{review.id}</p>
                        </div>
                    </div>
                    
                    {review.status === 'pending' && (
                        <div className="flex space-x-2">
                            <Button
                                variant="secondary"
                                onClick={handleApprove}
                                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            >
                                <CheckIcon className="h-4 w-4 mr-2" />
                                Approve Review
                            </Button>
                            <Button
                                variant="secondary" 
                                onClick={handleReject}
                                className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                            >
                                <XMarkIcon className="h-4 w-4 mr-2" />
                                Reject Review
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Review Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Review Details */}
                        <Card className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3">
                                            {renderStars(review.rating)}
                                            {getStatusBadge(review.status)}
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {review.title}
                                        </h2>
                                    </div>
                                </div>

                                <div className="prose prose-gray max-w-none">
                                    <p className="text-gray-700 leading-relaxed">
                                        {review.comment}
                                    </p>
                                </div>

                                {/* Review Metadata */}
                                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <CalendarDaysIcon className="h-4 w-4 mr-1" />
                                        {new Date(review.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>

                                    {review.verified_purchase_data && (
                                        <div className="flex items-center text-sm text-green-600">
                                            <ShieldCheckIcon className="h-4 w-4 mr-1" />
                                            Verified Purchase (Order #{review.verified_purchase_data.order_id})
                                        </div>
                                    )}

                                    {review.helpful_votes > 0 && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <HandThumbUpIcon className="h-4 w-4 mr-1" />
                                            {review.helpful_votes} found this helpful
                                        </div>
                                    )}
                                </div>

                                {review.approved_at && review.approver && (
                                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                                        <div className="text-sm text-green-800">
                                            <strong>Approved by:</strong> {review.approver.name} on{' '}
                                            {new Date(review.approved_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Helpful Votes Breakdown */}
                        {review.helpful_votes_breakdown && (
                            <Card className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Helpful Votes Breakdown
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center">
                                            <HandThumbUpIcon className="h-5 w-5 text-green-600 mr-2" />
                                            <span className="text-sm font-medium text-green-800">Helpful</span>
                                        </div>
                                        <span className="text-lg font-bold text-green-600">
                                            {review.helpful_votes_breakdown.helpful}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                        <div className="flex items-center">
                                            <HandThumbDownIcon className="h-5 w-5 text-red-600 mr-2" />
                                            <span className="text-sm font-medium text-red-800">Not Helpful</span>
                                        </div>
                                        <span className="text-lg font-bold text-red-600">
                                            {review.helpful_votes_breakdown.not_helpful}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Customer Information */}
                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        {review.user.profile_picture ? (
                                            <img
                                                src={`/storage/${review.user.profile_picture}`}
                                                alt={review.user.name}
                                                className="h-12 w-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                <UserIcon className="h-6 w-6 text-gray-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-lg font-medium text-gray-900">
                                            {review.user.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {review.user.email}
                                        </div>
                                    </div>
                                </div>

                                <Link 
                                    href={route('admin.users.show', review.user.id)}
                                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                                >
                                    <EyeIcon className="h-4 w-4 mr-1" />
                                    View Customer Profile
                                </Link>
                            </div>
                        </Card>

                        {/* Product Information */}
                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        {review.product.main_image ? (
                                            <img
                                                src={`/storage/${review.product.main_image}`}
                                                alt={review.product.name}
                                                className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                                            />
                                        ) : (
                                            <div className="h-16 w-16 rounded-lg bg-gray-200 border border-gray-300 flex items-center justify-center">
                                                <span className="text-gray-400 text-xs">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-lg font-medium text-gray-900">
                                            {review.product.name}
                                        </div>
                                        <div className="text-lg font-semibold text-green-600">
                                            ৳{review.product.price.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <Link 
                                    href={route('products.show', review.product.slug)}
                                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                                >
                                    <EyeIcon className="h-4 w-4 mr-1" />
                                    View Product Page
                                </Link>
                            </div>
                        </Card>

                        {/* Review Actions */}
                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                            <div className="space-y-3">
                                <Link 
                                    href={route('admin.reviews.index', { 
                                        search: review.user.name 
                                    })}
                                    className="block w-full"
                                >
                                    <Button variant="secondary" className="w-full justify-start">
                                        <UserIcon className="h-4 w-4 mr-2" />
                                        View All Reviews by This Customer
                                    </Button>
                                </Link>

                                <Link 
                                    href={route('admin.reviews.index', { 
                                        search: review.product.name 
                                    })}
                                    className="block w-full"
                                >
                                    <Button variant="secondary" className="w-full justify-start">
                                        <EyeIcon className="h-4 w-4 mr-2" />
                                        View All Reviews for This Product
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}