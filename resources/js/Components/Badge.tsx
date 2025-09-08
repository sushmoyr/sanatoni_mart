import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    children: React.ReactNode;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', children, ...props }, ref) => {
        const variants = {
            default: "bg-gray-100 text-gray-800",
            success: "bg-green-100 text-green-800",
            warning: "bg-yellow-100 text-yellow-800",
            danger: "bg-red-100 text-red-800",
            info: "bg-blue-100 text-blue-800"
        };
        
        return (
            <span
                ref={ref}
                className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    variants[variant],
                    className
                )}
                {...props}
            >
                {children}
            </span>
        );
    }
);

Badge.displayName = "Badge";

export default Badge;
