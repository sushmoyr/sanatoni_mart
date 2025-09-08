import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <div className="w-full">
                <input
                    ref={ref}
                    className={cn(
                        "w-full border border-semantic-border rounded-lg px-3 py-2 text-semantic-text bg-white focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-colors",
                        error && "border-red-500 focus:ring-red-500",
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
