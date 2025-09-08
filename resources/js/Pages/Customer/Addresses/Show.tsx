import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Card, Button, Badge } from '@/Components/ui';
import { 
    MapPinIcon,
    PencilIcon,
    TrashIcon,
    StarIcon,
    HomeIcon,
    BuildingOfficeIcon,
    EllipsisHorizontalIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Address {
    id: number;
    type: 'home' | 'work' | 'other';
    name?: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    is_default: boolean;
    full_address: string;
    created_at: string;
    updated_at: string;
}

interface AddressShowProps extends PageProps {
    address: Address;
}

export default function AddressShow({ auth, address }: AddressShowProps) {
    const handleSetDefault = () => {
        router.put(route('addresses.set-default', address.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Optionally show success message
            }
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this address?')) {
            router.delete(route('addresses.destroy', address.id), {
                onSuccess: () => {
                    router.visit(route('addresses.index'));
                }
            });
        }
    };

    const getAddressIcon = (type: string) => {
        switch (type) {
            case 'home':
                return <HomeIcon className="w-6 h-6" />;
            case 'work':
                return <BuildingOfficeIcon className="w-6 h-6" />;
            default:
                return <MapPinIcon className="w-6 h-6" />;
        }
    };

    const getAddressTypeBadge = (type: 'home' | 'work' | 'other') => {
        const variants = {
            home: 'default',
            work: 'secondary',
            other: 'info'
        } as const;
        
        return (
            <Badge variant={variants[type]} className="capitalize">
                {type}
            </Badge>
        );
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Address Details - ${address.name || address.type}`} />

            <div className="py-12">
                <div className="container-custom max-w-4xl">
                    {/* Header */}
                    <div className="flex items-center mb-8">
                        <Link 
                            href={route('addresses.index')}
                            className="mr-4 p-2 rounded-lg hover:bg-semantic-surface transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5 text-semantic-textSub" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                                Address Details
                            </h1>
                            <p className="text-semantic-textSub">
                                View and manage this address
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Address Information */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="text-brand-600">
                                                {getAddressIcon(address.type)}
                                            </div>
                                            <div>
                                                {getAddressTypeBadge(address.type)}
                                                {address.name && (
                                                    <h2 className="text-xl font-semibold text-semantic-text mt-2">
                                                        {address.name}
                                                    </h2>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {address.is_default && (
                                            <div className="flex items-center text-brand-600">
                                                <StarIconSolid className="w-5 h-5 mr-2" />
                                                <span className="text-sm font-medium">Default Address</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-semibold text-semantic-text mb-3">
                                            Address Information
                                        </h3>
                                        
                                        <div className="space-y-2 text-semantic-textSub">
                                            <p className="flex items-start">
                                                <span className="font-medium text-semantic-text w-24 flex-shrink-0">Address:</span>
                                                <span>{address.address_line_1}</span>
                                            </p>
                                            
                                            {address.address_line_2 && (
                                                <p className="flex items-start">
                                                    <span className="w-24 flex-shrink-0"></span>
                                                    <span>{address.address_line_2}</span>
                                                </p>
                                            )}
                                            
                                            <p className="flex items-start">
                                                <span className="font-medium text-semantic-text w-24 flex-shrink-0">City:</span>
                                                <span>{address.city}</span>
                                            </p>
                                            
                                            <p className="flex items-start">
                                                <span className="font-medium text-semantic-text w-24 flex-shrink-0">State:</span>
                                                <span>{address.state}</span>
                                            </p>
                                            
                                            <p className="flex items-start">
                                                <span className="font-medium text-semantic-text w-24 flex-shrink-0">Postal:</span>
                                                <span>{address.postal_code}</span>
                                            </p>
                                            
                                            <p className="flex items-start">
                                                <span className="font-medium text-semantic-text w-24 flex-shrink-0">Country:</span>
                                                <span>{address.country}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Full Address */}
                                    <div className="mt-6 p-4 bg-semantic-surface rounded-lg">
                                        <h4 className="text-sm font-medium text-semantic-text mb-2">
                                            Complete Address
                                        </h4>
                                        <p className="text-semantic-textSub">
                                            {address.full_address}
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            {/* Additional Information */}
                            <Card>
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-semantic-text mb-4">
                                        Additional Information
                                    </h3>
                                    
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-semantic-textSub">Address Type:</span>
                                            <span className="text-semantic-text font-medium capitalize">{address.type}</span>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <span className="text-semantic-textSub">Default Address:</span>
                                            <span className={`font-medium ${address.is_default ? 'text-brand-600' : 'text-semantic-text'}`}>
                                                {address.is_default ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <span className="text-semantic-textSub">Added on:</span>
                                            <span className="text-semantic-text">{formatDate(address.created_at)}</span>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <span className="text-semantic-textSub">Last updated:</span>
                                            <span className="text-semantic-text">{formatDate(address.updated_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Action Panel */}
                        <div className="lg:col-span-1">
                            <Card>
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-semantic-text mb-4">
                                        Actions
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        <Link href={route('addresses.edit', address.id)}>
                                            <Button className="w-full">
                                                <PencilIcon className="w-4 h-4 mr-2" />
                                                Edit Address
                                            </Button>
                                        </Link>
                                        
                                        {!address.is_default && (
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={handleSetDefault}
                                                className="w-full"
                                            >
                                                <StarIcon className="w-4 h-4 mr-2" />
                                                Set as Default
                                            </Button>
                                        )}
                                        
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={handleDelete}
                                            className="w-full"
                                        >
                                            <TrashIcon className="w-4 h-4 mr-2" />
                                            Delete Address
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            {/* Delivery Tips */}
                            <Card className="mt-6 border-brand-200 bg-brand-50">
                                <div className="p-6">
                                    <div className="flex items-start space-x-3">
                                        <MapPinIcon className="w-5 h-5 text-brand-600 mt-0.5" />
                                        <div>
                                            <h3 className="text-sm font-semibold text-brand-900 mb-2">
                                                Delivery Tips
                                            </h3>
                                            <ul className="text-sm text-brand-700 space-y-1">
                                                <li>• Ensure someone is available to receive the delivery</li>
                                                <li>• Keep your phone accessible for delivery updates</li>
                                                <li>• Provide clear landmarks for easy identification</li>
                                                <li>• Double-check postal code for accurate delivery</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
