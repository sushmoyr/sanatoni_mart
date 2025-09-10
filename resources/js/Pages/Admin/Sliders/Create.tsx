import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Card, Input } from '@/Components/ui';
import DragDropImageUpload from '@/Components/DragDropImageUpload';
import { PageProps } from '@/types';
import {
    ArrowLeftIcon,
    PhotoIcon,
    EyeIcon,
    LinkIcon,
    PaintBrushIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface SliderForm {
    title: string;
    subtitle: string;
    description: string;
    image: File | null;
    button_text: string;
    button_link: string;
    button_style: 'primary' | 'secondary' | 'outline';
    text_color: string;
    overlay_color: string;
    overlay_opacity: number;
    text_position: 'left' | 'center' | 'right';
    text_alignment: 'left' | 'center' | 'right';
    sort_order: number;
    is_active: boolean;
    start_date: string;
    end_date: string;
}

interface ImageFile {
    id?: number;
    file?: File;
    url: string;
    name: string;
    preview?: string;
}

export default function AdminSlidersCreate({ auth }: PageProps) {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<SliderForm>({
        title: '',
        subtitle: '',
        description: '',
        image: null,
        button_text: '',
        button_link: '',
        button_style: 'primary',
        text_color: '#ffffff',
        overlay_color: '#000000',
        overlay_opacity: 50,
        text_position: 'left',
        text_alignment: 'left',
        sort_order: 0,
        is_active: true,
        start_date: '',
        end_date: '',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            
            // Create preview and add to images
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = e.target?.result as string;
                const newImage: ImageFile = {
                    id: Date.now(),
                    file,
                    url: preview,
                    name: file.name,
                    preview
                };
                setImages([newImage]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImagesChange = (newImages: ImageFile[]) => {
        setImages(newImages);
        if (newImages.length > 0) {
            setData('image', newImages[0].file || null);
        } else {
            setData('image', null);
        }
    };

    const handleImageUpload = async (files: File[]): Promise<ImageFile[]> => {
        // For creation, we just handle local files since we'll upload on form submit
        return files.map((file, index) => ({
            id: Date.now() + index,
            file,
            url: URL.createObjectURL(file),
            name: file.name,
            preview: URL.createObjectURL(file)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.sliders.store'), {
            onSuccess: () => {
                // Redirect will be handled by the controller
            },
        });
    };

    const getOverlayStyle = () => {
        const hex = data.overlay_color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const opacity = data.overlay_opacity / 100;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    return (
        <AdminLayout>
            <Head title="Create New Slider" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href={route('admin.sliders.index')}>
                            <ArrowLeftIcon className="h-6 w-6 text-semantic-textSub hover:text-semantic-text" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                                Create New Slider
                            </h1>
                            <p className="text-semantic-textSub">
                                Create a new homepage slider with custom styling and content
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={() => setShowPreview(!showPreview)}
                    >
                        <EyeIcon className="h-5 w-5 mr-2" />
                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Form Fields */}
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-semantic-text mb-4">
                                        Basic Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-semantic-textSub mb-2">
                                                Title *
                                            </label>
                                            <Input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                error={errors.title}
                                                placeholder="Enter slider title"
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-semantic-textSub mb-2">
                                                Subtitle
                                            </label>
                                            <Input
                                                type="text"
                                                value={data.subtitle}
                                                onChange={(e) => setData('subtitle', e.target.value)}
                                                error={errors.subtitle}
                                                placeholder="Enter subtitle (optional)"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-semantic-textSub mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                rows={3}
                                                className="w-full px-4 py-2 border border-semantic-border rounded-md focus:ring-brand-500 focus:border-brand-500"
                                                placeholder="Enter description (optional)"
                                            />
                                            {errors.description && (
                                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Image Upload */}
                            <Card>
                                <div className="p-6">
                                    <DragDropImageUpload
                                        images={images}
                                        onImagesChange={handleImagesChange}
                                        onUpload={handleImageUpload}
                                        maxImages={1}
                                        multiple={false}
                                        label="Background Image"
                                        required={true}
                                        helpText="Upload a high-quality image for the slider background (recommended: 1920x1080px)"
                                        className="w-full"
                                    />
                                    {errors.image && (
                                        <p className="mt-2 text-sm text-red-600">{errors.image}</p>
                                    )}
                                </div>
                            </Card>

                            {/* Call to Action */}
                            <Card>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-semantic-text mb-4 flex items-center">
                                        <LinkIcon className="h-5 w-5 mr-2" />
                                        Call to Action Button
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-semantic-textSub mb-2">
                                                Button Text
                                            </label>
                                            <Input
                                                type="text"
                                                value={data.button_text}
                                                onChange={(e) => setData('button_text', e.target.value)}
                                                error={errors.button_text}
                                                placeholder="e.g., Shop Now, Learn More"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-semantic-textSub mb-2">
                                                Button Link
                                            </label>
                                            <Input
                                                type="url"
                                                value={data.button_link}
                                                onChange={(e) => setData('button_link', e.target.value)}
                                                error={errors.button_link}
                                                placeholder="https://example.com/page"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-semantic-textSub mb-2">
                                                Button Style
                                            </label>
                                            <select
                                                value={data.button_style}
                                                onChange={(e) => setData('button_style', e.target.value as any)}
                                                className="w-full px-4 py-2 border border-semantic-border rounded-md focus:ring-brand-500 focus:border-brand-500"
                                            >
                                                <option value="primary">Primary (Filled)</option>
                                                <option value="secondary">Secondary (Gray)</option>
                                                <option value="outline">Outline</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Styling and Settings */}
                        <div className="space-y-6">
                            {/* Text Styling */}
                            <Card>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-semantic-text mb-4 flex items-center">
                                        <PaintBrushIcon className="h-5 w-5 mr-2" />
                                        Text Styling
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-semantic-textSub mb-2">
                                                Text Color
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="color"
                                                    value={data.text_color}
                                                    onChange={(e) => setData('text_color', e.target.value)}
                                                    className="h-10 w-16 rounded border border-semantic-border"
                                                />
                                                <Input
                                                    type="text"
                                                    value={data.text_color}
                                                    onChange={(e) => setData('text_color', e.target.value)}
                                                    className="flex-1"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-semantic-textSub mb-2">
                                                Text Position
                                            </label>
                                            <select
                                                value={data.text_position}
                                                onChange={(e) => setData('text_position', e.target.value as any)}
                                                className="w-full px-4 py-2 border border-semantic-border rounded-md focus:ring-brand-500 focus:border-brand-500"
                                            >
                                                <option value="left">Left</option>
                                                <option value="center">Center</option>
                                                <option value="right">Right</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-semantic-textSub mb-2">
                                                Text Alignment
                                            </label>
                                            <select
                                                value={data.text_alignment}
                                                onChange={(e) => setData('text_alignment', e.target.value as any)}
                                                className="w-full px-4 py-2 border border-semantic-border rounded-md focus:ring-brand-500 focus:border-brand-500"
                                            >
                                                <option value="left">Left Aligned</option>
                                                <option value="center">Center Aligned</option>
                                                <option value="right">Right Aligned</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Overlay Settings */}
                            <Card>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-semantic-text mb-4">
                                        Overlay Settings
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-semantic-textSub mb-2">
                                                Overlay Color
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="color"
                                                    value={data.overlay_color}
                                                    onChange={(e) => setData('overlay_color', e.target.value)}
                                                    className="h-10 w-16 rounded border border-semantic-border"
                                                />
                                                <Input
                                                    type="text"
                                                    value={data.overlay_color}
                                                    onChange={(e) => setData('overlay_color', e.target.value)}
                                                    className="flex-1"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-semantic-textSub mb-2">
                                                Overlay Opacity: {data.overlay_opacity}%
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={data.overlay_opacity}
                                                onChange={(e) => setData('overlay_opacity', parseInt(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* General Settings */}
                            <Card>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-semantic-text mb-4 flex items-center">
                                        <Cog6ToothIcon className="h-5 w-5 mr-2" />
                                        General Settings
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-semantic-textSub mb-2">
                                                Sort Order
                                            </label>
                                            <Input
                                                type="number"
                                                value={data.sort_order.toString()}
                                                onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                                min="0"
                                                placeholder="0"
                                            />
                                            <p className="mt-1 text-xs text-semantic-textSub">
                                                Lower numbers appear first
                                            </p>
                                        </div>

                                        <div>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.is_active}
                                                    onChange={(e) => setData('is_active', e.target.checked)}
                                                    className="rounded border-semantic-border text-brand-600 focus:ring-brand-500"
                                                />
                                                <span className="ml-2 text-sm text-semantic-text">
                                                    Active (visible on website)
                                                </span>
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-semantic-textSub mb-2">
                                                    Start Date
                                                </label>
                                                <Input
                                                    type="datetime-local"
                                                    value={data.start_date}
                                                    onChange={(e) => setData('start_date', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-semantic-textSub mb-2">
                                                    End Date
                                                </label>
                                                <Input
                                                    type="datetime-local"
                                                    value={data.end_date}
                                                    onChange={(e) => setData('end_date', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Preview Section */}
                    {showPreview && images.length > 0 && (
                        <Card>
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-semantic-text mb-4">
                                    Preview
                                </h3>
                                <div className="relative h-80 rounded-lg overflow-hidden">
                                    <div 
                                        className="absolute inset-0 z-10" 
                                        style={{ background: getOverlayStyle() }}
                                    />
                                    <img
                                        src={images[0].url || images[0].preview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 z-20 flex items-center">
                                        <div className="w-full px-8">
                                            <div 
                                                className={`max-w-xl ${
                                                    data.text_position === 'center' ? 'mx-auto text-center' :
                                                    data.text_position === 'right' ? 'ml-auto text-right' :
                                                    'mr-auto text-left'
                                                }`}
                                            >
                                                {data.title && (
                                                    <h1 
                                                        className={`text-2xl md:text-4xl font-bold mb-2 ${
                                                            data.text_alignment === 'center' ? 'text-center' :
                                                            data.text_alignment === 'right' ? 'text-right' :
                                                            'text-left'
                                                        }`}
                                                        style={{ color: data.text_color }}
                                                    >
                                                        {data.title}
                                                    </h1>
                                                )}
                                                {data.subtitle && (
                                                    <h2 
                                                        className={`text-lg md:text-xl mb-2 ${
                                                            data.text_alignment === 'center' ? 'text-center' :
                                                            data.text_alignment === 'right' ? 'text-right' :
                                                            'text-left'
                                                        }`}
                                                        style={{ color: data.text_color }}
                                                    >
                                                        {data.subtitle}
                                                    </h2>
                                                )}
                                                {data.description && (
                                                    <p 
                                                        className={`mb-4 ${
                                                            data.text_alignment === 'center' ? 'text-center' :
                                                            data.text_alignment === 'right' ? 'text-right' :
                                                            'text-left'
                                                        }`}
                                                        style={{ color: data.text_color }}
                                                    >
                                                        {data.description}
                                                    </p>
                                                )}
                                                {data.button_text && (
                                                    <div className={
                                                        data.text_alignment === 'center' ? 'text-center' :
                                                        data.text_alignment === 'right' ? 'text-right' :
                                                        'text-left'
                                                    }>
                                                        <span
                                                            className={`px-6 py-2 rounded-lg font-semibold inline-block ${
                                                                data.button_style === 'secondary' ? 'bg-gray-600 text-white' :
                                                                data.button_style === 'outline' ? 'border-2 border-white text-white' :
                                                                'bg-brand-600 text-white'
                                                            }`}
                                                        >
                                                            {data.button_text}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-4">
                        <Link href={route('admin.sliders.index')}>
                            <Button variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={processing}
                        >
                            {processing ? 'Creating...' : 'Create Slider'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
