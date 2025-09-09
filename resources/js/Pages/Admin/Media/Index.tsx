import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MediaLibrary from '@/Components/ContentManagement/MediaLibrary';
import {
    PhotoIcon,
    PlusIcon,
    TrashIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    DocumentIcon,
} from '@heroicons/react/24/outline';

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
    updated_at: string;
}

interface Props extends PageProps {
    files: {
        data: MediaFile[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        type?: string;
    };
}

export default function MediaIndex({ auth, files, filters }: Props) {
    const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
    const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [filterType, setFilterType] = useState(filters.type || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/media', {
            search: searchTerm,
            type: filterType,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSelectAll = () => {
        if (selectedFiles.length === files.data.length) {
            setSelectedFiles([]);
        } else {
            setSelectedFiles(files.data.map(file => file.id));
        }
    };

    const handleSelectFile = (fileId: number) => {
        if (selectedFiles.includes(fileId)) {
            setSelectedFiles(selectedFiles.filter(id => id !== fileId));
        } else {
            setSelectedFiles([...selectedFiles, fileId]);
        }
    };

    const handleBulkDelete = () => {
        if (selectedFiles.length === 0) return;
        
        if (confirm(`Are you sure you want to delete ${selectedFiles.length} file(s)?`)) {
            router.post('/admin/media/bulk-action', {
                action: 'delete',
                file_ids: selectedFiles,
            }, {
                onSuccess: () => {
                    setSelectedFiles([]);
                },
            });
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) {
            return PhotoIcon;
        }
        return DocumentIcon;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Media Library
                    </h2>
                    <button
                        onClick={() => setIsMediaLibraryOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Upload Files
                    </button>
                </div>
            }
        >
            <Head title="Media Library" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Filters and Search */}
                        <div className="p-6 border-b border-gray-200">
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search files..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FunnelIcon className="h-5 w-5 text-gray-400" />
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">All Types</option>
                                        <option value="image">Images</option>
                                        <option value="video">Videos</option>
                                        <option value="document">Documents</option>
                                    </select>
                                    <button
                                        type="submit"
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        Filter
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Bulk Actions */}
                        {selectedFiles.length > 0 && (
                            <div className="p-4 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        {selectedFiles.length} file(s) selected
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={handleBulkDelete}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center"
                                        >
                                            <TrashIcon className="h-4 w-4 mr-1" />
                                            Delete Selected
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Files Grid */}
                        <div className="p-6">
                            {files.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No media files</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Get started by uploading your first file.
                                    </p>
                                    <div className="mt-6">
                                        <button
                                            onClick={() => setIsMediaLibraryOpen(true)}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                                        >
                                            <PlusIcon className="h-4 w-4 mr-2" />
                                            Upload Files
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Select All Checkbox */}
                                    <div className="mb-4">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedFiles.length === files.data.length}
                                                onChange={handleSelectAll}
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                                Select all files
                                            </span>
                                        </label>
                                    </div>

                                    {/* Files Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {files.data.map((file) => {
                                            const isSelected = selectedFiles.includes(file.id);
                                            const Icon = getFileIcon(file.mime_type);
                                            
                                            return (
                                                <div
                                                    key={file.id}
                                                    className={`relative group cursor-pointer rounded-lg border-2 p-2 transition-all ${
                                                        isSelected
                                                            ? 'border-indigo-500 bg-indigo-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                    onClick={() => handleSelectFile(file.id)}
                                                >
                                                    {/* Selection checkbox */}
                                                    <div className="absolute top-2 left-2 z-10">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => handleSelectFile(file.id)}
                                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </div>

                                                    {/* File preview */}
                                                    <div className="aspect-square flex items-center justify-center bg-gray-100 rounded mb-2">
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

                                                    {/* File info */}
                                                    <div className="text-xs">
                                                        <p className="font-medium text-gray-900 truncate" title={file.original_name}>
                                                            {file.original_name}
                                                        </p>
                                                        <p className="text-gray-500 mt-1">
                                                            {formatFileSize(file.size)}
                                                        </p>
                                                        <p className="text-gray-400">
                                                            {new Date(file.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>

                                                    {/* Actions overlay */}
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    window.open(file.url, '_blank');
                                                                }}
                                                                className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100"
                                                                title="View file"
                                                            >
                                                                <PhotoIcon className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (confirm('Are you sure you want to delete this file?')) {
                                                                        router.delete(`/admin/media/${file.id}`);
                                                                    }
                                                                }}
                                                                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                                                                title="Delete file"
                                                            >
                                                                <TrashIcon className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Pagination */}
                                    {files.last_page > 1 && (
                                        <div className="mt-8 flex items-center justify-between">
                                            <div className="text-sm text-gray-700">
                                                Showing {((files.current_page - 1) * files.per_page) + 1} to{' '}
                                                {Math.min(files.current_page * files.per_page, files.total)} of{' '}
                                                {files.total} results
                                            </div>
                                            <div className="flex space-x-2">
                                                {files.current_page > 1 && (
                                                    <Link
                                                        href={`/admin/media?page=${files.current_page - 1}`}
                                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                                    >
                                                        Previous
                                                    </Link>
                                                )}
                                                {files.current_page < files.last_page && (
                                                    <Link
                                                        href={`/admin/media?page=${files.current_page + 1}`}
                                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                                    >
                                                        Next
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Media Library Modal */}
            <MediaLibrary
                isOpen={isMediaLibraryOpen}
                onClose={() => setIsMediaLibraryOpen(false)}
                onSelect={() => {
                    setIsMediaLibraryOpen(false);
                    router.reload();
                }}
            />
        </AuthenticatedLayout>
    );
}
