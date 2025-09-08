import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'outline';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({
    className,
    variant = 'default',
    padding = 'md',
    children,
    ...props
}, ref) => {
    const baseStyles = "rounded-lg bg-semantic-elevate border transition-shadow duration-200";
    
    const variants = {
        default: "border-semantic-border shadow-e1 hover:shadow-e2",
        elevated: "border-semantic-border shadow-e2 hover:shadow-e3",
        outline: "border-semantic-border shadow-none hover:shadow-e1"
    };
    
    const paddings = {
        none: "",
        sm: "p-3",
        md: "p-4",
        lg: "p-6"
    };
    
    return (
        <div
            ref={ref}
            className={cn(
                baseStyles,
                variants[variant],
                paddings[padding],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});

Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
    className,
    ...props
}, ref) => (
    <div
        ref={ref}
        className={cn("space-y-1.5", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({
    className,
    children,
    ...props
}, ref) => (
    <h3
        ref={ref}
        className={cn("text-lg font-semibold leading-none tracking-tight text-semantic-text", className)}
        {...props}
    >
        {children}
    </h3>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({
    className,
    ...props
}, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-semantic-textSub", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
    className,
    ...props
}, ref) => (
    <div
        ref={ref}
        className={cn("pt-0", className)}
        {...props}
    />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
    className,
    ...props
}, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center pt-0", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
