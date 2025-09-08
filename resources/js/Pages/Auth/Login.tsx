import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button, Input, Card } from '@/Components/ui';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                            Welcome back
                        </h2>
                        <p className="text-semantic-textSub">
                            Sign in to continue your spiritual journey
                        </p>
                    </div>

                    {status && (
                        <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg text-sm">
                            {status}
                        </div>
                    )}

                    <Card className="p-8 devotional-border">
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
                                    placeholder="Enter your email"
                                    autoComplete="username"
                                    required
                                    error={errors.email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-semantic-text mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                        error={errors.password}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('password', e.target.value)}
                                        rightIcon={
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-semantic-textSub hover:text-semantic-text transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeSlashIcon className="h-5 w-5" />
                                                ) : (
                                                    <EyeIcon className="h-5 w-5" />
                                                )}
                                            </button>
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('remember', e.target.checked)}
                                        className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-semantic-border rounded"
                                    />
                                    <span className="ml-2 text-sm text-semantic-textSub">
                                        Remember me
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={processing}
                            >
                                {processing ? 'Signing in...' : 'Sign in'}
                            </Button>

                            <div className="text-center pt-4 border-t border-semantic-border">
                                <p className="text-sm text-semantic-textSub">
                                    Don't have an account?{' '}
                                    <Link
                                        href={route('register')}
                                        className="text-brand-600 hover:text-brand-700 font-medium"
                                    >
                                        Create one here
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </GuestLayout>
    );
}
