import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
        
        const variants = {
            primary: "bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500",
            secondary: "bg-semantic-surface text-semantic-text border border-semantic-border hover:bg-gray-50 focus:ring-brand-500",
            ghost: "text-semantic-text hover:bg-semantic-surface focus:ring-brand-500",
            danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
        };
        
        const sizes = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-sm",
            lg: "px-6 py-3 text-base"
        };
        
        return (
            <button
                ref={ref}
                className={cn(
                    baseClasses,
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
