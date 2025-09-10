import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
    PhotoIcon, 
    XMarkIcon, 
    ArrowUpTrayIcon,
    EyeIcon,
    TrashIcon,
    ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

interface ImageFile {
    id?: number;
    file?: File;
    url: string;
    name: string;
    size?: number;
    is_primary?: boolean;
    alt_text?: string;
    preview?: string;
}

interface UploadingImage {
    id: string;
    file: File;
    preview: string;
    progress: number;
    error?: string;
}

interface DragDropImageUploadProps {
    /** Current images */
    images: ImageFile[];
    /** Callback when images change */
    onImagesChange?: (images: ImageFile[]) => void;
    /** Maximum number of images allowed */
    maxImages?: number;
    /** Accept multiple images */
    multiple?: boolean;
    /** Max file size in bytes (default: 5MB) */
    maxSize?: number;
    /** Accepted file types */
    accept?: string[];
    /** Upload endpoint (required for immediate upload) */
    uploadEndpoint?: string;
    /** Additional form data to send with upload */
    uploadData?: Record<string, any>;
    /** Show preview of uploaded images */
    showPreview?: boolean;
    /** Allow reordering of images */
    allowReorder?: boolean;
    /** Allow setting primary image */
    allowPrimary?: boolean;
    /** Custom upload handler (if not using uploadEndpoint) */
    onUpload?: (files: File[]) => Promise<ImageFile[]>;
    /** Custom delete handler */
    onDelete?: (image: ImageFile) => Promise<void>;
    /** Custom error handler */
    onError?: (error: string) => void;
    /** CSS classes */
    className?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Help text */
    helpText?: string;
    /** Required field */
    required?: boolean;
    /** Label */
    label?: string;
}

