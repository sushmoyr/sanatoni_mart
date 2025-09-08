import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';
    size?: 'sm' | 'md';
    children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({
    className,
    variant = 'default',
    size = 'md',
    children,
    ...props
}, ref) => {
    const baseStyles = "inline-flex items-center rounded-full font-medium transition-colors";
    
    const variants = {
        default: "bg-brand-100 text-brand-800 border border-brand-200",
        success: "bg-success-500/10 text-success-600 border border-success-600/20",
        warning: "bg-warning-500/10 text-warning-600 border border-warning-600/20",
        danger: "bg-danger-500/10 text-danger-600 border border-danger-600/20",
        info: "bg-accent-500/10 text-accent-600 border border-accent-600/20",
        secondary: "bg-neutral-200 text-neutral-700 border border-neutral-300"
    };
    
    const sizes = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm"
    };
    
    return (
        <div
            ref={ref}
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});

Badge.displayName = "Badge";

export { Badge };
