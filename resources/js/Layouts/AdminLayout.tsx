import { ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { User } from '@/types';
import FlashMessages from '@/Components/FlashMessages';

interface NavigationItem {
    name: string;
    href: string;
    icon: string;
    permission?: string;
}

interface NavigationSection {
    title: string;
    items: NavigationItem[];
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { auth } = usePage().props as { auth: { user: User } };
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigationSections: NavigationSection[] = [
        {
            title: 'Overview',
            items: [
                { name: 'Dashboard', href: route('admin.dashboard'), icon: '📊' },
            ]
        },
        {
            title: 'Catalog Management',
            items: [
                { name: 'Categories', href: route('admin.categories.index'), icon: '📁', permission: 'view_categories' },
                { name: 'Products', href: route('admin.products.index'), icon: '📦', permission: 'view_products' },
                { name: 'Flash Sales', href: route('admin.flash-sales.index'), icon: '⚡', permission: 'view_products' },
            ]
        },
        {
            title: 'Marketing',
            items: [
                { name: 'Sliders', href: route('admin.sliders.index'), icon: '🖼️', permission: 'view_products' },
                { name: 'Coupons', href: route('admin.coupons.index'), icon: '🎫', permission: 'view_products' },
                { name: 'Reviews', href: route('admin.reviews.index'), icon: '⭐', permission: 'view_products' },
                { name: 'Newsletters', href: route('admin.newsletters.index'), icon: '📧', permission: 'view_products' },
            ]
        },
        {
            title: 'Operations',
            items: [
                { name: 'Shipping Zones', href: route('admin.shipping-zones.index'), icon: '🚚', permission: 'view_products' },
                { name: 'Reports', href: route('admin.reports.inventory'), icon: '📈', permission: 'view_products' },
            ]
        },
        {
            title: 'User Management',
            items: [
                { name: 'Users', href: route('admin.users.index'), icon: '👥', permission: 'view_users' },
            ]
        }
    ];

    const userNavigation = [
        { name: 'Profile', href: route('profile.edit') },
        { name: 'Sign out', href: route('logout'), method: 'post' },
    ];

    const hasPermission = (permission?: string) => {
        if (!permission) return true;
        return auth.user.permissions.includes(permission);
    };

    const isActiveRoute = (href: string) => {
        const path = href.replace(window.location.origin, '').substring(1);
        return route().current(path);
    };

    return (
        <div className="min-h-screen bg-semantic-bg flex">
            <FlashMessages />
            
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-semantic-surface border-r border-semantic-border transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0`}>
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-semantic-border">
                        <Link href={route('admin.dashboard')} className="group">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-serif font-bold text-semantic-text group-hover:text-primary-600 transition-colors">
                                    Sanatoni Mart
                                </span>
                            </div>
                            <div className="text-xs text-semantic-textSub font-medium">
                                Admin Panel
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-2 py-4 space-y-6 overflow-y-auto">
                        {navigationSections.map((section) => (
                            <div key={section.title}>
                                <h3 className="px-3 text-xs font-semibold text-semantic-textSub uppercase tracking-wider mb-3">
                                    {section.title}
                                </h3>
                                <div className="space-y-1">
                                    {section.items.map((item) => (
                                        hasPermission(item.permission) && (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                                                    isActiveRoute(item.href)
                                                        ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                                                        : 'text-semantic-textSub hover:bg-semantic-surface hover:text-semantic-text'
                                                }`}
                                            >
                                                <span className="mr-3 text-lg">{item.icon}</span>
                                                {item.name}
                                            </Link>
                                        )
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* User profile */}
                    <div className="flex-shrink-0 border-t border-semantic-border p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                        <span className="text-primary-600 font-medium text-sm">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-semantic-text">{auth.user.name}</p>
                                    <p className="text-xs text-semantic-textSub">
                                        {auth.user.roles[0]?.display_name || 'User'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-1">
                                {userNavigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        method={item.method as any}
                                        className="text-semantic-textSub hover:text-semantic-text p-1 rounded transition-colors"
                                        title={item.name}
                                    >
                                        {item.name === 'Profile' ? '👤' : '🚪'}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar for mobile */}
                <div className="sticky top-0 z-40 flex h-16 flex-shrink-0 items-center gap-x-4 bg-semantic-surface border-b border-semantic-border px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-semantic-textSub lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                    <div className="text-lg font-serif font-bold text-semantic-text">
                        Sanatoni Mart Admin
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1 relative overflow-hidden">
                    <div className="py-10">
                        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