export default function DragDropImageUpload({
    images = [],
    onImagesChange,
    maxImages = 10,
    multiple = true,
    maxSize = 5 * 1024 * 1024, // 5MB
    accept = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    uploadEndpoint,
    uploadData = {},
    showPreview = true,
    allowReorder = false,
    allowPrimary = false,
    onUpload,
    onDelete,
    onError,
    className = '',
    disabled = false,
    helpText,
    required = false,
    label = 'Images'
}: DragDropImageUploadProps) {
    const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const hasReachedLimit = images.length + uploadingImages.length >= maxImages;

    // Handle file drop and selection
    const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
        // Handle rejected files
        if (rejectedFiles.length > 0) {
            const errors = rejectedFiles.map(({ file, errors }) => 
                `${file.name}: ${errors.map((e: any) => e.message).join(', ')}`
            );
            onError?.(errors.join('\n'));
            return;
        }

        // Check if we've reached the limit
        if (images.length + uploadingImages.length + acceptedFiles.length > maxImages) {
            onError?.(`Maximum ${maxImages} images allowed`);
            return;
        }

        // Create uploading state for each file
        const newUploadingImages: UploadingImage[] = acceptedFiles.map((file, index) => ({
            id: `upload-${Date.now()}-${index}`,
            file,
            preview: URL.createObjectURL(file),
            progress: 0
        }));

        setUploadingImages(prev => [...prev, ...newUploadingImages]);

        // Handle upload
        if (onUpload) {
            // Custom upload handler
            try {
                const uploadedImages = await onUpload(acceptedFiles);
                setUploadingImages(prev => prev.filter(img => 
                    !newUploadingImages.find(newImg => newImg.id === img.id)
                ));
                onImagesChange?.([...images, ...uploadedImages]);
            } catch (error) {
                setUploadingImages(prev => 
                    prev.map(img => 
                        newUploadingImages.find(newImg => newImg.id === img.id)
                            ? { ...img, error: error instanceof Error ? error.message : 'Upload failed' }
                            : img
                    )
                );
            }
        } else if (uploadEndpoint) {
            // Default upload to endpoint
            await uploadToEndpoint(newUploadingImages);
        } else {
            // No upload, just add as local files
            const newImages: ImageFile[] = acceptedFiles.map((file, index) => ({
                id: Date.now() + index,
                file,
                url: URL.createObjectURL(file),
                name: file.name,
                size: file.size,
                preview: URL.createObjectURL(file)
            }));
            
            setUploadingImages(prev => prev.filter(img => 
                !newUploadingImages.find(newImg => newImg.id === img.id)
            ));
            onImagesChange?.([...images, ...newImages]);
        }
    }, [images, uploadingImages, maxImages, onUpload, uploadEndpoint, uploadData, onImagesChange, onError]);

    // Upload to endpoint
    const uploadToEndpoint = async (imagesToUpload: UploadingImage[]) => {
        for (const imageData of imagesToUpload) {
            try {
                const formData = new FormData();
                formData.append('image', imageData.file);
                
                // Add additional upload data
                Object.entries(uploadData).forEach(([key, value]) => {
                    formData.append(key, value.toString());
                });

                // Set as primary if it's the first image
                if (allowPrimary && images.length === 0) {
                    formData.append('is_primary', 'true');
                }

                // Update progress
                setUploadingImages(prev =>
                    prev.map(img =>
                        img.id === imageData.id
                            ? { ...img, progress: 10 }
                            : img
                    )
                );

                const response = await fetch(uploadEndpoint!, {
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
                    // Complete upload
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
                        onImagesChange?.([...images, result.image]);
                    }, 500);
                } else {
                    throw new Error(result.message || 'Upload failed');
                }
            } catch (error) {
                setUploadingImages(prev =>
                    prev.map(img =>
                        img.id === imageData.id
                            ? { ...img, error: error instanceof Error ? error.message : 'Upload failed' }
                            : img
                    )
                );
                onError?.(error instanceof Error ? error.message : 'Upload failed');
            }
        }
    };

    // Configure dropzone
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject
    } = useDropzone({
        onDrop,
        accept: accept.reduce((acc, type) => {
            acc[type] = [];
            return acc;
        }, {} as Record<string, string[]>),
        maxSize,
        multiple: multiple && !hasReachedLimit,
        disabled: disabled || hasReachedLimit,
        onDragEnter: () => setDragOver(true),
        onDragLeave: () => setDragOver(false),
        onDropAccepted: () => setDragOver(false),
        onDropRejected: () => setDragOver(false),
    });

    // Handle image removal
    const handleRemoveImage = async (image: ImageFile, index: number) => {
        if (onDelete) {
            try {
                await onDelete(image);
            } catch (error) {
                onError?.(error instanceof Error ? error.message : 'Delete failed');
                return;
            }
        }

        // Remove from local state
        const updatedImages = images.filter((_, i) => i !== index);
        onImagesChange?.(updatedImages);
    };

    // Handle setting primary image
    const handleSetPrimary = (index: number) => {
        if (!allowPrimary) return;
        
        const updatedImages = images.map((img, i) => ({
            ...img,
            is_primary: i === index
        }));
        onImagesChange?.(updatedImages);
    };

    // Handle image reordering
    const handleMoveImage = (fromIndex: number, toIndex: number) => {
        if (!allowReorder) return;
        
        const updatedImages = [...images];
        const [movedImage] = updatedImages.splice(fromIndex, 1);
        updatedImages.splice(toIndex, 0, movedImage);
        onImagesChange?.(updatedImages);
    };

    // Format file size
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Label */}
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Upload Area */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
                    disabled || hasReachedLimit
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        : isDragActive
                        ? 'border-blue-400 bg-blue-50'
                        : isDragReject
                        ? 'border-red-400 bg-red-50'
                        : dragOver
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
            >
                <input {...getInputProps()} />
                
                <div className="space-y-2">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                        {isDragActive ? (
                            <ArrowUpTrayIcon className="h-12 w-12" />
                        ) : (
                            <PhotoIcon className="h-12 w-12" />
                        )}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                        {disabled || hasReachedLimit ? (
                            <span>Maximum {maxImages} images reached</span>
                        ) : isDragActive ? (
                            <span className="font-medium text-blue-600">Drop images here...</span>
                        ) : (
                            <>
                                <span className="font-medium text-blue-600 hover:text-blue-500">
                                    Click to upload
                                </span>
                                {' '}or drag and drop
                            </>
                        )}
                    </div>
                    
                    {helpText ? (
                        <p className="text-xs text-gray-500">{helpText}</p>
                    ) : (
                        <div className="text-xs text-gray-500 space-y-1">
                            <p>PNG, JPG, GIF, WebP up to {formatFileSize(maxSize)}</p>
                            {multiple && <p>Maximum {maxImages} images</p>}
                        </div>
                    )}
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
                                            <div className="text-center">
                                                <ExclamationTriangleIcon className="h-6 w-6 text-red-400 mx-auto mb-1" />
                                                <span className="text-red-400 text-xs">{image.error}</span>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <div className="text-white text-sm font-medium">{image.progress}%</div>
                                                <div className="w-16 bg-gray-700 rounded-full h-1 mt-1">
                                                    <div 
                                                        className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                                                        style={{ width: `${image.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Uploaded Images */}
            {showPreview && images.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                            <div key={image.id || index} className="relative group">
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={image.url || image.preview}
                                        alt={image.alt_text || image.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Replace with placeholder if image fails to load
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTIwQzEwNiA5NSAxMTcuNSA3NS4yIDEzOCA3NS4ySDEzNFY2Mi4ySDEzOEMxMjUuNyA2Mi4yIDExNC45IDcwLjEgMTAwIDEwNy43QzgyLjkgNjkuNCA3NC4xIDYyLjIgNjJINjZWNzUuMkg2MkM4Mi41IDc1LjIgOTQgOTUgMTAwIDEyMFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTEzOCAxMzguOEMxMTcuNSAxMzguOCAxMDYgMTE5IDEwMCA5NEw5OS41IDU3TDEwMCA5NEMxMDYgMTE5IDExNy41IDEzOC44IDEzOCAxMzguOEgxMzRWMTUxLjhIMTM4QzE1MC4zIDEzMS44IDEzOCAxMzguOCAxMzggMTM4LjhaIiBmaWxsPSIjOUNBNEFGIi8+Cjwvc3ZnPgo=';
                                            target.title = 'Image not found';
                                        }}
                                    />
                                </div>
                                
                                {/* Primary Badge */}
                                {allowPrimary && image.is_primary && (
                                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                        Primary
                                    </div>
                                )}

                                {/* Controls */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="flex space-x-2">
                                        {/* View */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const imageUrl = image.url || image.preview;
                                                if (imageUrl) {
                                                    // For blob URLs or valid URLs, open directly
                                                    if (imageUrl.startsWith('blob:') || imageUrl.startsWith('data:') || imageUrl.startsWith('http')) {
                                                        window.open(imageUrl, '_blank');
                                                    } else {
                                                        // For relative paths, make sure they're accessible
                                                        const fullUrl = imageUrl.startsWith('/') ? window.location.origin + imageUrl : imageUrl;
                                                        // Test if image is accessible before opening
                                                        const img = new Image();
                                                        img.onload = () => window.open(fullUrl, '_blank');
                                                        img.onerror = () => {
                                                            alert('Image cannot be displayed. The file may not exist or is not accessible.');
                                                        };
                                                        img.src = fullUrl;
                                                    }
                                                }
                                            }}
                                            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                                            title="View image"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                        </button>

                                        {/* Set as primary */}
                                        {allowPrimary && !image.is_primary && (
                                            <button
                                                type="button"
                                                onClick={() => handleSetPrimary(index)}
                                                className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
                                                title="Set as primary"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                </svg>
                                            </button>
                                        )}

                                        {/* Remove */}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(image, index)}
                                            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                                            title="Remove image"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Reorder Controls */}
                                {allowReorder && (
                                    <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => handleMoveImage(index, index - 1)}
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
                                                onClick={() => handleMoveImage(index, index + 1)}
                                                className="bg-gray-800 text-white p-1 rounded hover:bg-gray-700 transition-colors"
                                                title="Move down"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Image info */}
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div>{image.name}</div>
                                    {image.size && <div>{formatFileSize(image.size)}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {images.length === 0 && uploadingImages.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                    No images uploaded yet. {hasReachedLimit ? '' : 'Use the upload area above to add images.'}
                </div>
            )}
        </div>
    );
}
