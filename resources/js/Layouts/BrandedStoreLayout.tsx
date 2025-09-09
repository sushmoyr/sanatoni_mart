import { useState, PropsWithChildren } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { HeaderNavigation } from '@/Components/ui/HeaderNavigation';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Input } from '@/Components/ui/Input';
import { Avatar } from '@/Components/ui/Avatar';
import Dropdown from '@/Components/Dropdown';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { cn } from '@/lib/utils';
import {
    ShoppingCartIcon,
    UserIcon,
    MagnifyingGlassIcon,
    Bars3Icon,
    XMarkIcon,
    HeartIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface BrandedStoreLayoutProps extends PropsWithChildren {
    title?: string;
    description?: string;
}

interface FlashMessage {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

export default function BrandedStoreLayout({ children, title = 'Sanatoni Mart', description }: BrandedStoreLayoutProps) {
    const { auth, flash, locale, available_languages } = usePage<PageProps & { flash?: FlashMessage }>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'Deities', href: '/categories/deities' },
        { name: 'Pooja Samagri', href: '/categories/pooja-samagri' },
        { name: 'Scriptures', href: '/categories/scriptures' },
        { name: 'Beads', href: '/categories/beads' },
    ];

    return (
        <>
            <Head>
                <title>{title}</title>
                {description && <meta name="description" content={description} />}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <div className="min-h-screen bg-semantic-bg sacred-bg">
                {/* Utility Bar */}
                <div className="bg-brand-700 text-white py-1">
                    <div className="container-custom">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-4">
                                <span>✨ Authentic religious products • Ethically sourced</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span>📞 +880 1234-567890</span>
                                <span>🚚 Free delivery on orders above ৳1000</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Header */}
                <header className="bg-white/80 backdrop-blur-support border-b border-semantic-border sticky top-0 z-40">
                    <div className="container-custom">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo */}
                            <div className="flex items-center">
                                <Link href="/" className="flex items-center group">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg mr-3 transition-transform group-hover:scale-105">
                                        🕉
                                    </div>
                                    <div>
                                        <div className="text-xl font-serif font-bold text-semantic-text tracking-tight">
                                            Sanatoni Mart
                                        </div>
                                        <div className="text-xs text-semantic-textSub -mt-1">
                                            Sacred & Authentic
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Desktop Navigation */}
                            <nav className="hidden lg:flex space-x-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="px-3 py-2 text-sm font-medium text-semantic-textSub hover:text-semantic-text hover:bg-brand-50 rounded-md transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>

                            {/* Search Bar */}
                            <div className="hidden md:flex flex-1 max-w-lg mx-8">
                                {/* <Search 
                                    placeholder="Search sacred items..."
                                    className="w-full"
                                /> */}
                                <Input 
                                    placeholder="Search sacred items..."
                                    className="w-full"
                                />
                            </div>

                            {/* User Actions */}
                            <div className="flex items-center space-x-3">
                                {/* Language Switcher */}
                                <LanguageSwitcher 
                                    currentLocale={locale}
                                    availableLanguages={available_languages}
                                    className=""
                                />

                                {/* Wishlist */}
                                {auth.user && (
                                    <Link
                                        href="/wishlist"
                                        className="p-2 text-semantic-textSub hover:text-semantic-text hover:bg-brand-50 rounded-md transition-colors relative"
                                    >
                                        <HeartIcon className="h-6 w-6" />
                                        <span className="sr-only">Wishlist</span>
                                    </Link>
                                )}

                                {/* Shopping Cart */}
                                <Link
                                    href="/cart"
                                    className="p-2 text-semantic-textSub hover:text-semantic-text hover:bg-brand-50 rounded-md transition-colors relative"
                                >
                                    <ShoppingCartIcon className="h-6 w-6" />
                                    <span className="sr-only">Shopping cart</span>
                                    {/* Cart count badge - can be added later */}
                                </Link>

                                {/* User Menu */}
                                {auth.user ? (
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <div className="flex items-center space-x-2 p-2 text-semantic-textSub hover:text-semantic-text hover:bg-brand-50 rounded-md transition-colors cursor-pointer">
                                                <Avatar 
                                                    name={auth.user.name} 
                                                    size="sm"
                                                />
                                                <span className="hidden lg:block text-sm font-medium">
                                                    {auth.user.name}
                                                </span>
                                            </div>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content align="right">
                                            <Dropdown.Link href="/profile">
                                                <div className="flex items-center space-x-2">
                                                    <UserCircleIcon className="h-4 w-4" />
                                                    <span>My Profile</span>
                                                </div>
                                            </Dropdown.Link>
                                            <Dropdown.Link href="/orders">
                                                <div className="flex items-center space-x-2">
                                                    <ShoppingCartIcon className="h-4 w-4" />
                                                    <span>My Orders</span>
                                                </div>
                                            </Dropdown.Link>
                                            <Dropdown.Link href="/settings">
                                                <div className="flex items-center space-x-2">
                                                    <Cog6ToothIcon className="h-4 w-4" />
                                                    <span>Settings</span>
                                                </div>
                                            </Dropdown.Link>
                                            <hr className="my-1 border-gray-200" />
                                            <Dropdown.Link href="/logout" method="post">
                                                <div className="flex items-center space-x-2">
                                                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                                                    <span>Sign Out</span>
                                                </div>
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Button variant="tertiary" size="sm" asChild>
                                            <Link href="/login">Sign in</Link>
                                        </Button>
                                        <Button size="sm" asChild>
                                            <Link href="/register">Sign up</Link>
                                        </Button>
                                    </div>
                                )}

                                {/* Mobile menu button */}
                                <button
                                    type="button"
                                    className="lg:hidden p-2 text-semantic-textSub hover:text-semantic-text hover:bg-brand-50 rounded-md transition-colors"
                                    onClick={() => setMobileMenuOpen(true)}
                                >
                                    <span className="sr-only">Open main menu</span>
                                    <Bars3Icon className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Search Bar */}
                        <div className="md:hidden pb-4">
                            {/* <Search placeholder="Search sacred items..." /> */}
                            <Input placeholder="Search sacred items..." />
                        </div>
                    </div>
                </header>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden fixed inset-0 z-50">
                        <div className="fixed inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
                        <div className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white shadow-e3">
                            <div className="flex items-center justify-between p-6 border-b border-semantic-border">
                                <span className="text-lg font-serif font-semibold text-semantic-text">Menu</span>
                                <button
                                    type="button"
                                    className="p-2 text-semantic-textSub hover:text-semantic-text rounded-md"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="space-y-2">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="block px-3 py-2 text-base font-medium text-semantic-text hover:bg-brand-50 rounded-md transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                                {!auth.user && (
                                    <div className="mt-6 pt-6 border-t border-semantic-border space-y-2">
                                        <Button variant="tertiary" className="w-full justify-start" asChild>
                                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                                Sign in
                                            </Link>
                                        </Button>
                                        <Button className="w-full" asChild>
                                            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                                Sign up
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Flash Messages */}
                {flash && (
                    <div className="relative">
                        <div className={cn(
                            "container-custom py-4 border-l-4",
                            flash.type === 'success' ? 'bg-success-50 border-success-500' :
                            flash.type === 'error' ? 'bg-danger-50 border-danger-500' :
                            flash.type === 'warning' ? 'bg-warning-50 border-warning-500' :
                            'bg-accent-50 border-accent-500'
                        )}>
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    {flash.type === 'success' && (
                                        <svg className="h-5 w-5 text-success-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {flash.type === 'error' && (
                                        <svg className="h-5 w-5 text-danger-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <p className={cn(
                                        "text-sm font-medium",
                                        flash.type === 'success' ? 'text-success-800' :
                                        flash.type === 'error' ? 'text-danger-800' :
                                        flash.type === 'warning' ? 'text-warning-800' :
                                        'text-accent-800'
                                    )}>
                                        {flash.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1">
                    {children}
                </main>

                {/* Footer */}
                <footer className="bg-neutral-900 text-white mt-16">
                    <div className="container-custom py-12">
                        {/* Trust Bar */}
                        <div className="flex flex-wrap justify-center items-center gap-8 pb-8 mb-8 border-b border-neutral-700">
                            <div className="flex items-center space-x-2 text-sm">
                                <span className="text-green-400">🔒</span>
                                <span>Secure Checkout</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <span className="text-blue-400">💰</span>
                                <span>Cash on Delivery</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <span className="text-yellow-400">↩️</span>
                                <span>Easy Returns</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <span className="text-purple-400">✅</span>
                                <span>Verified Products</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="col-span-1 md:col-span-2">
                                <div className="flex items-center mb-4">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg mr-3">
                                        🕉
                                    </div>
                                    <div>
                                        <div className="text-xl font-serif font-bold">Sanatoni Mart</div>
                                        <div className="text-sm text-gray-400">Sacred & Authentic</div>
                                    </div>
                                </div>
                                <p className="text-gray-400 max-w-md text-sm leading-relaxed">
                                    Your trusted source for authentic religious products, spiritual items, and traditional crafts. 
                                    Every product is ethically sourced and blessed with sanctity.
                                </p>
                                <div className="mt-4">
                                    <Badge variant="secondary" size="sm">
                                        Certified Authentic • Ethically Sourced • Packed with Sanctity
                                    </Badge>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
                                    Categories
                                </h3>
                                <ul className="space-y-2">
                                    {['Deities', 'Pooja Samagri', 'Scriptures', 'Rudraksha', 'Tulsi Malas', 'Incense'].map(item => (
                                        <li key={item}>
                                            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                                {item}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
                                    Support
                                </h3>
                                <ul className="space-y-2">
                                    {['Help Center', 'Care Instructions', 'Shipping Info', 'Returns', 'Privacy Policy', 'Terms'].map(item => (
                                        <li key={item}>
                                            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                                {item}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        
                        <div className="mt-8 pt-8 border-t border-neutral-700 text-center">
                            <p className="text-gray-400 text-sm">
                                &copy; 2024 Sanatoni Mart. All rights reserved. Made with devotion 🙏
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
