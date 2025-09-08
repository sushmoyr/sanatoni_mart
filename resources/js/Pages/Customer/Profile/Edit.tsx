import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User, PageProps } from '@/types';
import { Card, Button, Input, Badge } from '@/Components/ui';
import { 
    UserIcon, 
    PhotoIcon, 
    XMarkIcon, 
    EyeIcon, 
    EyeSlashIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface CustomerProfileEditProps extends PageProps {
    user: User;
}

export default function CustomerProfileEdit({ auth, user }: CustomerProfileEditProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        profile_picture: null as File | null,
        newsletter: user.preferences?.newsletter || false,
        notifications: user.preferences?.notifications || false,
        language: user.preferences?.language || 'en',
        _method: 'PUT'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('_method', 'PUT');
        
        if (data.profile_picture) {
            formData.append('profile_picture', data.profile_picture);
        }

        
        // Add preferences
        formData.append('newsletter', data.newsletter.toString());
        formData.append('notifications', data.notifications.toString());
        formData.append('language', data.language);        post(route('customer.profile.update'), {
            forceFormData: true,
            onSuccess: () => {
                setPreviewImage(null);
                reset('profile_picture');
            }
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('profile_picture', file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeProfilePicture = () => {
        // Make API call to delete profile picture
        // This would need a separate endpoint
        console.log('Remove profile picture');
    };

    const handleDeleteAccount = () => {
        // This would need proper implementation
        console.log('Delete account with password:', deletePassword);
        setShowDeleteConfirm(false);
        setDeletePassword('');
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Profile" />

            <div className="py-12">
                <div className="container-custom max-w-4xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                            Edit Profile
                        </h1>
                        <p className="text-semantic-textSub">
                            Update your personal information and preferences
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Profile Picture Section */}
                            <div className="lg:col-span-1">
                                <Card>
                                    <div className="p-6 text-center">
                                        <h3 className="text-lg font-semibold text-semantic-text mb-6">
                                            Profile Picture
                                        </h3>

                                        {/* Current/Preview Image */}
                                        <div className="mb-6">
                                            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-brand-100 flex items-center justify-center relative">
                                                {previewImage ? (
                                                    <img
                                                        src={previewImage}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : user.profile_picture ? (
                                                    <img
                                                        src={`/storage/${user.profile_picture}`}
                                                        alt={user.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <UserIcon className="w-16 h-16 text-brand-600" />
                                                )}
                                                
                                                {(previewImage || user.profile_picture) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (previewImage) {
                                                                setPreviewImage(null);
                                                                setData('profile_picture', null);
                                                            } else {
                                                                removeProfilePicture();
                                                            }
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-danger-600 text-white rounded-full p-1 hover:bg-danger-700 transition-colors"
                                                    >
                                                        <XMarkIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Upload Button */}
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="profile_picture"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <Button type="button" variant="secondary" className="w-full">
                                                <PhotoIcon className="w-4 h-4 mr-2" />
                                                {user.profile_picture ? 'Change Picture' : 'Upload Picture'}
                                            </Button>
                                        </div>

                                        {errors.profile_picture && (
                                            <p className="mt-2 text-sm text-danger-600">{errors.profile_picture}</p>
                                        )}

                                        <p className="mt-3 text-xs text-semantic-textSub">
                                            JPG, PNG or GIF. Max size 2MB.
                                        </p>
                                    </div>
                                </Card>
                            </div>

                            {/* Profile Information */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Personal Information */}
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-semantic-text mb-6">
                                            Personal Information
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-semantic-text mb-2">
                                                    Full Name *
                                                </label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    error={errors.name}
                                                    required
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-semantic-text mb-2">
                                                    Phone Number
                                                </label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    error={errors.phone}
                                                    placeholder="+880 1XXX XXXXXX"
                                                    className="w-full"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label htmlFor="email" className="block text-sm font-medium text-semantic-text mb-2">
                                                    Email Address *
                                                </label>
                                                <div className="relative">
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={data.email}
                                                        onChange={(e) => setData('email', e.target.value)}
                                                        error={errors.email}
                                                        required
                                                        className="w-full pr-10"
                                                    />
                                                    {user.email_verified_at && (
                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                            <ShieldCheckIcon className="w-5 h-5 text-success-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                {user.email_verified_at ? (
                                                    <p className="mt-1 text-sm text-success-600">Email verified</p>
                                                ) : (
                                                    <p className="mt-1 text-sm text-warning-600">Email not verified</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Account Preferences */}
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-semantic-text mb-6">
                                            Preferences
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-semantic-surface rounded-lg">
                                                <div>
                                                    <h4 className="text-sm font-medium text-semantic-text">Newsletter Subscription</h4>
                                                    <p className="text-sm text-semantic-textSub">Receive updates about new products and offers</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.newsletter}
                                                        onChange={(e) => setData('newsletter', e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-semantic-surface rounded-lg">
                                                <div>
                                                    <h4 className="text-sm font-medium text-semantic-text">Order Notifications</h4>
                                                    <p className="text-sm text-semantic-textSub">Get notified about order status updates</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.notifications}
                                                        onChange={(e) => setData('notifications', e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-semantic-surface rounded-lg">
                                                <div>
                                                    <h4 className="text-sm font-medium text-semantic-text">Language Preference</h4>
                                                    <p className="text-sm text-semantic-textSub">Choose your preferred language</p>
                                                </div>
                                                <select
                                                    value={data.language}
                                                    onChange={(e) => setData('language', e.target.value)}
                                                    className="px-3 py-2 border border-semantic-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                                >
                                                    <option value="en">English</option>
                                                    <option value="bn">বাংলা</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                                    <div className="flex gap-4">
                                        <Button 
                                            type="submit" 
                                            disabled={processing}
                                            className="min-w-[120px]"
                                        >
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                        
                                        <Button 
                                            type="button" 
                                            variant="secondary"
                                            onClick={() => window.history.back()}
                                        >
                                            Cancel
                                        </Button>
                                    </div>

                                    {/* Delete Account */}
                                    <Button 
                                        type="button" 
                                        variant="destructive"
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="sm:w-auto w-full"
                                    >
                                        <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                                        Delete Account
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Delete Account Confirmation Modal */}
                    {showDeleteConfirm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <Card className="w-full max-w-md">
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <ExclamationTriangleIcon className="w-6 h-6 text-danger-600 mr-3" />
                                        <h3 className="text-lg font-semibold text-semantic-text">Delete Account</h3>
                                    </div>
                                    
                                    <p className="text-sm text-semantic-textSub mb-4">
                                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                    </p>
                                    
                                    <div className="mb-4">
                                        <label htmlFor="delete-password" className="block text-sm font-medium text-semantic-text mb-2">
                                            Confirm with your password:
                                        </label>
                                        <Input
                                            id="delete-password"
                                            type="password"
                                            value={deletePassword}
                                            onChange={(e) => setDeletePassword(e.target.value)}
                                            placeholder="Enter your password"
                                            className="w-full"
                                        />
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <Button 
                                            type="button"
                                            variant="destructive"
                                            onClick={handleDeleteAccount}
                                            disabled={!deletePassword}
                                            className="flex-1"
                                        >
                                            Delete Account
                                        </Button>
                                        
                                        <Button 
                                            type="button"
                                            variant="secondary"
                                            onClick={() => {
                                                setShowDeleteConfirm(false);
                                                setDeletePassword('');
                                            }}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
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
