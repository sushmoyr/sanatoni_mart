import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button, Input, Card } from '@/Components/ui';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                            Reset Your Password
                        </h2>
                        <p className="text-semantic-textSub">
                            No worries! Enter your email and we'll send you a reset link
                        </p>
                    </div>

                    {status && (
                        <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg text-sm">
                            {status}
                        </div>
                    )}

                    <Card className="p-8 devotional-border">
                        <div className="mb-6 text-center">
                            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <EnvelopeIcon className="h-8 w-8 text-brand-600" />
                            </div>
                            <p className="text-sm text-semantic-textSub">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-semantic-text mb-2">
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    placeholder="Enter your email address"
                                    autoComplete="email"
                                    required
                                    error={errors.email}
                                    leftIcon={<EnvelopeIcon className="h-5 w-5" />}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value)}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={processing}
                            >
                                {processing ? 'Sending...' : 'Send Reset Link'}
                            </Button>

                            <div className="text-center pt-4 border-t border-semantic-border">
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center text-sm text-brand-600 hover:text-brand-700 font-medium"
                                >
                                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </GuestLayout>
    );
}
