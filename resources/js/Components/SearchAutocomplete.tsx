import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchSuggestion {
    id: number;
    name: string;
    price: number;
    image?: string;
    url: string;
}

interface SearchAutocompleteProps {
    placeholder?: string;
    className?: string;
    onSearch?: (query: string) => void;
    showSuggestions?: boolean;
}

export default function SearchAutocomplete({ 
    placeholder = "Search products...", 
    className = "",
    onSearch,
    showSuggestions = true 
}: SearchAutocompleteProps) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout>();

    // Handle search input changes
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (query.length >= 2 && showSuggestions) {
            setIsLoading(true);
            
            debounceRef.current = setTimeout(async () => {
                try {
                    const response = await fetch(`/api/products/autocomplete?q=${encodeURIComponent(query)}`);
                    const data = await response.json();
                    setSuggestions(data);
                    setShowDropdown(true);
                } catch (error) {
                    console.error('Search autocomplete error:', error);
                    setSuggestions([]);
                } finally {
                    setIsLoading(false);
                }
            }, 300);
        } else {
            setSuggestions([]);
            setShowDropdown(false);
            setIsLoading(false);
        }

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query, showSuggestions]);

    // Handle clicks outside search component
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowDropdown(false);
        
        if (onSearch) {
            onSearch(query);
        } else {
            // Default behavior: navigate to search page
            window.location.href = `/search/products?search=${encodeURIComponent(query)}`;
        }
    };

    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
        setQuery(suggestion.name);
        setShowDropdown(false);
    };

    const clearSearch = () => {
        setQuery('');
        setSuggestions([]);
        setShowDropdown(false);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={placeholder}
                        className="w-full pl-10 pr-10 py-2 border border-semantic-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                        onFocus={() => {
                            if (suggestions.length > 0) {
                                setShowDropdown(true);
                            }
                        }}
                    />
                    
                    {/* Search Icon */}
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-semantic-textSub" />
                    </div>
                    
                    {/* Clear Button */}
                    {query && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            <XMarkIcon className="h-5 w-5 text-semantic-textSub hover:text-semantic-text" />
                        </button>
                    )}
                </div>
            </form>

            {/* Search Suggestions Dropdown */}
            {showDropdown && showSuggestions && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-semantic-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-4 text-center text-semantic-textSub">
                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-brand-600"></div>
                            <span className="ml-2">Searching...</span>
                        </div>
                    ) : suggestions.length > 0 ? (
                        <>
                            {suggestions.map((suggestion) => (
                                <Link
                                    key={suggestion.id}
                                    href={suggestion.url}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="block px-4 py-3 hover:bg-semantic-surface transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        {suggestion.image && (
                                            <img
                                                src={`/storage/${suggestion.image}`}
                                                alt={suggestion.name}
                                                className="w-10 h-10 object-cover rounded"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-semantic-text truncate">
                                                {suggestion.name}
                                            </p>
                                            <p className="text-sm text-brand-600 font-semibold">
                                                {formatPrice(suggestion.price)}
                                            </p>
                                        </div>
                                        <MagnifyingGlassIcon className="h-4 w-4 text-semantic-textSub" />
                                    </div>
                                </Link>
                            ))}
                            
                            {/* View All Results */}
                            <div className="border-t border-semantic-border">
                                <button
                                    onClick={handleSubmit}
                                    className="w-full px-4 py-3 text-sm text-brand-600 hover:bg-brand-50 transition-colors text-center"
                                >
                                    View all results for "{query}"
                                </button>
                            </div>
                        </>
                    ) : query.length >= 2 ? (
                        <div className="p-4 text-center text-semantic-textSub">
                            <p>No products found for "{query}"</p>
                            <button
                                onClick={handleSubmit}
                                className="mt-2 text-sm text-brand-600 hover:text-brand-700"
                            >
                                Search anyway
                            </button>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
