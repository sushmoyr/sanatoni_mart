import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { PageProps } from '@/types';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, locale, available_languages } = usePage<PageProps>().props;
    const user = auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-semantic-bg sacred-bg">
            <nav className="border-b border-semantic-border bg-semantic-surface/95 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="group">
                                    <div className="flex items-center gap-2">
                                        <span className="text-primary-600 text-xl">🕉</span>
                                        <span className="text-lg font-serif font-bold text-semantic-text group-hover:text-primary-600 transition-colors">
                                            Sanatoni Mart
                                        </span>
                                    </div>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    href={route('orders.index')}
                                    active={route().current('orders.*')}
                                >
                                    My Orders
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center space-x-4">
                            <LanguageSwitcher 
                                currentLocale={locale}
                                availableLanguages={available_languages}
                                className="bg-semantic-surface/80 backdrop-blur-sm border border-semantic-border rounded-lg shadow-e2"
                            />
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-semantic-surface px-3 py-2 text-sm font-medium leading-4 text-semantic-textSub transition duration-150 ease-in-out hover:text-semantic-text focus:outline-none"
                                            >
                                                {user?.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-semantic-textSub transition duration-150 ease-in-out hover:bg-semantic-surface hover:text-semantic-text focus:bg-semantic-surface focus:text-semantic-text focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('orders.index')}
                            active={route().current('orders.*')}
                        >
                            My Orders
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-semantic-border pb-1 pt-4">
                        <div className="px-4 mb-4">
                            <LanguageSwitcher 
                                currentLocale={locale}
                                availableLanguages={available_languages}
                                className="w-full bg-semantic-surface/80 backdrop-blur-sm border border-semantic-border rounded-lg shadow-e2"
                            />
                        </div>
                        <div className="px-4">
                            <div className="text-base font-medium text-semantic-text">
                                {user?.name}
                            </div>
                            <div className="text-sm font-medium text-semantic-textSub">
                                {user?.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-semantic-surface shadow-e1">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="relative overflow-hidden">
                {/* Sacred symbols floating in the background */}
                <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
                    <div className="absolute top-1/4 left-1/4 text-6xl text-primary-300 animate-bounce-slow">
                        🕉
                    </div>
                    <div className="absolute top-3/4 right-1/4 text-4xl text-accent-300 animate-pulse">
                        ☪
                    </div>
                    <div className="absolute top-1/2 left-3/4 text-5xl text-secondary-300 animate-spin-slow">
                        ✡
                    </div>
                    <div className="absolute bottom-1/4 left-1/2 text-3xl text-primary-400 animate-float">
                        ☸
                    </div>
                    <div className="absolute top-1/3 right-1/3 text-4xl text-accent-400 animate-bounce-slow">
                        ✝
                    </div>
                </div>
                
                <div className="relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
