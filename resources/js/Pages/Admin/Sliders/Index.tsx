import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Card, Badge, Input } from '@/Components/ui';
import { PageProps } from '@/types';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    PlusIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    PhotoIcon,
    CalendarIcon,
    ClockIcon,
    ChevronUpDownIcon,
    ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

interface Slider {
    id: number;
    title: string;
    subtitle?: string;
    description?: string;
    image_url: string;
    button_text?: string;
    button_link?: string;
    button_style: 'primary' | 'secondary' | 'outline';
    text_color: string;
    overlay_color: string;
    overlay_opacity: number;
    text_position: 'left' | 'center' | 'right';
    text_alignment: 'left' | 'center' | 'right';
    sort_order: number;
    is_active: boolean;
    start_date?: string;
    end_date?: string;
    created_at: string;
    updated_at: string;
}

interface PaginatedSliders {
    data: Slider[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url?: string;
        label: string;
        active: boolean;
    }>;
}

interface AdminSlidersIndexProps extends PageProps {
    sliders: PaginatedSliders;
    filters: {
        search?: string;
        status?: string;
        sort_by?: string;
        sort_direction?: string;
    };
}

export default function AdminSlidersIndex({ auth, sliders, filters }: AdminSlidersIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'sort_order');
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'asc');
    const [selectedSliders, setSelectedSliders] = useState<number[]>([]);

    const handleSearch = () => {
        router.get(route('admin.sliders.index'), {
            search: searchTerm || undefined,
            status: statusFilter || undefined,
            sort_by: sortBy,
            sort_direction: sortDirection,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSort = (column: string) => {
        const newDirection = sortBy === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setSortDirection(newDirection);
        
        router.get(route('admin.sliders.index'), {
            search: searchTerm || undefined,
            status: statusFilter || undefined,
            sort_by: column,
            sort_direction: newDirection,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleBulkAction = (action: string) => {
        if (selectedSliders.length === 0) return;
        
        if (action === 'delete') {
            if (!confirm('Are you sure you want to delete the selected sliders?')) return;
        }
        
        router.post(route('admin.sliders.bulk-action'), {
            action,
            slider_ids: selectedSliders,
        }, {
            onSuccess: () => {
                setSelectedSliders([]);
            }
        });
    };

    const handleDelete = (slider: Slider) => {
        if (confirm(`Are you sure you want to delete "${slider.title}"?`)) {
            router.delete(route('admin.sliders.destroy', slider.id));
        }
    };

    const getStatusBadgeVariant = (isActive: boolean) => {
        return isActive ? 'success' : 'secondary';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const isSliderActive = (slider: Slider) => {
        if (!slider.is_active) return false;
        
        const now = new Date();
        if (slider.start_date && new Date(slider.start_date) > now) return false;
        if (slider.end_date && new Date(slider.end_date) < now) return false;
        
        return true;
    };

    return (
        <AdminLayout>
            <Head title="Sliders Management" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                            Sliders Management
                        </h1>
                        <p className="text-semantic-textSub">
                            Manage homepage sliders and banners
                        </p>
                    </div>
                    <Link href={route('admin.sliders.create')}>
                        <Button variant="primary" size="md">
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Add New Slider
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <PhotoIcon className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-semantic-text">
                                        {sliders.total}
                                    </div>
                                    <div className="text-sm text-semantic-textSub">Total Sliders</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <ClockIcon className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-semantic-text">
                                        {sliders.data.filter(s => isSliderActive(s)).length}
                                    </div>
                                    <div className="text-sm text-semantic-textSub">Active Sliders</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    placeholder="Search sliders..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 border border-semantic-border rounded-md focus:ring-brand-500 focus:border-brand-500"
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <Button variant="secondary" onClick={handleSearch}>
                                    <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                                    Search
                                </Button>
                            </div>
                        </div>

                        {/* Bulk Actions */}
                        {selectedSliders.length > 0 && (
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-blue-800">
                                        {selectedSliders.length} slider(s) selected
                                    </span>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="secondary" 
                                            size="sm" 
                                            onClick={() => handleBulkAction('activate')}
                                        >
                                            Activate
                                        </Button>
                                        <Button 
                                            variant="secondary" 
                                            size="sm" 
                                            onClick={() => handleBulkAction('deactivate')}
                                        >
                                            Deactivate
                                        </Button>
                                        <Button 
                                            variant="destructive" 
                                            size="sm" 
                                            onClick={() => handleBulkAction('delete')}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Sliders Table */}
                <Card>
                    {sliders.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-semantic-border">
                                <thead className="bg-semantic-surface">
                                    <tr>
                                        <th className="px-6 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedSliders.length === sliders.data.length}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedSliders(sliders.data.map(s => s.id));
                                                    } else {
                                                        setSelectedSliders([]);
                                                    }
                                                }}
                                                className="rounded border-semantic-border text-brand-600 focus:ring-brand-500"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">
                                            Preview
                                        </th>
                                        <th 
                                            className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider cursor-pointer hover:bg-semantic-bg"
                                            onClick={() => handleSort('title')}
                                        >
                                            <div className="flex items-center">
                                                Title
                                                <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                                            </div>
                                        </th>
                                        <th 
                                            className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider cursor-pointer hover:bg-semantic-bg"
                                            onClick={() => handleSort('sort_order')}
                                        >
                                            <div className="flex items-center">
                                                Order
                                                <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">
                                            Schedule
                                        </th>
                                        <th 
                                            className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider cursor-pointer hover:bg-semantic-bg"
                                            onClick={() => handleSort('created_at')}
                                        >
                                            <div className="flex items-center">
                                                Created
                                                <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-semantic-textSub uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-semantic-border">
                                    {sliders.data.map((slider) => (
                                        <tr key={slider.id} className="hover:bg-semantic-bg">
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSliders.includes(slider.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedSliders([...selectedSliders, slider.id]);
                                                        } else {
                                                            setSelectedSliders(selectedSliders.filter(id => id !== slider.id));
                                                        }
                                                    }}
                                                    className="rounded border-semantic-border text-brand-600 focus:ring-brand-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <img
                                                    src={slider.image_url}
                                                    alt={slider.title}
                                                    className="h-12 w-20 object-cover rounded-md"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-semantic-text">
                                                        {slider.title}
                                                    </div>
                                                    {slider.subtitle && (
                                                        <div className="text-sm text-semantic-textSub">
                                                            {slider.subtitle}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-semantic-text">
                                                {slider.sort_order}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={getStatusBadgeVariant(isSliderActive(slider))}>
                                                    {isSliderActive(slider) ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-semantic-textSub">
                                                {slider.start_date || slider.end_date ? (
                                                    <div>
                                                        {slider.start_date && (
                                                            <div>From: {formatDate(slider.start_date)}</div>
                                                        )}
                                                        {slider.end_date && (
                                                            <div>To: {formatDate(slider.end_date)}</div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    'Always'
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-semantic-textSub">
                                                {formatDate(slider.created_at)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <Link
                                                        href={route('admin.sliders.show', slider.id)}
                                                        className="text-brand-600 hover:text-brand-900"
                                                    >
                                                        <EyeIcon className="h-4 w-4" />
                                                    </Link>
                                                    <Link
                                                        href={route('admin.sliders.edit', slider.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Link>
                                                    {slider.button_link && (
                                                        <a
                                                            href={slider.button_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                                        </a>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(slider)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <PhotoIcon className="h-12 w-12 text-semantic-textSub mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-semantic-text mb-2">No sliders found</h3>
                            <p className="text-semantic-textSub mb-6">
                                Get started by creating your first homepage slider.
                            </p>
                            <Link href={route('admin.sliders.create')}>
                                <Button variant="primary">
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    Create First Slider
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {sliders.data.length > 0 && sliders.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-semantic-border">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-semantic-textSub">
                                    Showing {(sliders.current_page - 1) * sliders.per_page + 1} to{' '}
                                    {Math.min(sliders.current_page * sliders.per_page, sliders.total)} of{' '}
                                    {sliders.total} results
                                </div>
                                <div className="flex space-x-1">
                                    {sliders.links.map((link, index) => (
                                        <div key={index}>
                                            {link.url ? (
                                                <Link
                                                    href={link.url}
                                                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                                        link.active
                                                            ? 'bg-brand-600 text-white'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span
                                                    className="px-3 py-2 text-sm text-gray-400 rounded-md"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AdminLayout>
    );
}
