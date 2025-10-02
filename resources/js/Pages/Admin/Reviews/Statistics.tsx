import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Card } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { 
    ArrowLeftIcon,
    StarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    UsersIcon,
    ChatBubbleLeftRightIcon,
    HandThumbUpIcon,
    ShieldCheckIcon,
    CalendarDaysIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface ReviewStatistics {
    total_reviews: number;
    pending_reviews: number;
    approved_reviews: number;
    rejected_reviews: number;
    average_rating: number;
    total_helpful_votes: number;
    verified_reviews: number;
    reviews_this_month: number;
    reviews_last_month: number;
    rating_distribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
    top_rated_products: Array<{
        id: number;
        name: string;
        slug: string;
        average_rating: number;
        reviews_count: number;
        main_image?: string;
    }>;
    recent_activity: Array<{
        type: 'review_submitted' | 'review_approved' | 'review_rejected';
        review_id: number;
        product_name: string;
        user_name: string;
        date: string;
    }>;
    monthly_trends: Array<{
        month: string;
        reviews_count: number;
        average_rating: number;
    }>;
}

interface Props extends PageProps {
    statistics: ReviewStatistics;
}

export default function ReviewsStatistics({ statistics }: Props) {
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
                <span className="ml-1 text-sm font-medium">
                    {rating.toFixed(1)}
                </span>
            </div>
        );
    };

    const getRatingBarWidth = (count: number) => {
        const maxCount = Math.max(...Object.values(statistics.rating_distribution));
        return maxCount > 0 ? (count / maxCount) * 100 : 0;
    };

    const getGrowthPercentage = () => {
        if (statistics.reviews_last_month === 0) return 0;
        return ((statistics.reviews_this_month - statistics.reviews_last_month) / statistics.reviews_last_month) * 100;
    };

    const growthPercentage = getGrowthPercentage();

    return (
        <AdminLayout>
            <Head title="Review Statistics" />
            
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
                            <h1 className="text-2xl font-bold text-gray-900">Review Statistics</h1>
                            <p className="text-gray-600">Analytics and insights for customer reviews</p>
                        </div>
                    </div>
                </div>

                {/* Overview Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                                <p className="text-2xl font-bold text-gray-900">{statistics.total_reviews}</p>
                            </div>
                            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            {growthPercentage >= 0 ? (
                                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                            ) : (
                                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                            )}
                            <span className={cn(
                                "text-sm font-medium",
                                growthPercentage >= 0 ? "text-green-600" : "text-red-600"
                            )}>
                                {Math.abs(growthPercentage).toFixed(1)}%
                            </span>
                            <span className="text-sm text-gray-500 ml-1">vs last month</span>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                                <p className="text-2xl font-bold text-gray-900">{statistics.average_rating.toFixed(1)}</p>
                            </div>
                            <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                <StarIcon className="h-6 w-6 text-amber-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            {renderStars(statistics.average_rating)}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                                <p className="text-2xl font-bold text-amber-600">{statistics.pending_reviews}</p>
                            </div>
                            <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                <CalendarDaysIcon className="h-6 w-6 text-amber-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link href={route('admin.reviews.index', { status: 'pending' })}>
                                <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 p-0">
                                    Review pending items →
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Verified Reviews</p>
                                <p className="text-2xl font-bold text-green-600">{statistics.verified_reviews}</p>
                            </div>
                            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">
                                {((statistics.verified_reviews / statistics.total_reviews) * 100).toFixed(1)}% of total
                            </span>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Rating Distribution */}
                    <Card className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-6">Rating Distribution</h3>
                        <div className="space-y-4">
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center">
                                    <div className="flex items-center w-16">
                                        <span className="text-sm font-medium text-gray-700 mr-2">{rating}</span>
                                        <StarIcon className="h-4 w-4 text-amber-400 fill-current" />
                                    </div>
                                    <div className="flex-1 mx-4">
                                        <div className="bg-gray-200 rounded-full h-3">
                                            <div 
                                                className="bg-amber-400 h-3 rounded-full transition-all duration-300"
                                                style={{ width: `${getRatingBarWidth(statistics.rating_distribution[rating as keyof typeof statistics.rating_distribution])}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900 w-12 text-right">
                                        {statistics.rating_distribution[rating as keyof typeof statistics.rating_distribution]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Monthly Trends */}
                    <Card className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-6">Monthly Trends</h3>
                        {statistics.monthly_trends.length > 0 ? (
                            <div className="space-y-4">
                                {statistics.monthly_trends.slice(-6).map((trend, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {trend.month}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {renderStars(trend.average_rating)}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-gray-900">
                                                {trend.reviews_count} reviews
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                <ChartBarIcon className="h-12 w-12 mx-auto mb-2" />
                                <p>No trend data available</p>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Top Rated Products */}
                <Card className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Top Rated Products</h3>
                    {statistics.top_rated_products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {statistics.top_rated_products.slice(0, 6).map((product) => (
                                <div key={product.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0">
                                        {product.main_image ? (
                                            <img
                                                src={`/storage/${product.main_image}`}
                                                alt={product.name}
                                                className="h-12 w-12 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <span className="text-gray-400 text-xs">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <Link 
                                            href={route('products.show', product.slug)}
                                            className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                                        >
                                            {product.name}
                                        </Link>
                                        <div className="flex items-center justify-between mt-1">
                                            {renderStars(product.average_rating)}
                                            <span className="text-xs text-gray-500">
                                                {product.reviews_count} reviews
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            <StarIcon className="h-12 w-12 mx-auto mb-2" />
                            <p>No product ratings available</p>
                        </div>
                    )}
                </Card>

                {/* Recent Activity */}
                <Card className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Recent Activity</h3>
                    {statistics.recent_activity.length > 0 ? (
                        <div className="space-y-4">
                            {statistics.recent_activity.slice(0, 10).map((activity, index) => (
                                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                    <div className="flex items-center space-x-3">
                                        <div className={cn(
                                            "h-2 w-2 rounded-full",
                                            activity.type === 'review_submitted' ? 'bg-blue-400' :
                                            activity.type === 'review_approved' ? 'bg-green-400' : 'bg-red-400'
                                        )} />
                                        <div>
                                            <div className="text-sm text-gray-900">
                                                <span className="font-medium">{activity.user_name}</span>
                                                {activity.type === 'review_submitted' && ' submitted a review for '}
                                                {activity.type === 'review_approved' && ' had their review approved for '}
                                                {activity.type === 'review_rejected' && ' had their review rejected for '}
                                                <span className="font-medium">{activity.product_name}</span>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(activity.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <Link href={route('admin.reviews.show', activity.review_id)}>
                                        <Button variant="ghost" size="sm">
                                            View
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            <CalendarDaysIcon className="h-12 w-12 mx-auto mb-2" />
                            <p>No recent activity</p>
                        </div>
                    )}
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 text-center">
                        <div className="text-3xl font-bold text-green-600">
                            {statistics.approved_reviews}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Approved Reviews</div>
                        <div className="text-xs text-gray-500 mt-2">
                            {((statistics.approved_reviews / statistics.total_reviews) * 100).toFixed(1)}% approval rate
                        </div>
                    </Card>

                    <Card className="p-6 text-center">
                        <div className="text-3xl font-bold text-purple-600">
                            {statistics.total_helpful_votes}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Total Helpful Votes</div>
                        <div className="text-xs text-gray-500 mt-2">
                            Community engagement
                        </div>
                    </Card>

                    <Card className="p-6 text-center">
                        <div className="text-3xl font-bold text-red-600">
                            {statistics.rejected_reviews}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Rejected Reviews</div>
                        <div className="text-xs text-gray-500 mt-2">
                            {((statistics.rejected_reviews / statistics.total_reviews) * 100).toFixed(1)}% rejection rate
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}