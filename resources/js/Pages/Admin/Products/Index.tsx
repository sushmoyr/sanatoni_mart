import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Product, Category, PageProps } from '@/types';
import { Card, Button, Badge, Input } from '@/Components/ui';
import { 
    PlusIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    PhotoIcon,
    CurrencyDollarIcon,
    ArchiveBoxIcon
} from '@heroicons/react/24/outline';

interface ProductsIndexProps extends PageProps {
    products: {
        data: Product[];
        links: any[];
        meta: any;
    };
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
        status?: string;
        stock_status?: string;
        price_min?: string;
        price_max?: string;
        sort_by?: string;
        sort_direction?: string;
    };
}

export default function Index({ auth, products, categories = [], filters = {} }: ProductsIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedStockStatus, setSelectedStockStatus] = useState(filters.stock_status || '');
    const [minPrice, setMinPrice] = useState(filters.price_min || '');
    const [maxPrice, setMaxPrice] = useState(filters.price_max || '');
    const [showFilters, setShowFilters] = useState(false);

    const handleFilter = () => {
        const filterData: any = {};
        if (searchTerm) filterData.search = searchTerm;
        if (selectedCategory) filterData.category = selectedCategory;
        if (selectedStatus) filterData.status = selectedStatus;
        if (selectedStockStatus) filterData.stock_status = selectedStockStatus;
        if (minPrice) filterData.price_min = minPrice;
        if (maxPrice) filterData.price_max = maxPrice;

        router.get(route('admin.products.index'), filterData, { preserveState: true });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedStatus('');
        setSelectedStockStatus('');
        setMinPrice('');
        setMaxPrice('');
        router.get(route('admin.products.index'));
    };

    const handleDelete = (product: Product) => {
        if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
            router.delete(route('admin.products.destroy', product.id), {
                onSuccess: () => {
                    // Success message will be handled by flash message
                },
                onError: (errors) => {
                    alert('Failed to delete product. Please try again.');
                    console.error('Delete error:', errors);
                }
            });
        }
    };

    const getStockStatusBadge = (product: Product) => {
        if (!product.manage_stock) {
            return <Badge variant="secondary">Unlimited</Badge>;
        }

        const quantity = product.stock_quantity || 0;
        if (quantity <= 0) {
            return <Badge variant="danger">Out of Stock</Badge>;
        } else if (quantity <= 5) {
            return <Badge variant="warning">Low Stock</Badge>;
        } else {
            return <Badge variant="success">In Stock</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="success">Active</Badge>;
            case 'inactive':
                return <Badge variant="secondary">Inactive</Badge>;
            case 'draft':
                return <Badge variant="warning">Draft</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const productsList = products?.data || [];

    return (
        <AdminLayout>
            <Head title="Products Management" />

            <div className="container-custom py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                                Sacred Products
                            </h1>
                            <p className="text-semantic-textSub">
                                Manage your spiritual products inventory
                            </p>
                        </div>
                        <Button asChild>
                            <Link href={route('admin.products.create')}>
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Add Product
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Search and Filter Controls */}
                <Card className="mb-6">
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1">
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-semantic-textSub" />
                                    <Input
                                        type="text"
                                        placeholder="Search products by name, description, or SKU..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                        onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                    />
                                </div>
                            </div>

                            {/* Filter Toggle */}
                            <Button 
                                variant="secondary" 
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <FunnelIcon className="w-4 h-4 mr-2" />
                                Filters
                            </Button>

                            {/* Search Button */}
                            <Button onClick={handleFilter}>
                                Search
                            </Button>
                        </div>

                        {/* Advanced Filters */}
                        {showFilters && (
                            <div className="mt-6 pt-6 border-t border-semantic-border">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Category Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-semantic-text mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-full px-3 py-2 border border-semantic-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                                        >
                                            <option value="">All Categories</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Status Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-semantic-text mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            className="w-full px-3 py-2 border border-semantic-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                                        >
                                            <option value="">All Status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="draft">Draft</option>
                                        </select>
                                    </div>

                                    {/* Stock Status Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-semantic-text mb-2">
                                            Stock Status
                                        </label>
                                        <select
                                            value={selectedStockStatus}
                                            onChange={(e) => setSelectedStockStatus(e.target.value)}
                                            className="w-full px-3 py-2 border border-semantic-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                                        >
                                            <option value="">All Stock</option>
                                            <option value="in_stock">In Stock</option>
                                            <option value="low_stock">Low Stock</option>
                                            <option value="out_of_stock">Out of Stock</option>
                                        </select>
                                    </div>

                                    {/* Price Range */}
                                    <div>
                                        <label className="block text-sm font-medium text-semantic-text mb-2">
                                            Price Range
                                        </label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Min"
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(e.target.value)}
                                                className="text-sm"
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Max"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(e.target.value)}
                                                className="text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <Button onClick={handleFilter} size="sm">
                                        Apply Filters
                                    </Button>
                                    <Button 
                                        variant="secondary" 
                                        onClick={clearFilters}
                                        size="sm"
                                    >
                                        Clear All
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Products Grid */}
                {productsList.length > 0 ? (
                    <div className="grid gap-6">
                        {productsList.map((product) => (
                            <Card key={product.id} className="overflow-hidden">
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0">
                                            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-brand-50 rounded-lg flex items-center justify-center overflow-hidden">
                                                {product.images && product.images.length > 0 ? (
                                                    <img
                                                        src={product.images[0].image_path}
                                                        alt={product.images[0].alt_text || product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <PhotoIcon className="w-8 h-8 text-semantic-textSub" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-semantic-text mb-1">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-sm text-semantic-textSub mb-2">
                                                        SKU: {product.sku}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {getStatusBadge(product.status)}
                                                    {getStockStatusBadge(product)}
                                                </div>
                                            </div>

                                            <p className="text-semantic-textSub text-sm mb-3 line-clamp-2">
                                                {product.description}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-4 text-sm text-semantic-textSub mb-4">
                                                <div className="flex items-center gap-1">
                                                    <CurrencyDollarIcon className="w-4 h-4" />
                                                    <span className="font-medium text-semantic-text">
                                                        ৳{parseFloat(product.price.toString()).toLocaleString()}
                                                    </span>
                                                </div>
                                                
                                                {product.manage_stock && (
                                                    <div className="flex items-center gap-1">
                                                        <ArchiveBoxIcon className="w-4 h-4" />
                                                        <span>Stock: {product.stock_quantity}</span>
                                                    </div>
                                                )}

                                                {product.category && (
                                                    <div className="flex items-center gap-1">
                                                        <span>Category: {product.category.name}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    asChild
                                                >
                                                    <Link href={route('admin.products.show', product.id)}>
                                                        <EyeIcon className="w-4 h-4 mr-1" />
                                                        View
                                                    </Link>
                                                </Button>
                                                
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    asChild
                                                >
                                                    <Link href={route('admin.products.edit', product.id)}>
                                                        <PencilIcon className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                
                                                <Button 
                                                    variant="destructive" 
                                                    size="sm"
                                                    onClick={() => handleDelete(product)}
                                                >
                                                    <TrashIcon className="w-4 h-4 mr-1" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <div className="p-12 text-center">
                            <PhotoIcon className="mx-auto w-16 h-16 text-semantic-textSub mb-4" />
                            <h3 className="text-lg font-medium text-semantic-text mb-2">
                                No products found
                            </h3>
                            <p className="text-semantic-textSub mb-6">
                                {Object.keys(filters).length > 0 
                                    ? "No products match your current filters. Try adjusting your search criteria."
                                    : "Get started by adding your first product to the inventory."
                                }
                            </p>
                            <div className="flex gap-2 justify-center">
                                {Object.keys(filters).length > 0 && (
                                    <Button variant="secondary" onClick={clearFilters}>
                                        Clear Filters
                                    </Button>
                                )}
                                <Button asChild>
                                    <Link href={route('admin.products.create')}>
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Add First Product
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Pagination */}
                {products.links && products.links.length > 3 && (
                    <div className="mt-8 flex justify-center">
                        <div className="flex gap-2">
                            {products.links.map((link: any, index: number) => (
                                <Button
                                    key={index}
                                    variant={link.active ? "primary" : "secondary"}
                                    size="sm"
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className="px-3 py-1"
                                >
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
