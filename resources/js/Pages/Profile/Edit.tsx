import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { Card } from '@/Components/ui';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-serif font-semibold leading-tight text-semantic-text">
                    Profile Settings
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Header */}
                        <div className="text-center">
                            <h1 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                                Account Settings
                            </h1>
                            <p className="text-semantic-textSub">
                                Manage your personal information and preferences
                            </p>
                        </div>

                        {/* Profile Information */}
                        <Card className="p-8 devotional-border">
                            <div className="mb-6">
                                <h3 className="text-lg font-serif font-semibold text-semantic-text mb-2">
                                    Profile Information
                                </h3>
                                <p className="text-sm text-semantic-textSub">
                                    Update your account's profile information and email address.
                                </p>
                            </div>
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </Card>

                        {/* Password Update */}
                        <Card className="p-8 devotional-border">
                            <div className="mb-6">
                                <h3 className="text-lg font-serif font-semibold text-semantic-text mb-2">
                                    Update Password
                                </h3>
                                <p className="text-sm text-semantic-textSub">
                                    Ensure your account is using a long, random password to stay secure.
                                </p>
                            </div>
                            <UpdatePasswordForm className="max-w-xl" />
                        </Card>

                        {/* Delete Account */}
                        <Card className="p-8 border-danger-200 bg-danger-25">
                            <div className="mb-6">
                                <h3 className="text-lg font-serif font-semibold text-danger-900 mb-2">
                                    Delete Account
                                </h3>
                                <p className="text-sm text-danger-700">
                                    Once your account is deleted, all of its resources and data will be permanently deleted.
                                    Before deleting your account, please download any data or information that you wish to retain.
                                </p>
                            </div>
                            <DeleteUserForm className="max-w-xl" />
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
