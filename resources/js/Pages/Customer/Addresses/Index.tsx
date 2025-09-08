import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Card, Button, Badge } from '@/Components/ui';
import { 
    PlusIcon,
    MapPinIcon,
    PencilIcon,
    TrashIcon,
    StarIcon,
    HomeIcon,
    BuildingOfficeIcon,
    EllipsisHorizontalIcon
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

interface AddressesIndexProps extends PageProps {
    addresses: Address[];
}

export default function AddressesIndex({ auth, addresses }: AddressesIndexProps) {
    const handleSetDefault = (addressId: number) => {
        router.put(route('addresses.set-default', addressId), {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Optionally show success message
            }
        });
    };

    const handleDelete = (addressId: number) => {
        if (confirm('Are you sure you want to delete this address?')) {
            router.delete(route('addresses.destroy', addressId), {
                preserveScroll: true,
                onSuccess: () => {
                    // Optionally show success message
                }
            });
        }
    };

    const getAddressIcon = (type: string) => {
        switch (type) {
            case 'home':
                return <HomeIcon className="w-5 h-5" />;
            case 'work':
                return <BuildingOfficeIcon className="w-5 h-5" />;
            default:
                return <MapPinIcon className="w-5 h-5" />;
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

    return (
        <AuthenticatedLayout>
            <Head title="My Addresses" />

            <div className="py-12">
                <div className="container-custom max-w-6xl">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                                My Addresses
                            </h1>
                            <p className="text-semantic-textSub">
                                Manage your delivery addresses for faster checkout
                            </p>
                        </div>
                        
                        <Link href={route('addresses.create')}>
                            <Button className="mt-4 sm:mt-0">
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Add New Address
                            </Button>
                        </Link>
                    </div>

                    {addresses.length === 0 ? (
                        /* Empty State */
                        <Card>
                            <div className="p-12 text-center">
                                <MapPinIcon className="w-16 h-16 text-semantic-textSub mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-semantic-text mb-2">
                                    No addresses found
                                </h3>
                                <p className="text-semantic-textSub mb-6">
                                    Add your first address to make checkout faster and easier.
                                </p>
                                <Link href={route('addresses.create')}>
                                    <Button>
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Add Your First Address
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ) : (
                        /* Addresses Grid */
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {addresses.map((address) => (
                                <Card key={address.id} className="relative group">
                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="text-brand-600">
                                                    {getAddressIcon(address.type)}
                                                </div>
                                                <div>
                                                    {getAddressTypeBadge(address.type)}
                                                    {address.name && (
                                                        <p className="text-sm font-medium text-semantic-text mt-1">
                                                            {address.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {address.is_default && (
                                                <div className="flex items-center text-brand-600">
                                                    <StarIconSolid className="w-4 h-4 mr-1" />
                                                    <span className="text-xs font-medium">Default</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Address */}
                                        <div className="text-sm text-semantic-textSub space-y-1 mb-6">
                                            <p>{address.address_line_1}</p>
                                            {address.address_line_2 && (
                                                <p>{address.address_line_2}</p>
                                            )}
                                            <p>
                                                {address.city}, {address.state} {address.postal_code}
                                            </p>
                                            <p>{address.country}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex space-x-2">
                                                {!address.is_default && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleSetDefault(address.id)}
                                                        className="text-brand-600 hover:text-brand-700"
                                                    >
                                                        <StarIcon className="w-4 h-4 mr-1" />
                                                        Set Default
                                                    </Button>
                                                )}
                                            </div>
                                            
                                            <div className="flex space-x-1">
                                                <Link href={route('addresses.edit', address.id)}>
                                                    <Button variant="ghost" size="sm">
                                                        <PencilIcon className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(address.id)}
                                                    className="text-danger-600 hover:text-danger-700"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover Actions Overlay */}
                                    <div className="absolute inset-0 bg-white bg-opacity-95 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 rounded-lg">
                                        <Link href={route('addresses.show', address.id)}>
                                            <Button variant="secondary" size="sm">
                                                View Details
                                            </Button>
                                        </Link>
                                        
                                        <Link href={route('addresses.edit', address.id)}>
                                            <Button size="sm">
                                                <PencilIcon className="w-4 h-4 mr-2" />
                                                Edit
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Additional Info */}
                    {addresses.length > 0 && (
                        <div className="mt-8">
                            <Card className="border-brand-200 bg-brand-50">
                                <div className="p-6">
                                    <div className="flex items-start space-x-3">
                                        <MapPinIcon className="w-5 h-5 text-brand-600 mt-0.5" />
                                        <div>
                                            <h3 className="text-sm font-semibold text-brand-900 mb-1">
                                                Address Management Tips
                                            </h3>
                                            <ul className="text-sm text-brand-700 space-y-1">
                                                <li>• Set your most frequently used address as default</li>
                                                <li>• You can have multiple addresses for different purposes</li>
                                                <li>• Default address will be selected automatically during checkout</li>
                                                <li>• Make sure your addresses are complete and accurate for smooth delivery</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
