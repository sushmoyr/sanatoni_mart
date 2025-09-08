import React from 'react';
import { Link } from '@inertiajs/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
    MagnifyingGlassIcon,
    ShoppingCartIcon,
    UserIcon,
    Bars3Icon,
    HeartIcon,
} from '@heroicons/react/24/outline';
import { Button } from './Button';
import { Badge } from './Badge';

const headerNavigationVariants = cva(
    'w-full bg-semantic-surface border-b border-neutral-200',
    {
        variants: {
            variant: {
                default: 'shadow-e1',
                elevated: 'shadow-e2',
                transparent: 'bg-transparent border-transparent',
            },
            size: {
                default: 'h-16',
                compact: 'h-12',
                large: 'h-20',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface HeaderNavigationProps
    extends React.HTMLAttributes<HTMLElement>,
        VariantProps<typeof headerNavigationVariants> {
    cartItemCount?: number;
    user?: {
        name: string;
        email: string;
    };
    categories?: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
}

const HeaderNavigation = React.forwardRef<HTMLElement, HeaderNavigationProps>(
    ({ className, variant, size, cartItemCount = 0, user, categories = [], ...props }, ref) => {
        const [isSearchOpen, setIsSearchOpen] = React.useState(false);
        const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

        return (
            <nav
                className={cn(headerNavigationVariants({ variant, size }), className)}
                ref={ref}
                {...props}
            >
                <div className="container-custom">
                    <div className="flex items-center justify-between h-full">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">SM</span>
                                </div>
                                <span className="font-serif font-bold text-xl text-semantic-text">
                                    Sanatoni Mart
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-8">
                            {/* Main Navigation Links */}
                            <div className="flex items-center space-x-6">
                                <Link
                                    href="/products"
                                    className="text-semantic-text hover:text-brand-600 transition-colors font-medium"
                                >
                                    Products
                                </Link>
                                {categories.slice(0, 3).map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/products?category=${category.slug}`}
                                        className="text-semantic-textSub hover:text-brand-600 transition-colors"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                                <Link
                                    href="/about"
                                    className="text-semantic-textSub hover:text-brand-600 transition-colors"
                                >
                                    About
                                </Link>
                                <Link
                                    href="/contact"
                                    className="text-semantic-textSub hover:text-brand-600 transition-colors"
                                >
                                    Contact
                                </Link>
                            </div>
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center space-x-3">
                            {/* Search Button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="hidden sm:flex"
                            >
                                <MagnifyingGlassIcon className="h-5 w-5" />
                                <span className="sr-only">Search</span>
                            </Button>

                            {/* Wishlist */}
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/wishlist">
                                    <HeartIcon className="h-5 w-5" />
                                    <span className="sr-only">Wishlist</span>
                                </Link>
                            </Button>

                            {/* Cart */}
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/cart" className="relative">
                                    <ShoppingCartIcon className="h-5 w-5" />
                                    {cartItemCount > 0 && (
                                        <Badge
                                            variant="danger"
                                            size="sm"
                                            className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 text-xs flex items-center justify-center"
                                        >
                                            {cartItemCount > 99 ? '99+' : cartItemCount}
                                        </Badge>
                                    )}
                                    <span className="sr-only">Cart ({cartItemCount} items)</span>
                                </Link>
                            </Button>

                            {/* User Menu */}
                            {user ? (
                                <div className="relative">
                                    <Button variant="ghost" size="sm">
                                        <UserIcon className="h-5 w-5" />
                                        <span className="hidden sm:inline ml-2">{user.name}</span>
                                    </Button>
                                    {/* User dropdown would go here */}
                                </div>
                            ) : (
                                <div className="hidden sm:flex items-center space-x-2">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/login">Login</Link>
                                    </Button>
                                    <Button variant="primary" size="sm" asChild>
                                        <Link href="/register">Sign Up</Link>
                                    </Button>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden"
                            >
                                <Bars3Icon className="h-5 w-5" />
                                <span className="sr-only">Menu</span>
                            </Button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    {isSearchOpen && (
                        <div className="absolute top-full left-0 right-0 bg-semantic-surface border-b border-neutral-200 shadow-e2 z-50">
                            <div className="container-custom py-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
                                        autoFocus
                                    />
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-semantic-textSub" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden absolute top-full left-0 right-0 bg-semantic-surface border-b border-neutral-200 shadow-e2 z-50">
                            <div className="container-custom py-4 space-y-4">
                                <Link
                                    href="/products"
                                    className="block py-2 text-semantic-text hover:text-brand-600 transition-colors font-medium"
                                >
                                    Products
                                </Link>
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/products?category=${category.slug}`}
                                        className="block py-2 text-semantic-textSub hover:text-brand-600 transition-colors"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                                <Link
                                    href="/about"
                                    className="block py-2 text-semantic-textSub hover:text-brand-600 transition-colors"
                                >
                                    About
                                </Link>
                                <Link
                                    href="/contact"
                                    className="block py-2 text-semantic-textSub hover:text-brand-600 transition-colors"
                                >
                                    Contact
                                </Link>
                                {!user && (
                                    <div className="pt-4 border-t border-neutral-200">
                                        <div className="flex flex-col space-y-2">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href="/login">Login</Link>
                                            </Button>
                                            <Button variant="primary" size="sm" asChild>
                                                <Link href="/register">Sign Up</Link>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        );
    }
);

HeaderNavigation.displayName = 'HeaderNavigation';

export { HeaderNavigation, headerNavigationVariants };
