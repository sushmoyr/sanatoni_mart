import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';
import { PageProps, Product, Category, ProductImage } from '@/types';
import { 
    ShoppingCartIcon, 
    HeartIcon,
    ShareIcon,
    StarIcon,
    MinusIcon,
    PlusIcon,
    MagnifyingGlassIcon
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
        <StoreLayout title={product.name} description={product.description}>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex mb-8" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <a href="/" className="text-gray-700 hover:text-blue-600">
                                    Home
                                </a>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <span className="mx-1">/</span>
                                    <a href="/products" className="text-gray-700 hover:text-blue-600">
                                        Products
                                    </a>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <span className="mx-1">/</span>
                                    <span className="text-gray-500">{product.category?.name}</span>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <span className="mx-1">/</span>
                                    <span className="text-gray-500">{product.name}</span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                        {/* Image gallery */}
                        <div className="flex flex-col-reverse">
                            {/* Image selector */}
                            {product.images && product.images.length > 1 && (
                                <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                                    <div className="grid grid-cols-4 gap-6">
                                        {product.images.map((image, index) => (
                                            <button
                                                key={image.id}
                                                className={`relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50 ${
                                                    selectedImage === index ? 'ring-2 ring-blue-500' : ''
                                                }`}
                                                onClick={() => setSelectedImage(index)}
                                            >
                                                <span className="sr-only">Image {index + 1}</span>
                                                <img
                                                    src={`/storage/${image.image_path}`}
                                                    alt={image.alt_text || product.name}
                                                    className="w-full h-full object-center object-cover rounded-md"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Main image */}
                            <div className="w-full aspect-w-1 aspect-h-1">
                                <div className="relative">
                                    <img
                                        src={primaryImage ? `/storage/${primaryImage.image_path}` : '/images/placeholder.jpg'}
                                        alt={primaryImage?.alt_text || product.name}
                                        className="w-full h-full object-center object-cover sm:rounded-lg cursor-zoom-in"
                                        onClick={() => setIsImageModalOpen(true)}
                                    />
                                    <button
                                        onClick={() => setIsImageModalOpen(true)}
                                        className="absolute top-4 right-4 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200"
                                    >
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-700" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Product info */}
                        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                                {product.name}
                            </h1>

                            <div className="mt-3">
                                <h2 className="sr-only">Product information</h2>
                                <p className="text-3xl text-gray-900">৳{product.price}</p>
                            </div>

                            {/* Rating */}
                            <div className="mt-3">
                                <h3 className="sr-only">Reviews</h3>
                                <div className="flex items-center">
                                    <div className="flex items-center">
                                        {[0, 1, 2, 3, 4].map((rating) => (
                                            <StarIcon
                                                key={rating}
                                                className="text-yellow-400 h-5 w-5 flex-shrink-0"
                                                aria-hidden="true"
                                            />
                                        ))}
                                    </div>
                                    <p className="sr-only">5 out of 5 stars</p>
                                    <a href="#" className="ml-3 text-sm font-medium text-blue-600 hover:text-blue-500">
                                        117 reviews
                                    </a>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="sr-only">Description</h3>
                                <div className="text-base text-gray-700 space-y-6">
                                    <p>{product.description}</p>
                                </div>
                            </div>

                            {/* Category */}
                            <div className="mt-6">
                                <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-500">Category:</span>
                                    <span className="ml-2 text-sm text-gray-900">{product.category?.name}</span>
                                </div>
                            </div>

                            {/* Stock status */}
                            <div className="mt-6">
                                <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-500">Availability:</span>
                                    <span className={`ml-2 text-sm font-medium ${
                                        product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} available)` : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>

                            {/* Add to cart form */}
                            <form className="mt-6" onSubmit={(e) => { e.preventDefault(); handleAddToCart(); }}>
                                <div className="mt-10 flex flex-col sm:flex-row sm:items-center">
                                    {/* Quantity selector */}
                                    <div className="flex items-center">
                                        <label htmlFor="quantity" className="text-sm font-medium text-gray-700 mr-4">
                                            Quantity:
                                        </label>
                                        <div className="flex items-center border border-gray-300 rounded-md">
                                            <button
                                                type="button"
                                                onClick={decrementQuantity}
                                                className="p-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <MinusIcon className="h-4 w-4" />
                                            </button>
                                            <input
                                                type="number"
                                                id="quantity"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-16 text-center border-0 focus:ring-0"
                                                min="1"
                                                max={product.stock_quantity}
                                            />
                                            <button
                                                type="button"
                                                onClick={incrementQuantity}
                                                className="p-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <PlusIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Add to cart button */}
                                    <button
                                        type="submit"
                                        disabled={product.stock_quantity === 0}
                                        className="mt-4 sm:mt-0 sm:ml-4 flex-1 bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                                        Add to Cart
                                    </button>
                                </div>

                                {/* Wishlist and Share buttons */}
                                <div className="mt-6 flex">
                                    <button
                                        type="button"
                                        onClick={handleWishlistToggle}
                                        className="group flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        {isWishlisted ? (
                                            <HeartSolidIcon className="h-5 w-5 text-red-500 mr-2" />
                                        ) : (
                                            <HeartIcon className="h-5 w-5 text-gray-400 group-hover:text-red-500 mr-2" />
                                        )}
                                        {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                    </button>

                                    <button
                                        type="button"
                                        className="ml-4 group flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <ShareIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 mr-2" />
                                        Share
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Product details tabs */}
                    <div className="mt-16">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                <button className="border-blue-600 text-blue-600 border-b-2 py-4 px-1 text-sm font-medium">
                                    Description
                                </button>
                                <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-4 px-1 text-sm font-medium">
                                    Specifications
                                </button>
                                <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-4 px-1 text-sm font-medium">
                                    Reviews
                                </button>
                            </nav>
                        </div>

                        <div className="py-8">
                            <div className="prose prose-sm max-w-none text-gray-700">
                                <p>{product.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image modal */}
            {isImageModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div 
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => setIsImageModalOpen(false)}
                        ></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onClick={() => setIsImageModalOpen(false)}
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="mt-3 text-center sm:mt-0">
                                <img
                                    src={primaryImage ? `/storage/${primaryImage.image_path}` : '/images/placeholder.jpg'}
                                    alt={primaryImage?.alt_text || product.name}
                                    className="w-full h-auto max-h-96 object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </StoreLayout>
    );
}
