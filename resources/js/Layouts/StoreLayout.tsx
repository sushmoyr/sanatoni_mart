import { useState, PropsWithChildren, ReactNode } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    ShoppingCartIcon,
    UserIcon,
    MagnifyingGlassIcon,
    Bars3Icon,
    XMarkIcon,
    HeartIcon
} from '@heroicons/react/24/outline';

interface StoreLayoutProps extends PropsWithChildren {
    title?: string;
    description?: string;
}

interface FlashMessage {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

export default function StoreLayout({ children, title = 'Sanatoni Mart', description }: StoreLayoutProps) {
    const { auth, flash } = usePage<PageProps & { flash?: FlashMessage }>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to search results
            window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'Categories', href: '/categories' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <>
            <Head>
                <title>{title}</title>
                {description && <meta name="description" content={description} />}
            </Head>

            <div className="min-h-screen bg-white">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo */}
                            <div className="flex items-center">
                                <Link href="/" className="flex items-center">
                                    <img
                                        className="h-8 w-auto"
                                        src="/images/logo.png"
                                        alt="Sanatoni Mart"
                                        onError={(e) => {
                                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzMzNzNkYyIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0cHgiIGZvbnQtd2VpZ2h0PSJib2xkIj5TTTwvdGV4dD4KICA8L3N2Zz4=';
                                        }}
                                    />
                                    <span className="ml-2 text-xl font-bold text-gray-900">Sanatoni Mart</span>
                                </Link>
                            </div>

                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex space-x-8">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>

                            {/* Search Bar */}
                            <div className="hidden lg:flex flex-1 max-w-lg mx-8">
                                <form onSubmit={handleSearch} className="w-full">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <button
                                            type="submit"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Right side - User actions */}
                            <div className="flex items-center space-x-4">
                                {/* Wishlist */}
                                {auth.user && (
                                    <Link
                                        href="/wishlist"
                                        className="text-gray-500 hover:text-gray-900 relative"
                                    >
                                        <HeartIcon className="h-6 w-6" />
                                        <span className="sr-only">Wishlist</span>
                                    </Link>
                                )}

                                {/* Shopping Cart */}
                                <Link
                                    href="/cart"
                                    className="text-gray-500 hover:text-gray-900 relative"
                                >
                                    <ShoppingCartIcon className="h-6 w-6" />
                                    <span className="sr-only">Shopping cart</span>
                                    {/* Cart count badge - can be added later */}
                                </Link>

                                {/* User Menu */}
                                {auth.user ? (
                                    <div className="relative">
                                        <Link
                                            href="/dashboard"
                                            className="text-gray-500 hover:text-gray-900 flex items-center space-x-1"
                                        >
                                            <UserIcon className="h-6 w-6" />
                                            <span className="hidden md:block text-sm">{auth.user.name}</span>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            href="/login"
                                            className="text-gray-500 hover:text-gray-900 text-sm font-medium"
                                        >
                                            Sign in
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Sign up
                                        </Link>
                                    </div>
                                )}

                                {/* Mobile menu button */}
                                <button
                                    type="button"
                                    className="md:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                                    onClick={() => setMobileMenuOpen(true)}
                                >
                                    <span className="sr-only">Open main menu</span>
                                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    <div className="lg:hidden px-4 pb-4">
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    type="submit"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>
                        </form>
                    </div>
                </header>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="fixed inset-0 z-50">
                            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileMenuOpen(false)} />
                            <div className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white shadow-xl">
                                <div className="flex items-center justify-between px-4 py-6">
                                    <span className="text-lg font-semibold">Menu</span>
                                    <button
                                        type="button"
                                        className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white text-gray-500"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <span className="sr-only">Close menu</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="px-4 py-2">
                                    <div className="space-y-1">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                    {!auth.user && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <Link
                                                href="/login"
                                                className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Sign in
                                            </Link>
                                            <Link
                                                href="/register"
                                                className="mt-2 block px-3 py-2 text-base font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Sign up
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Flash Messages */}
                {flash && (
                    <div className="relative">
                        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 ${
                            flash.type === 'success' ? 'bg-green-50 border-green-200' :
                            flash.type === 'error' ? 'bg-red-50 border-red-200' :
                            flash.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                            'bg-blue-50 border-blue-200'
                        } border-l-4`}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    {flash.type === 'success' && (
                                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {flash.type === 'error' && (
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <p className={`text-sm font-medium ${
                                        flash.type === 'success' ? 'text-green-800' :
                                        flash.type === 'error' ? 'text-red-800' :
                                        flash.type === 'warning' ? 'text-yellow-800' :
                                        'text-blue-800'
                                    }`}>
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
                <footer className="bg-gray-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="col-span-1 md:col-span-2">
                                <div className="flex items-center">
                                    <img
                                        className="h-8 w-auto"
                                        src="/images/logo-white.png"
                                        alt="Sanatoni Mart"
                                        onError={(e) => {
                                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iI2ZmZmZmZiIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzNzNkYyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTRweCIgZm9udC13ZWlnaHQ9ImJvbGQiPlNNPC90ZXh0Pgo8L3N2Zz4=';
                                        }}
                                    />
                                    <span className="ml-2 text-xl font-bold">Sanatoni Mart</span>
                                </div>
                                <p className="mt-4 text-gray-400 max-w-md">
                                    Your trusted source for authentic religious products, spiritual items, and traditional crafts.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
                                <ul className="mt-4 space-y-2">
                                    <li><Link href="/products" className="text-gray-400 hover:text-white">Products</Link></li>
                                    <li><Link href="/categories" className="text-gray-400 hover:text-white">Categories</Link></li>
                                    <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                                    <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider">Support</h3>
                                <ul className="mt-4 space-y-2">
                                    <li><Link href="/help" className="text-gray-400 hover:text-white">Help Center</Link></li>
                                    <li><Link href="/shipping" className="text-gray-400 hover:text-white">Shipping Info</Link></li>
                                    <li><Link href="/returns" className="text-gray-400 hover:text-white">Returns</Link></li>
                                    <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
                            <p className="text-gray-400">&copy; 2024 Sanatoni Mart. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
