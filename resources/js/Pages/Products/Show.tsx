import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import BrandedStoreLayout from '@/Layouts/BrandedStoreLayout';
import { PageProps, Product, Category, ProductImage } from '@/types';
import { Card } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
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

interface ProductShowProps extends PageProps {
    product: Product & {
        category: Category;
        images: ProductImage[];
    };
}

export default function Show({ product }: ProductShowProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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
                                                    i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-semantic-textSub">(24 reviews)</span>
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

                    {/* Product details tabs */}
                    <div className="mt-16">
                        <Card>
                            <div className="border-b border-neutral-200">
                                <nav className="-mb-px flex space-x-8 px-6">
                                    <button className="border-brand-500 text-brand-600 border-b-2 py-4 px-1 text-sm font-medium">
                                        Description
                                    </button>
                                    <button className="border-transparent text-semantic-textSub hover:text-semantic-text hover:border-neutral-300 border-b-2 py-4 px-1 text-sm font-medium transition-colors">
                                        Specifications
                                    </button>
                                    <button className="border-transparent text-semantic-textSub hover:text-semantic-text hover:border-neutral-300 border-b-2 py-4 px-1 text-sm font-medium transition-colors">
                                        Reviews
                                    </button>
                                </nav>
                            </div>

                            <div className="p-6">
                                <div className="prose prose-sm max-w-none text-semantic-text">
                                    <p>{product.description}</p>
                                </div>
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
        </BrandedStoreLayout>
    );
}
