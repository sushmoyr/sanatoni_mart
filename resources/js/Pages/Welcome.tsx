import React from 'react';
import { PageProps, Product, Category } from '@/types';
import { Head, Link } from '@inertiajs/react';
import BrandedStoreLayout from '@/Layouts/BrandedStoreLayout';
import { Button, Card, Badge, ProductCard } from '@/Components/ui';
import { 
    ShoppingBagIcon, 
    StarIcon, 
    TruckIcon, 
    ShieldCheckIcon,
    HeartIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

interface WelcomePageProps extends PageProps {
    featuredProducts?: Product[];
    categories?: Category[];
}

export default function Welcome({ auth, featuredProducts = [], categories = [] }: WelcomePageProps) {
    const features = [
        {
            icon: <ShieldCheckIcon className="h-8 w-8" />,
            title: "Authentic Products",
            description: "Every item is verified for authenticity and blessed with sanctity"
        },
        {
            icon: <TruckIcon className="h-8 w-8" />,
            title: "Sacred Delivery",
            description: "Free delivery on orders above ৳1000, handled with care and respect"
        },
        {
            icon: <StarIcon className="h-8 w-8" />,
            title: "Premium Quality",
            description: "Handcrafted religious items made with devotion and traditional methods"
        },
        {
            icon: <HeartIcon className="h-8 w-8" />,
            title: "Made with Love",
            description: "Each product carries the blessings and positive energy of our artisans"
        }
    ];

    const testimonials = [
        {
            name: "Radha Devi",
            location: "Dhaka",
            rating: 5,
            comment: "The quality of the brass deities is exceptional. You can feel the divine energy in every piece."
        },
        {
            name: "Suresh Kumar",
            location: "Chittagong", 
            rating: 5,
            comment: "Authentic rudraksha beads and excellent service. Highly recommended for all devotees."
        },
        {
            name: "Anita Sharma",
            location: "Sylhet",
            rating: 5,
            comment: "Beautiful collection of pooja items. Everything arrived safely and well-packaged."
        }
    ];

    return (
        <BrandedStoreLayout title="Sanatoni Mart - Sacred & Authentic Religious Products" description="Discover authentic Hindu religious products, deities, pooja samagri, and spiritual items. Ethically sourced and blessed with sanctity.">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 sacred-bg opacity-30"></div>
                <div className="absolute inset-0 lotus-pattern opacity-20"></div>
                <div className="relative">
                    <div className="container-custom py-16 md:py-24">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="text-center lg:text-left">
                                <div className="inline-flex items-center bg-brand-50 text-brand-700 px-4 py-2 rounded-full text-sm font-medium mb-6 devotional-border-gold">
                                    <SparklesIcon className="h-4 w-4 mr-2 animate-divine-pulse" />
                                    Blessed • Authentic • Sacred
                                </div>
                                
                                <h1 className="text-4xl md:text-6xl font-serif font-bold text-semantic-text leading-tight mb-6">
                                    Sacred Items for Your
                                    <span className="text-brand-600 block animate-sacred-glow">Divine Journey</span>
                                </h1>
                                
                                <p className="text-lg text-semantic-textSub mb-8 max-w-xl leading-relaxed">
                                    Discover our curated collection of authentic religious products, 
                                    handcrafted with devotion and ethically sourced from traditional artisans across India.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Button size="lg" asChild className="divine-glow">
                                        <Link href="/products">
                                            <ShoppingBagIcon className="h-5 w-5 mr-2" />
                                            Explore Collection
                                        </Link>
                                    </Button>
                                    <Button variant="secondary" size="lg" asChild>
                                        <Link href="/categories/deities">
                                            Browse Deities
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <div className="relative z-10 bg-white/80 backdrop-blur-support rounded-2xl p-8 shadow-e3 devotional-border">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-brand-600 mb-1 font-tnum">1000+</div>
                                            <div className="text-sm text-semantic-textSub">Sacred Items</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-brand-600 mb-1 font-tnum">50K+</div>
                                            <div className="text-sm text-semantic-textSub">Happy Devotees</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-brand-600 mb-1 font-tnum">24/7</div>
                                            <div className="text-sm text-semantic-textSub">Sacred Support</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-brand-600 mb-1 font-tnum">100%</div>
                                            <div className="text-sm text-semantic-textSub">Authentic</div>
                                        </div>
                                    </div>
                                </div>
                                {/* Sacred geometry decoration */}
                                <div className="absolute -top-4 -right-4 w-16 h-16 mandala-bg opacity-60 animate-divine-pulse"></div>
                                <div className="absolute -bottom-4 -left-4 w-12 h-12 om-pattern opacity-40"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-neutral-50 sacred-gradient">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-semantic-text mb-4">
                            Why Choose Sanatoni Mart?
                        </h2>
                        <p className="text-semantic-textSub max-w-2xl mx-auto">
                            We are committed to providing authentic, high-quality religious products 
                            that honor your spiritual journey and devotional practices.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="text-center p-6 hover:shadow-e2 transition-all duration-300 hover:scale-105 devotional-border-gold">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 text-brand-600 rounded-full mb-4 animate-divine-pulse">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-semantic-text mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-semantic-textSub text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            {categories.length > 0 && (
                <section className="py-16">
                    <div className="container-custom">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-serif font-bold text-semantic-text mb-4">
                                Sacred Categories
                            </h2>
                            <p className="text-semantic-textSub max-w-2xl mx-auto">
                                Explore our carefully curated categories of religious and spiritual items
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.slice(0, 6).map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/categories/${category.slug || category.id}`}
                                    className="group block"
                                >
                                    <Card className="p-6 text-center hover:shadow-e2 transition-all duration-300 group-hover:scale-105">
                                        <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-accent-500 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                                            🕉
                                        </div>
                                        <h3 className="text-lg font-semibold text-semantic-text mb-2">
                                            {category.name}
                                        </h3>
                                        <p className="text-semantic-textSub text-sm">
                                            {category.description || `Discover our ${category.name.toLowerCase()} collection`}
                                        </p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                        
                        <div className="text-center mt-8">
                            <Button variant="tertiary" asChild>
                                <Link href="/categories">View All Categories</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="py-16 bg-neutral-50">
                    <div className="container-custom">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-serif font-bold text-semantic-text mb-4">
                                Featured Sacred Items
                            </h2>
                            <p className="text-semantic-textSub max-w-2xl mx-auto">
                                Hand-picked spiritual products that bring peace, prosperity, and divine blessings
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.slice(0, 8).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        
                        <div className="text-center mt-8">
                            <Button asChild>
                                <Link href="/products">
                                    <ShoppingBagIcon className="h-4 w-4 mr-2" />
                                    View All Products
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials */}
            <section className="py-16">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-semantic-text mb-4">
                            Devotee Testimonials
                        </h2>
                        <p className="text-semantic-textSub max-w-2xl mx-auto">
                            Hear from our community of satisfied customers and devotees
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="p-6">
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-semantic-textSub text-sm leading-relaxed mb-4">
                                    "{testimonial.comment}"
                                </p>
                                <div>
                                    <div className="font-medium text-semantic-text">{testimonial.name}</div>
                                    <div className="text-xs text-semantic-textSub">{testimonial.location}</div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-brand-500 to-accent-500 text-white relative overflow-hidden">
                <div className="absolute inset-0 om-pattern opacity-10"></div>
                <div className="absolute top-0 left-0 right-0 h-8 temple-arch bg-gradient-to-r from-brand-400 to-accent-400"></div>
                <div className="container-custom text-center relative z-10">
                    <h2 className="text-3xl font-serif font-bold mb-4 animate-sacred-glow">
                        Begin Your Sacred Journey Today
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        Join thousands of devotees who trust Sanatoni Mart for their spiritual needs. 
                        Experience the divine energy in every product.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="secondary" size="lg" asChild className="divine-glow">
                            <Link href="/products">
                                Start Shopping
                            </Link>
                        </Button>
                        {!auth.user && (
                            <Button variant="tertiary" size="lg" asChild>
                                <Link href="/register">
                                    Create Account
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </section>
        </BrandedStoreLayout>
    );
}
