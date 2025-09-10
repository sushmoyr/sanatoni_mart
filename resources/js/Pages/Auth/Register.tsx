import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button, Input, Card } from '@/Components/ui';
import { EyeIcon, EyeSlashIcon, UserIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="p-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-serif font-bold text-semantic-text mb-2">
                        Join Our Sacred Community
                    </h2>
                    <p className="text-semantic-textSub text-sm">
                        Start your spiritual journey with authentic products
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-semantic-text mb-2">
                            Full Name
                        </label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            placeholder="Enter your full name"
                            autoComplete="name"
                            required
                            error={errors.name}
                            leftIcon={<UserIcon className="h-5 w-5" />}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                        />
                    </div>

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
                            leftIcon={<EnvelopeIcon className="h-5 w-5" />}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-semantic-text mb-2">
                            Password
                        </label>
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            placeholder="Create a strong password"
                            autoComplete="new-password"
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

                    <div>
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-semantic-text mb-2">
                            Confirm Password
                        </label>
                        <Input
                            id="password_confirmation"
                            type={showPasswordConfirmation ? "text" : "password"}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            required
                            error={errors.password_confirmation}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('password_confirmation', e.target.value)}
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                    className="text-semantic-textSub hover:text-semantic-text transition-colors"
                                >
                                    {showPasswordConfirmation ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            }
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-6"
                        size="lg"
                        disabled={processing}
                    >
                        {processing ? 'Creating Account...' : 'Create Account'}
                    </Button>

                    <div className="text-center pt-4 border-t border-semantic-border">
                        <p className="text-sm text-semantic-textSub">
                            Already have an account?{' '}
                            <Link
                                href={route('login')}
                                className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
