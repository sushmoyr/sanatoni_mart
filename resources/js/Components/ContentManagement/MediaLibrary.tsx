import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
    XMarkIcon,
    PhotoIcon,
    DocumentIcon,
    TrashIcon,
    EyeIcon,
    ArrowDownTrayIcon,
    MagnifyingGlassIcon,
    FolderIcon,
} from '@heroicons/react/24/outline';
import { router } from '@inertiajs/react';

interface MediaFile {
    id: number;
    filename: string;
    original_name: string;
    mime_type: string;
    size: number;
    path: string;
    alt_text?: string;
    url: string;
    thumbnail_url?: string;
    created_at: string;
}

interface MediaLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect?: (file: MediaFile) => void;
    multiple?: boolean;
    fileTypes?: string[];
    selectedFiles?: MediaFile[];
}

export default function MediaLibrary({
    isOpen,
    onClose,
    onSelect,
    multiple = false,
    fileTypes = ['image/*', 'video/*', 'application/pdf'],
    selectedFiles = [],
}: MediaLibraryProps) {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTab, setSelectedTab] = useState<'upload' | 'library'>('library');
    const [selectedItems, setSelectedItems] = useState<MediaFile[]>(selectedFiles);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Load media files
    const loadFiles = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('/admin/media');
            const data = await response.json();
            if (data.success) {
                setFiles(data.files);
            }
        } catch (error) {
            console.error('Error loading media files:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            loadFiles();
        }
    }, [isOpen, loadFiles]);

    // File upload
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setUploading(true);
        const formData = new FormData();
        
        acceptedFiles.forEach((file) => {
            formData.append('files[]', file);
        });

        try {
            const response = await fetch('/admin/media', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();
            if (data.success) {
                await loadFiles(); // Reload files after upload
            }
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    }, [loadFiles]);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
    } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'],
            'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        },
        maxSize: 10 * 1024 * 1024, // 10MB
        multiple: true,
    });

    // Filter files based on search
    const filteredFiles = files.filter(file =>
        file.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.alt_text?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle file selection
    const handleFileSelect = (file: MediaFile) => {
        if (multiple) {
            const isSelected = selectedItems.some(item => item.id === file.id);
            if (isSelected) {
                setSelectedItems(prev => prev.filter(item => item.id !== file.id));
            } else {
                setSelectedItems(prev => [...prev, file]);
            }
        } else {
            setSelectedItems([file]);
        }
    };

    // Handle selection confirmation
    const handleConfirmSelection = () => {
        if (onSelect) {
            if (multiple) {
                selectedItems.forEach(file => onSelect(file));
            } else if (selectedItems.length > 0) {
                onSelect(selectedItems[0]);
            }
        }
        onClose();
    };

    // Delete file
    const handleDeleteFile = async (fileId: number) => {
        if (confirm('Are you sure you want to delete this file?')) {
            try {
                const response = await fetch(`/admin/media/${fileId}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                });

                if (response.ok) {
                    await loadFiles();
                }
            } catch (error) {
                console.error('Delete error:', error);
            }
        }
    };

    // Format file size
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Get file icon
    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) {
            return PhotoIcon;
        }
        return DocumentIcon;
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-6">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        Media Library
                                    </Dialog.Title>
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-gray-600"
                                        onClick={onClose}
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                {/* Tabs */}
                                <div className="mb-6">
                                    <nav className="flex space-x-8">
                                        <button
                                            onClick={() => setSelectedTab('library')}
                                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                                selectedTab === 'library'
                                                    ? 'border-indigo-500 text-indigo-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            <FolderIcon className="h-5 w-5 inline mr-2" />
                                            Media Library
                                        </button>
                                        <button
                                            onClick={() => setSelectedTab('upload')}
                                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                                selectedTab === 'upload'
                                                    ? 'border-indigo-500 text-indigo-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            <ArrowDownTrayIcon className="h-5 w-5 inline mr-2" />
                                            Upload Files
                                        </button>
                                    </nav>
                                </div>

                                {selectedTab === 'upload' && (
                                    <div className="mb-6">
                                        <div
                                            {...getRootProps()}
                                            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                                                isDragActive
                                                    ? 'border-indigo-500 bg-indigo-50'
                                                    : isDragReject
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            <input {...getInputProps()} />
                                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-600">
                                                {isDragActive ? (
                                                    'Drop the files here...'
                                                ) : (
                                                    <>
                                                        Drag & drop files here, or{' '}
                                                        <span className="text-indigo-600 font-medium">click to select</span>
                                                    </>
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                PNG, JPG, GIF, PDF up to 10MB
                                            </p>
                                        </div>
                                        {uploading && (
                                            <div className="mt-4 text-center">
                                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                                <p className="mt-2 text-sm text-gray-600">Uploading files...</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selectedTab === 'library' && (
                                    <>
                                        {/* Search and filters */}
                                        <div className="mb-6 flex items-center space-x-4">
                                            <div className="flex-1 relative">
                                                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search media files..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            </div>
                                            <div className="flex rounded-md shadow-sm">
                                                <button
                                                    onClick={() => setViewMode('grid')}
                                                    className={`px-3 py-2 text-sm font-medium border ${
                                                        viewMode === 'grid'
                                                            ? 'bg-gray-100 text-gray-900'
                                                            : 'bg-white text-gray-700 hover:text-gray-900'
                                                    } rounded-l-md border-gray-300`}
                                                >
                                                    Grid
                                                </button>
                                                <button
                                                    onClick={() => setViewMode('list')}
                                                    className={`px-3 py-2 text-sm font-medium border-t border-r border-b ${
                                                        viewMode === 'list'
                                                            ? 'bg-gray-100 text-gray-900'
                                                            : 'bg-white text-gray-700 hover:text-gray-900'
                                                    } rounded-r-md border-gray-300`}
                                                >
                                                    List
                                                </button>
                                            </div>
                                        </div>

                                        {/* Files grid/list */}
                                        <div className="max-h-96 overflow-y-auto">
                                            {loading ? (
                                                <div className="text-center py-12">
                                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                                    <p className="mt-2 text-sm text-gray-600">Loading files...</p>
                                                </div>
                                            ) : filteredFiles.length === 0 ? (
                                                <div className="text-center py-12">
                                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                    <p className="mt-2 text-sm text-gray-600">No files found</p>
                                                </div>
                                            ) : viewMode === 'grid' ? (
                                                <div className="grid grid-cols-6 gap-4">
                                                    {filteredFiles.map((file) => {
                                                        const isSelected = selectedItems.some(item => item.id === file.id);
                                                        const Icon = getFileIcon(file.mime_type);
                                                        
                                                        return (
                                                            <div
                                                                key={file.id}
                                                                className={`relative group cursor-pointer rounded-lg border-2 p-2 ${
                                                                    isSelected
                                                                        ? 'border-indigo-500 bg-indigo-50'
                                                                        : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                                onClick={() => handleFileSelect(file)}
                                                            >
                                                                <div className="aspect-square flex items-center justify-center bg-gray-100 rounded">
                                                                    {file.mime_type.startsWith('image/') ? (
                                                                        <img
                                                                            src={file.thumbnail_url || file.url}
                                                                            alt={file.alt_text || file.original_name}
                                                                            className="w-full h-full object-cover rounded"
                                                                        />
                                                                    ) : (
                                                                        <Icon className="h-8 w-8 text-gray-400" />
                                                                    )}
                                                                </div>
                                                                <p className="mt-1 text-xs text-gray-600 truncate" title={file.original_name}>
                                                                    {file.original_name}
                                                                </p>
                                                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteFile(file.id);
                                                                        }}
                                                                        className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                                                                    >
                                                                        <TrashIcon className="h-3 w-3" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {filteredFiles.map((file) => {
                                                        const isSelected = selectedItems.some(item => item.id === file.id);
                                                        const Icon = getFileIcon(file.mime_type);
                                                        
                                                        return (
                                                            <div
                                                                key={file.id}
                                                                className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                                                                    isSelected
                                                                        ? 'border-indigo-500 bg-indigo-50'
                                                                        : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                                onClick={() => handleFileSelect(file)}
                                                            >
                                                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded">
                                                                    {file.mime_type.startsWith('image/') ? (
                                                                        <img
                                                                            src={file.thumbnail_url || file.url}
                                                                            alt={file.alt_text || file.original_name}
                                                                            className="w-full h-full object-cover rounded"
                                                                        />
                                                                    ) : (
                                                                        <Icon className="h-5 w-5 text-gray-400" />
                                                                    )}
                                                                </div>
                                                                <div className="ml-3 flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                                        {file.original_name}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {formatFileSize(file.size)} • {new Date(file.created_at).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                                <div className="ml-3 flex items-center space-x-2">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            window.open(file.url, '_blank');
                                                                        }}
                                                                        className="p-1 text-gray-400 hover:text-gray-600"
                                                                    >
                                                                        <EyeIcon className="h-4 w-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteFile(file.id);
                                                                        }}
                                                                        className="p-1 text-red-400 hover:text-red-600"
                                                                    >
                                                                        <TrashIcon className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Footer actions */}
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        {selectedItems.length > 0 && (
                                            `${selectedItems.length} file${selectedItems.length > 1 ? 's' : ''} selected`
                                        )}
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            type="button"
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>
                                        {onSelect && selectedItems.length > 0 && (
                                            <button
                                                type="button"
                                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                                                onClick={handleConfirmSelection}
                                            >
                                                Select {selectedItems.length > 1 ? `${selectedItems.length} Files` : 'File'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
