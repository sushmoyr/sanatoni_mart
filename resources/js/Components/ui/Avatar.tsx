import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    fallbackIcon?: React.ReactNode;
}

const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl'
};

export const Avatar = ({ 
    src, 
    alt, 
    name, 
    size = 'md', 
    className,
    fallbackIcon 
}: AvatarProps) => {
    const initials = name 
        ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '';

    return (
        <div 
            className={cn(
                "relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white font-medium",
                sizeClasses[size],
                className
            )}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt || name || 'Avatar'}
                    className="h-full w-full rounded-full object-cover"
                />
            ) : initials ? (
                <span className="font-semibold">
                    {initials}
                </span>
            ) : fallbackIcon ? (
                fallbackIcon
            ) : (
                <svg className="h-2/3 w-2/3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )}
        </div>
    );
};
