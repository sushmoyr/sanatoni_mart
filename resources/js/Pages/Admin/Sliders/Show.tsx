import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Card, Badge } from '@/Components/ui';
import { PageProps } from '@/types';
import {
    ArrowLeftIcon,
    PencilIcon,
    EyeIcon,
    PhotoIcon,
    LinkIcon,
    PaintBrushIcon,
    Cog6ToothIcon,
    CalendarIcon,
    ClockIcon,
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

interface AdminSliderShowProps extends PageProps {
    slider: Slider;
}

export default function AdminSliderShow({ auth, slider }: AdminSliderShowProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadgeVariant = (isActive: boolean) => {
        return isActive ? 'success' : 'secondary';
    };

    const getButtonStyleBadgeVariant = (style: string) => {
        switch (style) {
            case 'primary':
                return 'default';
            case 'secondary':
                return 'secondary';
            case 'outline':
                return 'info';
            default:
                return 'secondary';
        }
    };

    const isSliderActive = () => {
        if (!slider.is_active) return false;
        
        const now = new Date();
        if (slider.start_date && new Date(slider.start_date) > now) return false;
        if (slider.end_date && new Date(slider.end_date) < now) return false;
        
        return true;
    };

    return (
        <AdminLayout>
            <Head title={`Slider: ${slider.title}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                        <Link href={route('admin.sliders.index')}>
                            <Button variant="secondary" size="sm">
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                Back to Sliders
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-semantic-text">
                                {slider.title}
                            </h1>
                            <p className="text-semantic-textSub">
                                View slider details and configuration
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Link href={route('admin.sliders.edit', slider.id)}>
                            <Button variant="primary" size="md">
                                <PencilIcon className="h-5 w-5 mr-2" />
                                Edit Slider
                            </Button>
                        </Link>
                        {slider.button_link && (
                            <a
                                href={slider.button_link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="secondary" size="md">
                                    <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-2" />
                                    View Link
                                </Button>
                            </a>
                        )}
                    </div>
                </div>

                {/* Status and Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <ClockIcon className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm text-semantic-textSub">Status</div>
                                    <Badge variant={getStatusBadgeVariant(isSliderActive())}>
                                        {isSliderActive() ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Cog6ToothIcon className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm text-semantic-textSub">Sort Order</div>
                                    <div className="text-2xl font-bold text-semantic-text">
                                        {slider.sort_order}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <CalendarIcon className="h-8 w-8 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm text-semantic-textSub">Created</div>
                                    <div className="text-lg font-semibold text-semantic-text">
                                        {formatDate(slider.created_at)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <CalendarIcon className="h-8 w-8 text-orange-600" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm text-semantic-textSub">Updated</div>
                                    <div className="text-lg font-semibold text-semantic-text">
                                        {formatDate(slider.updated_at)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Slider Preview */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <PhotoIcon className="h-6 w-6 text-brand-600 mr-2" />
                                <h3 className="text-lg font-semibold text-semantic-text">Slider Preview</h3>
                            </div>
                            
                            <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video">
                                <div 
                                    className="absolute inset-0 z-10" 
                                    style={{ 
                                        background: `rgba(${parseInt(slider.overlay_color.slice(1, 3), 16)}, ${parseInt(slider.overlay_color.slice(3, 5), 16)}, ${parseInt(slider.overlay_color.slice(5, 7), 16)}, ${slider.overlay_opacity / 100})` 
                                    }}
                                />
                                {slider.image_url ? (
                                    <img
                                        src={slider.image_url}
                                        alt={slider.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <PhotoIcon className="h-16 w-16 text-gray-400" />
                                    </div>
                                )}
                                
                                {/* Text Content Overlay */}
                                <div className="absolute inset-0 z-20 flex items-center p-6">
                                    <div 
                                        className={`max-w-md ${
                                            slider.text_position === 'center' ? 'mx-auto text-center' :
                                            slider.text_position === 'right' ? 'ml-auto text-right' :
                                            'mr-auto text-left'
                                        }`}
                                    >
                                        <h2 
                                            className={`text-2xl font-bold mb-2 ${
                                                slider.text_alignment === 'center' ? 'text-center' :
                                                slider.text_alignment === 'right' ? 'text-right' :
                                                'text-left'
                                            }`}
                                            style={{ color: slider.text_color }}
                                        >
                                            {slider.title}
                                        </h2>
                                        {slider.subtitle && (
                                            <h3 
                                                className={`text-lg mb-2 ${
                                                    slider.text_alignment === 'center' ? 'text-center' :
                                                    slider.text_alignment === 'right' ? 'text-right' :
                                                    'text-left'
                                                }`}
                                                style={{ color: slider.text_color }}
                                            >
                                                {slider.subtitle}
                                            </h3>
                                        )}
                                        {slider.description && (
                                            <p 
                                                className={`text-sm mb-4 ${
                                                    slider.text_alignment === 'center' ? 'text-center' :
                                                    slider.text_alignment === 'right' ? 'text-right' :
                                                    'text-left'
                                                }`}
                                                style={{ color: slider.text_color }}
                                            >
                                                {slider.description}
                                            </p>
                                        )}
                                        {slider.button_text && (
                                            <div className={
                                                slider.text_alignment === 'center' ? 'text-center' :
                                                slider.text_alignment === 'right' ? 'text-right' :
                                                'text-left'
                                            }>
                                                <span
                                                    className={`px-4 py-2 rounded text-sm font-semibold inline-block ${
                                                        slider.button_style === 'secondary' ? 'bg-gray-600 text-white' :
                                                        slider.button_style === 'outline' ? 'border-2 border-white text-white' :
                                                        'bg-blue-600 text-white'
                                                    }`}
                                                >
                                                    {slider.button_text}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Slider Configuration */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <Cog6ToothIcon className="h-6 w-6 text-brand-600 mr-2" />
                                <h3 className="text-lg font-semibold text-semantic-text">Configuration</h3>
                            </div>
                            
                            <div className="space-y-4">
                                {/* Content */}
                                <div>
                                    <h4 className="font-medium text-semantic-text mb-2">Content</h4>
                                    <div className="bg-semantic-bg p-4 rounded-lg space-y-2">
                                        <div>
                                            <span className="text-sm text-semantic-textSub">Title:</span>
                                            <p className="font-medium">{slider.title}</p>
                                        </div>
                                        {slider.subtitle && (
                                            <div>
                                                <span className="text-sm text-semantic-textSub">Subtitle:</span>
                                                <p className="font-medium">{slider.subtitle}</p>
                                            </div>
                                        )}
                                        {slider.description && (
                                            <div>
                                                <span className="text-sm text-semantic-textSub">Description:</span>
                                                <p className="font-medium">{slider.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Button Configuration */}
                                {slider.button_text && (
                                    <div>
                                        <h4 className="font-medium text-semantic-text mb-2">Button</h4>
                                        <div className="bg-semantic-bg p-4 rounded-lg space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-semantic-textSub">Text:</span>
                                                <span className="font-medium">{slider.button_text}</span>
                                            </div>
                                            {slider.button_link && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-semantic-textSub">Link:</span>
                                                    <a 
                                                        href={slider.button_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-brand-600 hover:text-brand-700 font-medium text-sm flex items-center"
                                                    >
                                                        {slider.button_link}
                                                        <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                                                    </a>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-semantic-textSub">Style:</span>
                                                <Badge variant={getButtonStyleBadgeVariant(slider.button_style)}>
                                                    {slider.button_style}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Visual Configuration */}
                                <div>
                                    <h4 className="font-medium text-semantic-text mb-2">Visual Settings</h4>
                                    <div className="bg-semantic-bg p-4 rounded-lg space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-semantic-textSub">Text Color:</span>
                                            <div className="flex items-center space-x-2">
                                                <div 
                                                    className="w-4 h-4 rounded border border-gray-300" 
                                                    style={{ backgroundColor: slider.text_color }}
                                                />
                                                <span className="font-medium text-sm">{slider.text_color}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-semantic-textSub">Overlay Color:</span>
                                            <div className="flex items-center space-x-2">
                                                <div 
                                                    className="w-4 h-4 rounded border border-gray-300" 
                                                    style={{ backgroundColor: slider.overlay_color }}
                                                />
                                                <span className="font-medium text-sm">{slider.overlay_color}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-semantic-textSub">Overlay Opacity:</span>
                                            <span className="font-medium">{slider.overlay_opacity}%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-semantic-textSub">Text Position:</span>
                                            <Badge variant="secondary">{slider.text_position}</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-semantic-textSub">Text Alignment:</span>
                                            <Badge variant="secondary">{slider.text_alignment}</Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Schedule */}
                                {(slider.start_date || slider.end_date) && (
                                    <div>
                                        <h4 className="font-medium text-semantic-text mb-2">Schedule</h4>
                                        <div className="bg-semantic-bg p-4 rounded-lg space-y-2">
                                            {slider.start_date && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-semantic-textSub">Start Date:</span>
                                                    <span className="font-medium text-sm">{formatDate(slider.start_date)}</span>
                                                </div>
                                            )}
                                            {slider.end_date && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-semantic-textSub">End Date:</span>
                                                    <span className="font-medium text-sm">{formatDate(slider.end_date)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
