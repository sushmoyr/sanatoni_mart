import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import BrandedStoreLayout from '@/Layouts/BrandedStoreLayout';
import { 
    ShoppingBagIcon, 
    TruckIcon, 
    ShieldCheckIcon, 
    CreditCardIcon,
    StarIcon,
    ChevronRightIcon,
    FireIcon,
    SparklesIcon,
    ClockIcon,
    TagIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    sale_price?: number;
    images: { url: string; alt_text?: string }[];
    category: { name: string; slug: string };
}

interface Category {
    id: number;
    name: string;
    slug: string;
    products_count: number;
    image?: string;
}

interface FlashSale {
    id: number;
    name: string;
    end_date: string;
    discount_percentage: number;
}

interface Slider {
    id: number;
    title: string;
    subtitle?: string;
    description?: string;
    image_url: string;
    button_text?: string;
    button_link?: string;
    button_style: 'primary' | 'secondary' | 'outline';
    text_color: string;
    overlay_style: string;
    text_position: 'left' | 'center' | 'right';
    text_alignment: 'left' | 'center' | 'right';
}

interface WelcomeProps extends PageProps {
    sliders: Slider[];
    heroProducts: Product[];
    trendingProducts: Product[];
    newArrivals: Product[];
    bestSellers: Product[];
    flashSaleProducts: Product[];
    activeFlashSale?: FlashSale;
    categories: Category[];
    specialOffers: Product[];
    stats: {
        total_products: number;
        happy_customers: number;
        categories: number;
        years_experience: number;
    };
}

// Newsletter Signup Form Component
function NewsletterSignupForm() {
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        email: '',
    });

    const [showSuccess, setShowSuccess] = useState(false);

    // Handle successful submission
    useEffect(() => {
        if (wasSuccessful) {
            reset();
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000); // Hide after 5 seconds
        }
    }, [wasSuccessful]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('newsletter.subscribe'));
    };

    return (
        <div className="max-w-md mx-auto">
            {showSuccess && (
                <div className="mb-4 p-4 bg-green-600 text-white rounded-lg">
                    Thank you for subscribing! You will receive updates about our sacred products and special offers.
                </div>
            )}
            
            <form onSubmit={submit} className="flex space-x-4">
                <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    disabled={processing}
                />
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? 'Subscribing...' : 'Subscribe'}
                </button>
            </form>
            
            {errors.email && (
                <div className="mt-2 text-red-400 text-sm">
                    {errors.email}
                </div>
            )}
        </div>
    );
}

