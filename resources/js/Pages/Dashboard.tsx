import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, Button } from '@/Components/ui';
import { 
    ShoppingBagIcon, 
    HeartIcon, 
    ShoppingCartIcon,
    UserIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-serif font-semibold leading-tight text-semantic-text">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 sacred-bg min-h-screen">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Welcome Section */}
                        <Card className="p-8 text-center devotional-border">
                            <div className="inline-flex items-center bg-brand-50 text-brand-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                                <SparklesIcon className="h-4 w-4 mr-2 animate-divine-pulse" />
                                Sacred Dashboard
                            </div>
                            
                            <h1 className="text-3xl font-serif font-bold text-semantic-text mb-4">
                                Welcome to Your Sacred Journey
                            </h1>
                            <p className="text-lg text-semantic-textSub mb-8 max-w-2xl mx-auto">
                                You're successfully connected to your spiritual marketplace. 
                                Explore authentic religious products and manage your devotional needs.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild>
                                    <Link href="/products">
                                        <ShoppingBagIcon className="h-5 w-5 mr-2" />
                                        Explore Products
                                    </Link>
                                </Button>
                                <Button variant="secondary" asChild>
                                    <Link href="/categories/deities">
                                        Browse Deities
                                    </Link>
                                </Button>
                            </div>
                        </Card>

                        {/* Quick Actions */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="p-6 text-center hover:shadow-e2 transition-all duration-300 devotional-border">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-100 text-brand-600 rounded-full mb-4">
                                    <ShoppingCartIcon className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-serif font-semibold text-semantic-text mb-2">
                                    Shopping Cart
                                </h3>
                                <p className="text-semantic-textSub text-sm mb-4">
                                    View and manage your sacred items
                                </p>
                                <Button variant="tertiary" size="sm" asChild>
                                    <Link href="/cart">View Cart</Link>
                                </Button>
                            </Card>

                            <Card className="p-6 text-center hover:shadow-e2 transition-all duration-300 devotional-border">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-100 text-brand-600 rounded-full mb-4">
                                    <HeartIcon className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-serif font-semibold text-semantic-text mb-2">
                                    Wishlist
                                </h3>
                                <p className="text-semantic-textSub text-sm mb-4">
                                    Items saved for later devotion
                                </p>
                                <Button variant="tertiary" size="sm" asChild>
                                    <Link href="/wishlist">View Wishlist</Link>
                                </Button>
                            </Card>

                            <Card className="p-6 text-center hover:shadow-e2 transition-all duration-300 devotional-border">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-100 text-brand-600 rounded-full mb-4">
                                    <UserIcon className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-serif font-semibold text-semantic-text mb-2">
                                    Profile
                                </h3>
                                <p className="text-semantic-textSub text-sm mb-4">
                                    Manage your account settings
                                </p>
                                <Button variant="tertiary" size="sm" asChild>
                                    <Link href="/profile">Edit Profile</Link>
                                </Button>
                            </Card>
                        </div>

                        {/* Spiritual Quote */}
                        <Card className="p-8 text-center bg-gradient-to-br from-brand-50 to-accent-50 devotional-border">
                            <blockquote className="text-lg font-serif italic text-semantic-text mb-4">
                                "The mind is everything. What you think you become."
                            </blockquote>
                            <cite className="text-sm text-semantic-textSub">- Buddha</cite>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
