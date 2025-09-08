import React from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface NavigationItem {
    name: string;
    href: string;
    icon?: React.ReactNode;
    current?: boolean;
    children?: NavigationItem[];
}

interface NavigationProps {
    items: NavigationItem[];
    orientation?: 'horizontal' | 'vertical';
    variant?: 'primary' | 'secondary' | 'ghost';
    className?: string;
}

export const Navigation = ({ 
    items, 
    orientation = 'horizontal', 
    variant = 'primary',
    className 
}: NavigationProps) => {
    const baseStyles = orientation === 'horizontal' 
        ? "flex space-x-1" 
        : "flex flex-col space-y-1";

    const itemBaseStyles = "px-3 py-2 text-sm font-medium rounded-md transition-colors";
    
    const variants = {
        primary: {
            inactive: "text-semantic-textSub hover:text-semantic-text hover:bg-brand-50",
            active: "text-brand-700 bg-brand-100"
        },
        secondary: {
            inactive: "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100",
            active: "text-neutral-900 bg-neutral-200"
        },
        ghost: {
            inactive: "text-semantic-textSub hover:text-semantic-text",
            active: "text-brand-700"
        }
    };

    return (
        <nav className={cn(baseStyles, className)}>
            {items.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                        itemBaseStyles,
                        item.current 
                            ? variants[variant].active
                            : variants[variant].inactive
                    )}
                >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.name}
                </Link>
            ))}
        </nav>
    );
};