export default function Welcome(props: WelcomeProps) {
    const {
        sliders = [],
        heroProducts = [],
        trendingProducts = [],
        newArrivals = [],
        bestSellers = [],
        flashSaleProducts = [],
        activeFlashSale,
        categories = [],
        specialOffers = [],
        stats
    } = props;

    const [currentSliderIndex, setCurrentSliderIndex] = useState(0);
    const [flashSaleTimeLeft, setFlashSaleTimeLeft] = useState<string>('');

    // Determine what to show in hero section
    const hasSliders = sliders.length > 0;
    const heroContent = hasSliders ? sliders : heroProducts;

    // Hero slider auto-advance
    useEffect(() => {
        if (heroContent.length > 1) {
            const interval = setInterval(() => {
                setCurrentSliderIndex((prev) => (prev + 1) % heroContent.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [heroContent.length]);

    // Flash sale countdown
    useEffect(() => {
        if (activeFlashSale) {
            const updateCountdown = () => {
                const now = new Date().getTime();
                const endTime = new Date(activeFlashSale.end_date).getTime();
                const distance = endTime - now;

                if (distance > 0) {
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    setFlashSaleTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
                } else {
                    setFlashSaleTimeLeft('Ended');
                }
            };

            updateCountdown();
            const interval = setInterval(updateCountdown, 1000);
            return () => clearInterval(interval);
        }
    }, [activeFlashSale]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const calculateDiscount = (price: number, salePrice: number) => {
        return Math.round(((price - salePrice) / price) * 100);
    };

    const ProductCard = ({ product }: { product: Product }) => (
        <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="aspect-square overflow-hidden">
                <img
                    src={product.images[0]?.url || '/images/placeholder-product.jpg'}
                    alt={product.images[0]?.alt_text || product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.sale_price && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                        -{calculateDiscount(product.price, product.sale_price)}%
                    </div>
                )}
            </div>
            <div className="p-4">
                <p className="text-sm text-gray-500 mb-1">{product.category.name}</p>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {product.sale_price ? (
                            <>
                                <span className="text-lg font-bold text-red-600">
                                    {formatPrice(product.sale_price)}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(product.price)}
                                </span>
                            </>
                        ) : (
                            <span className="text-lg font-bold text-gray-900">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                    <Link
                        href={`/products/${product.slug}`}
                        className="bg-brand-600 text-white px-3 py-1 text-sm rounded hover:bg-brand-700 transition-colors"
                    >
                        View
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <BrandedStoreLayout>
            <Head title="Sanatoni Mart - Your Premium Shopping Destination" />

            {/* Hero Section */}
            {heroContent.length > 0 && (
                <section className="relative h-[500px] md:h-[600px] overflow-hidden">
                    {hasSliders ? (
                        /* Configurable Sliders */
                        <>
                            <div 
                                className="absolute inset-0 z-10" 
                                style={{ background: sliders[currentSliderIndex]?.overlay_style }}
                            />
                            <img
                                src={sliders[currentSliderIndex]?.image_url || '/images/hero-bg.jpg'}
                                alt={sliders[currentSliderIndex]?.title || 'Hero'}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 z-20 flex items-center">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                                    <div 
                                        className={`max-w-xl ${
                                            sliders[currentSliderIndex]?.text_position === 'center' ? 'mx-auto text-center' :
                                            sliders[currentSliderIndex]?.text_position === 'right' ? 'ml-auto text-right' :
                                            'mr-auto text-left'
                                        }`}
                                    >
                                        <h1 
                                            className={`text-4xl md:text-6xl font-bold mb-4 ${
                                                sliders[currentSliderIndex]?.text_alignment === 'center' ? 'text-center' :
                                                sliders[currentSliderIndex]?.text_alignment === 'right' ? 'text-right' :
                                                'text-left'
                                            }`}
                                            style={{ color: sliders[currentSliderIndex]?.text_color }}
                                        >
                                            {sliders[currentSliderIndex]?.title}
                                        </h1>
                                        {sliders[currentSliderIndex]?.subtitle && (
                                            <h2 
                                                className={`text-xl md:text-2xl mb-4 ${
                                                    sliders[currentSliderIndex]?.text_alignment === 'center' ? 'text-center' :
                                                    sliders[currentSliderIndex]?.text_alignment === 'right' ? 'text-right' :
                                                    'text-left'
                                                }`}
                                                style={{ color: sliders[currentSliderIndex]?.text_color }}
                                            >
                                                {sliders[currentSliderIndex]?.subtitle}
                                            </h2>
                                        )}
                                        {sliders[currentSliderIndex]?.description && (
                                            <p 
                                                className={`text-lg mb-8 ${
                                                    sliders[currentSliderIndex]?.text_alignment === 'center' ? 'text-center' :
                                                    sliders[currentSliderIndex]?.text_alignment === 'right' ? 'text-right' :
                                                    'text-left'
                                                }`}
                                                style={{ color: sliders[currentSliderIndex]?.text_color }}
                                            >
                                                {sliders[currentSliderIndex]?.description}
                                            </p>
                                        )}
                                        {sliders[currentSliderIndex]?.button_text && sliders[currentSliderIndex]?.button_link && (
                                            <div className={
                                                sliders[currentSliderIndex]?.text_alignment === 'center' ? 'text-center' :
                                                sliders[currentSliderIndex]?.text_alignment === 'right' ? 'text-right' :
                                                'text-left'
                                            }>
                                                <Link
                                                    href={sliders[currentSliderIndex]?.button_link}
                                                    className={`px-8 py-3 rounded-lg font-semibold inline-flex items-center transition-colors ${
                                                        sliders[currentSliderIndex]?.button_style === 'secondary' ? 'bg-gray-600 text-white hover:bg-gray-700' :
                                                        sliders[currentSliderIndex]?.button_style === 'outline' ? 'border-2 border-white text-white hover:bg-white hover:text-gray-900' :
                                                        'bg-brand-600 text-white hover:bg-brand-700'
                                                    }`}
                                                >
                                                    {sliders[currentSliderIndex]?.button_text}
                                                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Fallback Hero Products */
                        <>
                            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />
                            <img
                                src={heroProducts[currentSliderIndex]?.images[0]?.url || '/images/hero-bg.jpg'}
                                alt="Hero"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 z-20 flex items-center">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="max-w-xl">
                                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                            Premium Quality Products
                                        </h1>
                                        <p className="text-xl text-gray-200 mb-8">
                                            Discover our curated collection of high-quality products at unbeatable prices.
                                        </p>
                                        <div className="flex space-x-4">
                                            <Link
                                                href="/products"
                                                className="bg-brand-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors inline-flex items-center"
                                            >
                                                Shop Now
                                                <ArrowRightIcon className="ml-2 h-5 w-5" />
                                            </Link>
                                            <Link
                                                href="/categories"
                                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
                                            >
                                                Browse Categories
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    
                    {/* Hero Dots Indicator */}
                    {heroContent.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
                            {heroContent.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSliderIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                        index === currentSliderIndex ? 'bg-white' : 'bg-white/50'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Flash Sale Section */}
            {activeFlashSale && flashSaleProducts.length > 0 && (
                <section className="py-16 bg-gradient-to-r from-red-500 to-red-600">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <div className="flex items-center justify-center mb-4">
                                <FireIcon className="h-8 w-8 text-white mr-2" />
                                <h2 className="text-3xl font-bold text-white">Flash Sale</h2>
                            </div>
                            <p className="text-red-100 mb-4">Limited time offer - Up to {activeFlashSale.discount_percentage}% off!</p>
                            <div className="bg-white/20 backdrop-blur rounded-lg px-6 py-3 inline-block">
                                <div className="flex items-center text-white">
                                    <ClockIcon className="h-5 w-5 mr-2" />
                                    <span className="font-mono text-lg font-bold">{flashSaleTimeLeft}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {flashSaleProducts.slice(0, 6).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        
                        <div className="text-center mt-8">
                            <Link
                                href="/flash-sale"
                                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
                            >
                                View All Flash Sale Items
                                <ChevronRightIcon className="ml-2 h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Categories Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
                        <p className="text-gray-600">Explore our wide range of product categories</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.slice(0, 8).map((category) => (
                            <Link
                                key={category.id}
                                href={`/categories/${category.slug}/products`}
                                className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-square hover:shadow-lg transition-shadow"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                <div className="absolute inset-0 z-20 flex flex-col justify-end p-4">
                                    <h3 className="text-white font-semibold text-lg mb-1">{category.name}</h3>
                                    <p className="text-gray-200 text-sm">{category.products_count} products</p>
                                </div>
                                <div className="w-full h-full bg-brand-100 flex items-center justify-center">
                                    <ShoppingBagIcon className="h-16 w-16 text-brand-600" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trending Products */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trending Products</h2>
                            <p className="text-gray-600">Most popular items this week</p>
                        </div>
                        <Link
                            href="/products?sort=trending"
                            className="text-brand-600 hover:text-brand-700 font-semibold inline-flex items-center"
                        >
                            View All
                            <ChevronRightIcon className="ml-1 h-5 w-5" />
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {trendingProducts.slice(0, 8).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Special Offers */}
            {specialOffers.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <div className="flex items-center mb-4">
                                    <TagIcon className="h-8 w-8 text-brand-600 mr-2" />
                                    <h2 className="text-3xl font-bold text-gray-900">Special Offers</h2>
                                </div>
                                <p className="text-gray-600">Limited time deals you don't want to miss</p>
                            </div>
                            <Link
                                href="/products?on_sale=1"
                                className="text-brand-600 hover:text-brand-700 font-semibold inline-flex items-center"
                            >
                                View All Deals
                                <ChevronRightIcon className="ml-1 h-5 w-5" />
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {specialOffers.slice(0, 6).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* New Arrivals & Best Sellers */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* New Arrivals */}
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <SparklesIcon className="h-6 w-6 text-brand-600 mr-2" />
                                        <h3 className="text-2xl font-bold text-gray-900">New Arrivals</h3>
                                    </div>
                                    <p className="text-gray-600">Latest additions to our collection</p>
                                </div>
                                <Link
                                    href="/products?sort=newest"
                                    className="text-brand-600 hover:text-brand-700 font-semibold text-sm inline-flex items-center"
                                >
                                    View All
                                    <ChevronRightIcon className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                            
                            <div className="space-y-4">
                                {newArrivals.slice(0, 4).map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.slug}`}
                                        className="flex items-center space-x-4 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <img
                                            src={product.images[0]?.url || '/images/placeholder-product.jpg'}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">{product.name}</h4>
                                            <p className="text-sm text-gray-600">{product.category.name}</p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                {product.sale_price ? (
                                                    <>
                                                        <span className="font-bold text-red-600">
                                                            {formatPrice(product.sale_price)}
                                                        </span>
                                                        <span className="text-sm text-gray-500 line-through">
                                                            {formatPrice(product.price)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="font-bold text-gray-900">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Best Sellers */}
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <StarSolidIcon className="h-6 w-6 text-yellow-500 mr-2" />
                                        <h3 className="text-2xl font-bold text-gray-900">Best Sellers</h3>
                                    </div>
                                    <p className="text-gray-600">Customer favorites</p>
                                </div>
                                <Link
                                    href="/products?sort=best_selling"
                                    className="text-brand-600 hover:text-brand-700 font-semibold text-sm inline-flex items-center"
                                >
                                    View All
                                    <ChevronRightIcon className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                            
                            <div className="space-y-4">
                                {bestSellers.slice(0, 4).map((product, index) => (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.slug}`}
                                        className="flex items-center space-x-4 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-center w-8 h-8 bg-brand-600 text-white rounded-full font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <img
                                            src={product.images[0]?.url || '/images/placeholder-product.jpg'}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">{product.name}</h4>
                                            <p className="text-sm text-gray-600">{product.category.name}</p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                {product.sale_price ? (
                                                    <>
                                                        <span className="font-bold text-red-600">
                                                            {formatPrice(product.sale_price)}
                                                        </span>
                                                        <span className="text-sm text-gray-500 line-through">
                                                            {formatPrice(product.price)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="font-bold text-gray-900">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-brand-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Why Choose Sanatoni Mart?</h2>
                        <p className="text-brand-100">Join thousands of satisfied customers</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white mb-2">{stats?.total_products?.toLocaleString() || '1,000+'}</div>
                            <p className="text-brand-100">Products</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white mb-2">{stats?.happy_customers?.toLocaleString() || '50,000+'}</div>
                            <p className="text-brand-100">Happy Customers</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white mb-2">{stats?.categories || '50+'}</div>
                            <p className="text-brand-100">Categories</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white mb-2">{stats?.years_experience || '5+'}</div>
                            <p className="text-brand-100">Years Experience</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Signup */}
            <section className="py-16 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
                        <p className="text-gray-300 mb-8">Get the latest deals and product updates delivered to your inbox</p>
                        
                        <NewsletterSignupForm />
                    </div>
                </div>
            </section>
        </BrandedStoreLayout>
    );
}
