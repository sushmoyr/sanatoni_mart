import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import BrandedStoreLayout from '@/Layouts/BrandedStoreLayout';
import { Product, Category, PageProps } from '@/types';
import { ProductCard, Input, Button, Badge, Card } from '@/Components/ui';
import SearchAutocomplete from '@/Components/SearchAutocomplete';
import { useTranslation } from '@/hooks/useTranslation';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface ProductsIndexProps extends PageProps {
    products: {
        data: Product[];
        links: any[];
        meta: any;
    };
    categories: Category[];
    filters: {
        category?: string;
        min_price?: string;
        max_price?: string;
        search?: string;
        sort?: string;
        order?: string;
    };
}

export default function ProductsIndex({ auth, products, categories = [], filters = {} }: ProductsIndexProps) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [addingToCart, setAddingToCart] = useState<number | null>(null);

    const handleFilter = () => {
        const filterData: any = {};
        if (searchTerm) filterData.search = searchTerm;
        if (selectedCategory) filterData.category = selectedCategory;
        if (minPrice) filterData.min_price = minPrice;
        if (maxPrice) filterData.max_price = maxPrice;

        router.get(route('products.index'), filterData, { preserveState: true });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setMinPrice('');
        setMaxPrice('');
        router.get(route('products.index'));
    };

    const handleAddToCart = (productId: number) => {
        setAddingToCart(productId);
        
        router.post('/cart', {
            product_id: productId,
            quantity: 1
        }, {
            preserveScroll: true,
            onFinish: () => setAddingToCart(null),
            onSuccess: () => {
                // Optionally show a success message or update UI
            }
        });
    };

    const productsList = products?.data || [];

    return (
        <BrandedStoreLayout title="Products" description="Discover our collection of sacred products">
            <div className="py-8">
                <div className="container-custom">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-serif font-bold text-semantic-text mb-4">
                            {t('products.products', {}, 'Sacred Products')}
                        </h1>
                        <p className="text-semantic-textSub max-w-2xl mx-auto leading-relaxed">
                            {t('products.collection_description', {}, 'Discover our curated collection of authentic religious products, handcrafted with devotion and blessed with sanctity.')}
                        </p>
                    </div>

                    {/* Search & Filter */}
                    <Card className="mb-8 p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <SearchAutocomplete
                                    placeholder={t('common.search_placeholder', {}, 'Search sacred items...')}
                                    className="w-full"
                                    onSearch={(query) => {
                                        setSearchTerm(query);
                                        const filterData: any = { search: query };
                                        if (selectedCategory) filterData.category = selectedCategory;
                                        if (minPrice) filterData.min_price = minPrice;
                                        if (maxPrice) filterData.max_price = maxPrice;
                                        router.get(route('products.index'), filterData, { preserveState: true });
                                    }}
                                />
                            </div>
                            
                            {categories.length > 0 && (
                                <div className="min-w-0 md:w-48">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full rounded-md border-semantic-border text-sm focus:border-brand-500 focus:ring-brand-500"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            
                            <div className="flex gap-2">
                                <Button onClick={handleFilter}>
                                    <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                                    {t('common.search', {}, 'Search')}
                                </Button>
                                {(searchTerm || selectedCategory || minPrice || maxPrice) && (
                                    <Button variant="tertiary" onClick={clearFilters}>
                                        {t('common.clear', {}, 'Clear')}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Active Filters */}
                    {(searchTerm || selectedCategory) && (
                        <div className="mb-6 flex flex-wrap gap-2">
                            {searchTerm && (
                                <Badge variant="secondary">
                                    {t('common.search', {}, 'Search')}: "{searchTerm}"
                                </Badge>
                            )}
                            {selectedCategory && categories.find(c => c.id.toString() === selectedCategory) && (
                                <Badge variant="secondary">
                                    {t('products.category', {}, 'Category')}: {categories.find(c => c.id.toString() === selectedCategory)?.name}
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Products Grid */}
                    {productsList.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {productsList.map((product) => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onAddToCart={handleAddToCart}
                                    loading={addingToCart === product.id}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="mx-auto h-12 w-12 text-semantic-textSub mb-4">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-12 w-12">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-serif font-medium text-semantic-text mb-2">
                                No sacred items found
                            </h3>
                            <p className="text-semantic-textSub mb-6 max-w-md mx-auto">
                                We couldn't find any products matching your search. 
                                Try adjusting your filters or browse our categories.
                            </p>
                            <Button variant="secondary" onClick={clearFilters}>
                                View All Products
                            </Button>
                        </div>
                    )}

                    {/* Pagination */}
                    {products?.links && products.links.length > 3 && (
                        <div className="mt-12 flex justify-center">
                            <div className="flex space-x-1">
                                {products.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                            link.active
                                                ? 'bg-brand-500 text-white shadow-e1'
                                                : link.url
                                                ? 'bg-white text-semantic-text border border-semantic-border hover:bg-brand-50 hover:text-brand-700'
                                                : 'bg-neutral-100 text-semantic-textSub cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BrandedStoreLayout>
    );
}
