import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helpText?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
    className,
    type = 'text',
    label,
    helpText,
    error,
    leftIcon,
    rightIcon,
    id,
    ...props
}, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
        <div className="w-full">
            {label && (
                <label 
                    htmlFor={inputId}
                    className="block text-sm font-medium text-semantic-text mb-1"
                >
                    {label}
                </label>
            )}
            
            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="h-5 w-5 text-semantic-textSub">
                            {leftIcon}
                        </div>
                    </div>
                )}
                
                <input
                    ref={ref}
                    id={inputId}
                    type={type}
                    className={cn(
                        "w-full rounded-md border bg-white px-3 py-2 text-semantic-text placeholder:text-semantic-textSub transition-colors",
                        "focus:border-semantic-ring focus:ring-2 focus:ring-semantic-ring focus:ring-opacity-20",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        error 
                            ? "border-danger-600 focus:border-danger-600 focus:ring-danger-600" 
                            : "border-semantic-border",
                        leftIcon && "pl-10",
                        rightIcon && "pr-10",
                        className
                    )}
                    {...props}
                />
                
                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <div className="h-5 w-5 text-semantic-textSub">
                            {rightIcon}
                        </div>
                    </div>
                )}
            </div>
            
            {(helpText || error) && (
                <p className={cn(
                    "mt-1 text-xs",
                    error ? "text-danger-600" : "text-semantic-textSub"
                )}>
                    {error || helpText}
                </p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export { Input };
