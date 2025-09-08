import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Input } from './Input';
import { Button } from './Button';
import { cn } from '@/lib/utils';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchProps {
    placeholder?: string;
    defaultValue?: string;
    onSearch?: (query: string) => void;
    className?: string;
    variant?: 'default' | 'compact';
}

export const Search = ({ 
    placeholder = "Search...",
    defaultValue = "",
    onSearch,
    className,
    variant = 'default'
}: SearchProps) => {
    const [query, setQuery] = useState(defaultValue);
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            if (onSearch) {
                onSearch(query.trim());
            } else {
                // Default behavior: navigate to products page with search
                router.get('/products', { search: query.trim() });
            }
        }
    };

    const handleClear = () => {
        setQuery('');
        setIsOpen(false);
    };

    if (variant === 'compact') {
        return (
            <div className={cn("relative", className)}>
                {!isOpen ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(true)}
                        className="p-2"
                    >
                        <MagnifyingGlassIcon className="h-5 w-5" />
                    </Button>
                ) : (
                    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                        <Input
                            type="text"
                            placeholder={placeholder}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-48"
                            autoFocus
                        />
                        <Button type="submit" size="sm" variant="ghost">
                            <MagnifyingGlassIcon className="h-4 w-4" />
                        </Button>
                        <Button 
                            type="button" 
                            size="sm" 
                            variant="ghost"
                            onClick={handleClear}
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </Button>
                    </form>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={cn("relative", className)}>
            <Input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-10"
                rightIcon={
                    <Button type="submit" variant="ghost" className="p-0 h-auto hover:bg-transparent">
                        <MagnifyingGlassIcon className="h-5 w-5 text-semantic-textSub hover:text-semantic-text" />
                    </Button>
                }
            />
        </form>
    );
};
