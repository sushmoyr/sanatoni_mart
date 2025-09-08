import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User, PageProps } from '@/types';
import { Card, Button, Badge } from '@/Components/ui';
import { 
    UserIcon, 
    PencilIcon, 
    EnvelopeIcon, 
    PhoneIcon, 
    CalendarIcon,
    ShieldCheckIcon,
    CogIcon
} from '@heroicons/react/24/outline';

interface CustomerProfileShowProps extends PageProps {
    user: User;
}

export default function CustomerProfileShow({ auth, user }: CustomerProfileShowProps) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="success">Active</Badge>;
            case 'inactive':
                return <Badge variant="secondary">Inactive</Badge>;
            case 'suspended':
                return <Badge variant="danger">Suspended</Badge>;
            default:
                return <Badge variant="default">{status}</Badge>;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="My Profile" />

            <div className="py-12">
                <div className="container-custom max-w-4xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                            My Profile
                        </h1>
                        <p className="text-semantic-textSub">
                            Manage your personal information and account settings
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Picture & Basic Info */}
                        <div className="lg:col-span-1">
                            <Card className="text-center">
                                <div className="p-6">
                                    {/* Profile Picture */}
                                    <div className="mb-6">
                                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-brand-100 flex items-center justify-center">
                                            {user.profile_picture ? (
                                                <img
                                                    src={`/storage/${user.profile_picture}`}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <UserIcon className="w-16 h-16 text-brand-600" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Name & Status */}
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-semantic-text mb-2">
                                            {user.name}
                                        </h2>
                                        <div className="flex justify-center mb-3">
                                            {getStatusBadge(user.status)}
                                        </div>
                                        <p className="text-sm text-semantic-textSub">
                                            Member since {user.email_verified_at ? formatDate(user.email_verified_at) : 'Recently joined'}
                                        </p>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="space-y-3">
                                        <Button asChild className="w-full">
                                            <Link href={route('customer.profile.edit')}>
                                                <PencilIcon className="w-4 h-4 mr-2" />
                                                Edit Profile
                                            </Link>
                                        </Button>
                                        <Button variant="secondary" asChild className="w-full">
                                            <Link href={route('customer.settings')}>
                                                <CogIcon className="w-4 h-4 mr-2" />
                                                Account Settings
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Profile Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Contact Information */}
                            <Card>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-semantic-text">
                                            Contact Information
                                        </h3>
                                        <Button variant="secondary" size="sm" asChild>
                                            <Link href={route('customer.profile.edit')}>
                                                <PencilIcon className="w-4 h-4 mr-1" />
                                                Edit
                                            </Link>
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <EnvelopeIcon className="w-5 h-5 text-semantic-textSub" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-semantic-textSub">Email</p>
                                                <p className="text-semantic-text truncate">{user.email}</p>
                                                {user.email_verified_at && (
                                                    <div className="flex items-center mt-1">
                                                        <ShieldCheckIcon className="w-4 h-4 text-success-600 mr-1" />
                                                        <span className="text-xs text-success-600">Verified</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <PhoneIcon className="w-5 h-5 text-semantic-textSub" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-semantic-textSub">Phone</p>
                                                <p className="text-semantic-text">
                                                    {user.phone || 'Not provided'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Account Information */}
                            <Card>
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-semantic-text mb-6">
                                        Account Information
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <CalendarIcon className="w-5 h-5 text-semantic-textSub" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-semantic-textSub">Member Since</p>
                                                <p className="text-semantic-text">{user.email_verified_at ? formatDate(user.email_verified_at) : 'Recently joined'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <CalendarIcon className="w-5 h-5 text-semantic-textSub" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-semantic-textSub">Email Status</p>
                                                <p className="text-semantic-text">
                                                    {user.email_verified_at ? 'Verified' : 'Pending verification'}
                                                </p>
                                            </div>
                                        </div>

                                        {user.last_login_at && (
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    <CalendarIcon className="w-5 h-5 text-semantic-textSub" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-semantic-textSub">Last Login</p>
                                                    <p className="text-semantic-text">{formatDate(user.last_login_at)}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <UserIcon className="w-5 h-5 text-semantic-textSub" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-semantic-textSub">Account Status</p>
                                                <div className="mt-1">
                                                    {getStatusBadge(user.status)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Preferences */}
                            {user.preferences && Object.keys(user.preferences).length > 0 && (
                                <Card>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-semibold text-semantic-text">
                                                Preferences
                                            </h3>
                                            <Button variant="secondary" size="sm" asChild>
                                                <Link href={route('customer.settings')}>
                                                    <CogIcon className="w-4 h-4 mr-1" />
                                                    Manage
                                                </Link>
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {user.preferences.newsletter !== undefined && (
                                                <div className="flex items-center justify-between p-3 bg-semantic-surface rounded-lg">
                                                    <span className="text-sm font-medium text-semantic-text">Newsletter</span>
                                                    <Badge variant={user.preferences.newsletter ? "success" : "secondary"}>
                                                        {user.preferences.newsletter ? "Subscribed" : "Unsubscribed"}
                                                    </Badge>
                                                </div>
                                            )}

                                            {user.preferences.notifications !== undefined && (
                                                <div className="flex items-center justify-between p-3 bg-semantic-surface rounded-lg">
                                                    <span className="text-sm font-medium text-semantic-text">Notifications</span>
                                                    <Badge variant={user.preferences.notifications ? "success" : "secondary"}>
                                                        {user.preferences.notifications ? "Enabled" : "Disabled"}
                                                    </Badge>
                                                </div>
                                            )}

                                            {user.preferences.language && (
                                                <div className="flex items-center justify-between p-3 bg-semantic-surface rounded-lg">
                                                    <span className="text-sm font-medium text-semantic-text">Language</span>
                                                    <Badge variant="default">
                                                        {user.preferences.language === 'bn' ? 'বাংলা' : 'English'}
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
