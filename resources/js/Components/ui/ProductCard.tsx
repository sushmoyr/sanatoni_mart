import React from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Badge } from './Badge';
import { Button } from './Button';
import { Product } from '@/types';

interface ProductCardProps {
    product: Product;
    className?: string;
    onAddToCart?: (productId: number) => void;
    loading?: boolean;
}

export function ProductCard({ product, className, onAddToCart, loading }: ProductCardProps) {
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onAddToCart?.(product.id);
    };

    // Create rating stars
    const renderRating = (rating: number = 5, count: number = 0) => {
        return (
            <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                        <svg
                            key={i}
                            className="h-3 w-3 fill-current"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>
                {count > 0 && (
                    <span className="text-xs text-semantic-textSub">({count})</span>
                )}
            </div>
        );
    };

    return (
        <article className={cn(
            "group relative rounded-lg bg-semantic-elevate shadow-e1 border border-semantic-border overflow-hidden transition-all duration-200 hover:shadow-e2",
            className
        )}>
            <Link href={route('products.show', product.slug)} className="block">
                {/* Product Image */}
                <div className="aspect-square overflow-hidden bg-neutral-100 relative">
                    <img
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                        src={product.main_image || '/images/placeholder.jpg'}
                        alt={product.name}
                        loading="lazy"
                    />
                    
                    {/* Badges */}
                    {product.featured && (
                        <div className="absolute left-3 top-3">
                            <Badge variant="default" size="sm">
                                Handcrafted
                            </Badge>
                        </div>
                    )}
                    
                    {product.stock_quantity === 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Badge variant="secondary" size="md">
                                Out of Stock
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="text-sm font-medium text-semantic-text line-clamp-2 mb-1">
                        {product.name}
                    </h3>
                    
                    {product.short_description && (
                        <p className="text-xs text-semantic-textSub line-clamp-1 mb-2">
                            {product.short_description}
                        </p>
                    )}
                    
                    {/* Rating */}
                    <div className="mb-2">
                        {renderRating(5, 128)}
                    </div>
                    
                    {/* Price and Add to Cart */}
                    <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold tracking-tight font-tnum text-semantic-text">
                            ৳{product.price}
                        </div>
                        
                        {product.stock_quantity > 0 && (
                            <Button
                                size="sm"
                                onClick={handleAddToCart}
                                loading={loading}
                                className="text-xs"
                            >
                                Add
                            </Button>
                        )}
                    </div>
                    
                    {/* Category Chip */}
                    {product.category && (
                        <div className="mt-2">
                            <Badge variant="secondary" size="sm">
                                {product.category.name}
                            </Badge>
                        </div>
                    )}
                </div>
            </Link>
        </article>
    );
}
