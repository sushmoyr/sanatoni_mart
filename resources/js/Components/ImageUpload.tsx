import React, { useState, useCallback, useRef } from 'react';
import { router } from '@inertiajs/react';

declare function route(name: string, params?: any): string;

interface ImageUploadProps {
    productId?: number;
    images: any[];
    onImagesChange?: (images: any[]) => void;
    maxImages?: number;
    className?: string;
}

interface UploadingImage {
    id: string;
    file: File;
    preview: string;
    progress: number;
    error?: string;
}

export default function ImageUpload({ 
    productId, 
    images = [], 
    onImagesChange, 
    maxImages = 10,
    className = ''
}: ImageUploadProps) {
    const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;

        const newImages: UploadingImage[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                const id = `upload-${Date.now()}-${i}`;
                newImages.push({
                    id,
                    file,
                    preview: URL.createObjectURL(file),
                    progress: 0
                });
            }
        }

        if (newImages.length > 0) {
            setUploadingImages(prev => [...prev, ...newImages]);
            uploadImages(newImages);
        }
    };

    const uploadImages = async (imagesToUpload: UploadingImage[]) => {
        for (const imageData of imagesToUpload) {
            try {
                const formData = new FormData();
                formData.append('image', imageData.file);
                formData.append('alt_text', '');
                if (productId) {
                    formData.append('product_id', productId.toString());
                }
                formData.append('is_primary', (images.length === 0).toString());

                // Start upload progress
                setUploadingImages(prev =>
                    prev.map(img =>
                        img.id === imageData.id
                            ? { ...img, progress: 10 }
                            : img
                    )
                );

                // Upload to backend
                const response = await fetch(route('admin.products.upload-image'), {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });

                setUploadingImages(prev =>
                    prev.map(img =>
                        img.id === imageData.id
                            ? { ...img, progress: 90 }
                            : img
                    )
                );

                if (!response.ok) {
                    throw new Error(`Upload failed: ${response.statusText}`);
                }

                const result = await response.json();

                if (result.success) {
                    // Complete upload progress
                    setUploadingImages(prev =>
                        prev.map(img =>
                            img.id === imageData.id
                                ? { ...img, progress: 100 }
                                : img
                        )
                    );

                    // Remove from uploading and add to images
                    setTimeout(() => {
                        setUploadingImages(prev => prev.filter(img => img.id !== imageData.id));
                        const updatedImages = [...images, result.image];
                        onImagesChange?.(updatedImages);
                    }, 500);
                } else {
                    throw new Error('Upload failed');
                }

            } catch (error) {
                setUploadingImages(prev =>
                    prev.map(img =>
                        img.id === imageData.id
                            ? { ...img, error: error instanceof Error ? error.message : 'Upload failed' }
                            : img
                    )
                );
            }
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const removeImage = async (imageId: number) => {
        if (!productId) {
            // If no productId, just remove from local state (for creation)
            const updatedImages = images.filter(img => img.id !== imageId);
            onImagesChange?.(updatedImages);
            return;
        }

        try {
            const response = await fetch(route('admin.products.delete-image'), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ image_id: imageId }),
            });

            if (response.ok) {
                const updatedImages = images.filter(img => img.id !== imageId);
                onImagesChange?.(updatedImages);
            }
        } catch (error) {
            console.error('Failed to delete image:', error);
        }
    };

    const setPrimaryImage = async (imageId: number) => {
        if (!productId) {
            // If no productId, just update local state (for creation)
            const updatedImages = images.map(img => ({
                ...img,
                is_primary: img.id === imageId
            }));
            onImagesChange?.(updatedImages);
            return;
        }

        try {
            const response = await fetch(route('admin.products.update-image'), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ 
                    image_id: imageId,
                    is_primary: true 
                }),
            });

            if (response.ok) {
                const updatedImages = images.map(img => ({
                    ...img,
                    is_primary: img.id === imageId
                }));
                onImagesChange?.(updatedImages);
            }
        } catch (error) {
            console.error('Failed to update image:', error);
        }
    };

    const moveImage = (fromIndex: number, toIndex: number) => {
        const newImages = [...images];
        const [movedImage] = newImages.splice(fromIndex, 1);
        newImages.splice(toIndex, 0, movedImage);
        
        const updatedImages = newImages.map((img, index) => ({
            ...img,
            sort_order: index
        }));
        onImagesChange?.(updatedImages);
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragOver 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files)}
                />
                <div className="space-y-2">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="text-sm text-gray-600">
                        <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                            Click to upload
                        </span>
                        {' '}or drag and drop
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB</p>
                    <p className="text-xs text-gray-500">Maximum {maxImages} images</p>
                </div>
            </div>

            {/* Uploading Images */}
            {uploadingImages.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Uploading...</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {uploadingImages.map((image) => (
                            <div key={image.id} className="relative">
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={image.preview}
                                        alt="Uploading"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        {image.error ? (
                                            <span className="text-red-400 text-xs">{image.error}</span>
                                        ) : (
                                            <div className="text-white text-xs">{image.progress}%</div>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gray-200 rounded-b-lg">
                                    <div 
                                        className="bg-blue-600 h-1 rounded-b-lg transition-all duration-300"
                                        style={{ width: `${image.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Existing Images */}
            {images.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Product Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                            <div key={image.id} className="relative group">
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={image.url || `/storage/${image.image_path}`}
                                        alt={image.alt_text || 'Product image'}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                
                                {/* Primary Badge */}
                                {image.is_primary && (
                                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                        Primary
                                    </div>
                                )}

                                {/* Controls */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="flex space-x-2">
                                        {!image.is_primary && (
                                            <button
                                                type="button"
                                                onClick={() => setPrimaryImage(image.id)}
                                                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                                                title="Set as primary"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                </svg>
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(image.id)}
                                            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                                            title="Remove image"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Sort Order Controls */}
                                <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => moveImage(index, index - 1)}
                                            className="bg-gray-800 text-white p-1 rounded hover:bg-gray-700 transition-colors"
                                            title="Move up"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                            </svg>
                                        </button>
                                    )}
                                    {index < images.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={() => moveImage(index, index + 1)}
                                            className="bg-gray-800 text-white p-1 rounded hover:bg-gray-700 transition-colors"
                                            title="Move down"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {images.length === 0 && uploadingImages.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                    No images uploaded yet. Click the upload area above to add product images.
                </div>
            )}
        </div>
    );
}
