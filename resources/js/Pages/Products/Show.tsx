import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import BrandedStoreLayout from '@/Layouts/BrandedStoreLayout';
import { PageProps, Product, Category, ProductImage } from '@/types';
import { Card } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/Components/ui/Modal';
import { 
    ShoppingCartIcon, 
    HeartIcon,
    ShareIcon,
    StarIcon,
    MinusIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Review {
    id: number;
    user_id: number;
    rating: number;
    title: string;
    comment: string;
    created_at: string;
    user: {
        name: string;
    };
    verified_purchase_data?: any;
}

interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    breakdown: Record<number, number>;
}

interface ProductShowProps extends PageProps {
    product: Product & {
        category: Category;
        images: ProductImage[];
    };
    reviewStats: ReviewStats;
    recentReviews: Review[];
    userHasReviewed: boolean;
}

export default function Show({ product, reviewStats, recentReviews, userHasReviewed }: ProductShowProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    
    const reviewForm = useForm({
        rating: 0,
        title: '',
        comment: ''
    });

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        reviewForm.post(route('products.reviews.store', product.id), {
            onSuccess: () => {
                setIsReviewModalOpen(false);
                setReviewRating(0);
                setHoveredRating(0);
                reviewForm.reset();
                // Refresh the page to show the new review
                router.reload();
            }
        });
    };

    const renderStarRating = (rating: number, interactive: boolean = false) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className={`h-5 w-5 ${interactive ? 'cursor-pointer' : 'cursor-default'} ${
                            star <= rating ? 'text-amber-400' : 'text-gray-300'
                        }`}
                        onClick={interactive ? () => {
                            setReviewRating(star);
                            reviewForm.setData('rating', star);
                        } : undefined}
                        onMouseEnter={interactive ? () => setHoveredRating(star) : undefined}
                        onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
                        disabled={!interactive}
                    >
                        <StarIcon 
                            className={`h-5 w-5 ${
                                star <= (interactive ? (hoveredRating || reviewRating) : rating) 
                                    ? 'fill-current' 
                                    : 'fill-none'
                            }`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    const handleAddToCart = () => {
        router.post('/cart', {
            product_id: product.id,
            quantity: quantity
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Flash message will be shown automatically
            }
        });
    };

    const handleWishlistToggle = () => {
        if (isWishlisted) {
            router.delete(`/wishlist/${product.id}`, {
                preserveScroll: true,
                onSuccess: () => setIsWishlisted(false)
            });
        } else {
            router.post('/wishlist', {
                product_id: product.id
            }, {
                preserveScroll: true,
                onSuccess: () => setIsWishlisted(true)
            });
        }
    };

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

    const primaryImage = product.images?.find(img => img.is_main) || product.images?.[0];
    const otherImages = product.images?.filter(img => !img.is_main) || [];

    return (
        <BrandedStoreLayout title={product.name} description={product.description}>
            <div className="py-8">
                <div className="container-custom">
                    {/* Breadcrumb */}
                    <nav className="flex mb-8" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm">
                            <li className="inline-flex items-center">
                                <Link href="/" className="text-semantic-textSub hover:text-brand-600 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <ChevronRightIcon className="h-3 w-3 mx-2 text-semantic-textSub" />
                                    <Link href="/products" className="text-semantic-textSub hover:text-brand-600 transition-colors">
                                        Products
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <ChevronRightIcon className="h-3 w-3 mx-2 text-semantic-textSub" />
                                    <span className="text-semantic-textSub">{product.category?.name}</span>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <ChevronRightIcon className="h-3 w-3 mx-2 text-semantic-textSub" />
                                    <span className="text-semantic-text font-medium">{product.name}</span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
                        {/* Image gallery */}
                        <div className="flex flex-col-reverse">
                            {/* Image selector */}
                            {product.images && product.images.length > 1 && (
                                <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                                    <div className="grid grid-cols-4 gap-4">
                                        {product.images.map((image, index) => (
                                            <button
                                                key={image.id}
                                                className={`relative h-20 bg-white rounded-lg flex items-center justify-center cursor-pointer hover:shadow-e2 transition-all ${
                                                    selectedImage === index ? 'ring-2 ring-brand-500 shadow-e2' : 'shadow-e1'
                                                }`}
                                                onClick={() => setSelectedImage(index)}
                                            >
                                                <span className="sr-only">Image {index + 1}</span>
                                                <img
                                                    src={`/storage/${image.image_path}`}
                                                    alt={image.alt_text || product.name}
                                                    className="w-full h-full object-center object-cover rounded-lg"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Main image */}
                            <div className="w-full aspect-square">
                                <Card className="relative overflow-hidden">
                                    <img
                                        src={primaryImage ? `/storage/${primaryImage.image_path}` : '/images/placeholder.jpg'}
                                        alt={primaryImage?.alt_text || product.name}
                                        className="w-full h-full object-center object-cover cursor-zoom-in"
                                        onClick={() => setIsImageModalOpen(true)}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsImageModalOpen(true)}
                                        className="absolute top-4 right-4 bg-white/80 backdrop-blur-support hover:bg-white"
                                    >
                                        <MagnifyingGlassIcon className="h-4 w-4" />
                                    </Button>
                                </Card>
                            </div>
                        </div>

                        {/* Product info */}
                        <div className="mt-10 lg:mt-0">
                            <div className="flex items-center gap-3 mb-4">
                                <Badge variant="secondary" size="sm">
                                    {product.category?.name}
                                </Badge>
                                {product.featured && (
                                    <Badge variant="success" size="sm">
                                        Featured
                                    </Badge>
                                )}
                            </div>

                            <h1 className="text-3xl font-serif font-bold text-semantic-text mb-4">
                                {product.name}
                            </h1>

                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <StarIcon
                                                key={i}
                                                className={`h-5 w-5 ${
                                                    i < Math.round(reviewStats.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-semantic-textSub">
                                        ({reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''})
                                    </span>
                                    {reviewStats.averageRating > 0 && (
                                        <span className="text-sm text-semantic-textSub ml-1">
                                            {reviewStats.averageRating.toFixed(1)}
                                        </span>
                                    )}
                                </div>
                                <p className="text-3xl font-bold text-brand-600 font-tnum">
                                    ৳{product.price}
                                </p>
                            </div>

                            <div className="mb-6">
                                <p className="text-semantic-text leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Stock status */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-semantic-textSub">Availability:</span>
                                    <Badge 
                                        variant={product.stock_quantity > 0 ? "success" : "danger"}
                                        size="sm"
                                    >
                                        {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} available)` : 'Out of Stock'}
                                    </Badge>
                                </div>
                            </div>

                            {/* Add to cart form */}
                            <form onSubmit={(e) => { e.preventDefault(); handleAddToCart(); }} className="space-y-6">
                                {/* Quantity selector */}
                                <div>
                                    <label htmlFor="quantity" className="block text-sm font-medium text-semantic-text mb-2">
                                        Quantity
                                    </label>
                                    <div className="flex items-center w-32">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            onClick={decrementQuantity}
                                            className="rounded-r-none border-r-0"
                                        >
                                            <MinusIcon className="h-4 w-4" />
                                        </Button>
                                        <Input
                                            type="number"
                                            id="quantity"
                                            value={quantity}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            min="1"
                                            max={product.stock_quantity}
                                        />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            onClick={incrementQuantity}
                                            className="rounded-l-none border-l-0"
                                        >
                                            <PlusIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={product.stock_quantity === 0}
                                        className="flex-1"
                                    >
                                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                                        Add to Cart
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleWishlistToggle}
                                        className="sm:w-auto"
                                    >
                                        {isWishlisted ? (
                                            <HeartSolidIcon className="h-5 w-5 text-red-500 mr-2" />
                                        ) : (
                                            <HeartIcon className="h-5 w-5 mr-2" />
                                        )}
                                        {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="sm:w-auto"
                                    >
                                        <ShareIcon className="h-5 w-5 mr-2" />
                                        Share
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="mt-16">
                        <Card>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-semantic-text">Customer Reviews</h3>
                                    {!userHasReviewed && (
                                        <Button 
                                            variant="secondary"
                                            onClick={() => {
                                                setIsReviewModalOpen(true);
                                            }}
                                        >
                                            Write a Review
                                        </Button>
                                    )}
                                </div>

                                {/* Review Summary */}
                                {reviewStats.totalReviews > 0 ? (
                                    <>
                                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                                            <div className="flex items-center space-x-4">
                                                <div className="text-center">
                                                    <div className="text-4xl font-bold text-semantic-text">
                                                        {reviewStats.averageRating.toFixed(1)}
                                                    </div>
                                                    <div className="flex justify-center mt-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <StarIcon
                                                                key={i}
                                                                className={`h-5 w-5 ${
                                                                    i < Math.round(reviewStats.averageRating) 
                                                                        ? 'text-yellow-400 fill-current' 
                                                                        : 'text-gray-300'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="text-sm text-semantic-textSub mt-1">
                                                        Based on {reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Rating Breakdown */}
                                            <div className="space-y-2">
                                                {[5, 4, 3, 2, 1].map((rating) => (
                                                    <div key={rating} className="flex items-center space-x-2">
                                                        <span className="text-sm text-semantic-textSub w-12">
                                                            {rating} star{rating !== 1 ? 's' : ''}
                                                        </span>
                                                        <div className="flex-1 bg-neutral-200 rounded-full h-2">
                                                            <div
                                                                className="bg-yellow-400 h-2 rounded-full"
                                                                style={{
                                                                    width: `${reviewStats.totalReviews > 0 
                                                                        ? (reviewStats.breakdown[rating] / reviewStats.totalReviews) * 100 
                                                                        : 0}%`
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-sm text-semantic-textSub w-8">
                                                            {reviewStats.breakdown[rating] || 0}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Recent Reviews */}
                                        <div className="border-t border-neutral-200 pt-6">
                                            <h4 className="text-lg font-semibold text-semantic-text mb-4">Recent Reviews</h4>
                                            <div className="space-y-6">
                                                {recentReviews.map((review) => (
                                                    <div key={review.id} className="border-b border-neutral-200 pb-6 last:border-b-0">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                                                                    <span className="text-brand-600 font-semibold text-sm">
                                                                        {review.user.name.charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-semantic-text">
                                                                        {review.user.name}
                                                                        {review.verified_purchase_data && (
                                                                            <Badge variant="success" size="sm" className="ml-2">
                                                                                Verified Purchase
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <div className="flex">
                                                                            {[...Array(5)].map((_, i) => (
                                                                                <StarIcon
                                                                                    key={i}
                                                                                    className={`h-4 w-4 ${
                                                                                        i < review.rating 
                                                                                            ? 'text-yellow-400 fill-current' 
                                                                                            : 'text-gray-300'
                                                                                    }`}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                        <span className="text-sm text-semantic-textSub">
                                                                            {new Date(review.created_at).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {review.title && (
                                                            <h5 className="font-medium text-semantic-text mb-2">
                                                                {review.title}
                                                            </h5>
                                                        )}
                                                        
                                                        <p className="text-semantic-text leading-relaxed">
                                                            {review.comment}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {recentReviews.length > 0 && (
                                                <div className="text-center mt-6">
                                                    <Button variant="secondary">
                                                        View All {reviewStats.totalReviews} Reviews
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-semantic-textSub text-lg mb-4">
                                            No reviews yet. Be the first to review this product!
                                        </div>
                                        {!userHasReviewed && (
                                            <Button>
                                                Write the First Review
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Image modal */}
            {isImageModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm"
                            onClick={() => setIsImageModalOpen(false)}
                        ></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <Card className="inline-block align-bottom text-left overflow-hidden shadow-e4 transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsImageModalOpen(false)}
                                    className="bg-white/80 backdrop-blur-support hover:bg-white"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </Button>
                            </div>
                            <div className="p-6">
                                <img
                                    src={primaryImage ? `/storage/${primaryImage.image_path}` : '/images/placeholder.jpg'}
                                    alt={primaryImage?.alt_text || product.name}
                                    className="w-full h-auto max-h-[70vh] object-contain"
                                />
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* Review Submission Modal */}
            <Modal
                isOpen={isReviewModalOpen}
                onClose={() => {
                    setIsReviewModalOpen(false);
                    setReviewRating(0);
                    setHoveredRating(0);
                    reviewForm.reset();
                }}
                title="Write a Review"
                size="lg"
            >
                <form onSubmit={handleReviewSubmit}>
                    <ModalBody>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-medium text-semantic-text mb-2">
                                    {product.name}
                                </h4>
                                <p className="text-semantic-textSub text-sm">
                                    Share your experience with this product
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-semantic-text mb-2">
                                    Rating *
                                </label>
                                {renderStarRating(reviewRating, true)}
                                {reviewForm.errors.rating && (
                                    <p className="text-red-600 text-sm mt-1">{reviewForm.errors.rating}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="review-title" className="block text-sm font-medium text-semantic-text mb-2">
                                    Review Title *
                                </label>
                                <Input
                                    id="review-title"
                                    type="text"
                                    value={reviewForm.data.title}
                                    onChange={(e) => reviewForm.setData('title', e.target.value)}
                                    placeholder="Summarize your review in one line"
                                    className="w-full"
                                />
                                {reviewForm.errors.title && (
                                    <p className="text-red-600 text-sm mt-1">{reviewForm.errors.title}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="review-comment" className="block text-sm font-medium text-semantic-text mb-2">
                                    Your Review *
                                </label>
                                <textarea
                                    id="review-comment"
                                    value={reviewForm.data.comment}
                                    onChange={(e) => reviewForm.setData('comment', e.target.value)}
                                    placeholder="Tell others about your experience with this product..."
                                    rows={4}
                                    className="w-full px-3 py-2 border border-semantic-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                />
                                {reviewForm.errors.comment && (
                                    <p className="text-red-600 text-sm mt-1">{reviewForm.errors.comment}</p>
                                )}
                            </div>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setIsReviewModalOpen(false);
                                setReviewRating(0);
                                setHoveredRating(0);
                                reviewForm.reset();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={reviewForm.processing || !reviewRating}
                        >
                            {reviewForm.processing ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>
        </BrandedStoreLayout>
    );
}
