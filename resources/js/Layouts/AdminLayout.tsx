import { ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { User } from '@/types';
import FlashMessages from '@/Components/FlashMessages';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { auth } = usePage().props as { auth: { user: User } };

    const navigation = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: '📊' },
        { name: 'Categories', href: route('admin.categories.index'), icon: '📁', permission: 'view_categories' },
        { name: 'Products', href: route('admin.products.index'), icon: '📦', permission: 'view_products' },
        { name: 'Flash Sales', href: route('admin.flash-sales.index'), icon: '⚡', permission: 'view_products' },
        { name: 'Coupons', href: route('admin.coupons.index'), icon: '🎫', permission: 'view_products' },
        { name: 'Newsletters', href: route('admin.newsletters.index'), icon: '📧', permission: 'view_products' },
        { name: 'Shipping Zones', href: route('admin.shipping-zones.index'), icon: '🚚', permission: 'view_products' },
        { name: 'Reports', href: route('admin.reports.inventory'), icon: '📈', permission: 'view_products' },
        { name: 'Users', href: route('admin.users.index'), icon: '👥', permission: 'view_users' },
        // Future navigation items will be added here
    ];

    const userNavigation = [
        { name: 'Profile', href: route('profile.edit') },
        { name: 'Sign out', href: route('logout'), method: 'post' },
    ];

    const hasPermission = (permission?: string) => {
        if (!permission) return true;
        return auth.user.permissions.includes(permission);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <FlashMessages />
            
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href={route('admin.dashboard')} className="text-xl font-bold text-gray-900">
                                    Sanatoni Mart Admin
                                </Link>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {navigation.map((item) => (
                                    hasPermission(item.permission) && (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                                route().current(item.href.replace(window.location.origin, '').substring(1))
                                                    ? 'border-blue-500 text-gray-900'
                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }`}
                                        >
                                            <span className="mr-2">{item.icon}</span>
                                            {item.name}
                                        </Link>
                                    )
                                ))}
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <div className="ml-3 relative">
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-700">
                                        {auth.user.name}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {auth.user.roles[0]?.display_name || 'User'}
                                    </span>
                                    <div className="space-x-2">
                                        {userNavigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                method={item.method as any}
                                                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page content */}
            <main className="py-10">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
