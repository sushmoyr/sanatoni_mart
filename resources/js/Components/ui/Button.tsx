import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    asChild?: boolean;
    children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    asChild = false,
    disabled,
    children,
    ...props
}, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-semantic-ring focus:ring-offset-2 focus:ring-offset-semantic-surface disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-e1 hover:shadow-e2",
        secondary: "border border-brand-300 text-brand-700 bg-white hover:bg-brand-50 active:bg-brand-100",
        tertiary: "text-brand-700 hover:text-brand-800 hover:underline underline-offset-4",
        destructive: "bg-danger-600 text-white hover:bg-danger-500 active:bg-danger-700 shadow-e1 hover:shadow-e2",
        ghost: "text-semantic-text hover:bg-semantic-surface active:bg-brand-100"
    };
    
    const sizes = {
        sm: "px-3 py-1.5 text-sm rounded-md",
        md: "px-4 py-2 text-body-m rounded-md",
        lg: "px-6 py-3 text-lg rounded-lg"
    };

    const classes = cn(
        baseStyles,
        variants[variant],
        sizes[size],
        loading && "cursor-wait",
        className
    );

    if (asChild) {
        return React.cloneElement(children as React.ReactElement, {
            className: classes,
            ...props,
        });
    }
    
    return (
        <button
            ref={ref}
            className={classes}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg 
                    className="w-4 h-4 mr-2 animate-spin" 
                    fill="none" 
                    viewBox="0 0 24 24"
                >
                    <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                    />
                    <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
});

Button.displayName = "Button";

export { Button };
