import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import BrandedStoreLayout from '@/Layouts/BrandedStoreLayout';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { PageProps } from '@/types';

interface UnsubscribePageProps extends PageProps {
    email?: string;
    token?: string;
    message?: string;
    error?: string;
}

interface UnsubscribeData {
    email: string;
    reason?: string;
    feedback?: string;
}

export default function Unsubscribe({ email = '', token = '', message = '', error = '' }: UnsubscribePageProps) {
    const [isUnsubscribed, setIsUnsubscribed] = useState(!!message);
    const [showFeedback, setShowFeedback] = useState(false);

    const { data, setData, post, processing, errors } = useForm<UnsubscribeData>({
        email: email,
        reason: '',
        feedback: '',
    });

    const handleUnsubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (token) {
            post(route('newsletter.unsubscribe'), {
                preserveScroll: true,
                only: ['message', 'error'],
                onSuccess: () => {
                    setIsUnsubscribed(true);
                },
            });
        } else {
            post(route('newsletter.unsubscribe'), {
                preserveScroll: true,
                only: ['message', 'error'],
                onSuccess: () => {
                    setIsUnsubscribed(true);
                },
            });
        }
    };

    const reasons = [
        'Too many emails',
        'Not interested anymore',
        'Content not relevant',
        'Found what I was looking for',
        'Moving to a different email',
        'Other',
    ];

    if (isUnsubscribed || message) {
        return (
            <BrandedStoreLayout>
                <Head title="Newsletter Unsubscription Confirmed" />
                
                <div className="sacred-bg min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full">
                        <Card className="p-8 text-center bg-orange-50 border-orange-200">
                            <div className="space-y-6">
                                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                                    <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                
                                <div>
                                    <h1 className="text-2xl font-serif font-semibold text-orange-800 mb-3">
                                        🙏 Unsubscribed Successfully
                                    </h1>
                                    <p className="text-orange-700 mb-4">
                                        {message || "You have been successfully unsubscribed from our newsletter. We respect your decision and wish you well on your spiritual journey."}
                                    </p>
                                    {email && (
                                        <p className="text-sm text-orange-600 mb-4">
                                            Email: <span className="font-medium">{email}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <p className="text-sm text-orange-700">
                                        You will no longer receive newsletter emails from us. If you change your mind, you can always subscribe again.
                                    </p>
                                    
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Link
                                            href={route('home')}
                                            className="inline-flex items-center justify-center px-4 py-2 bg-brand-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-brand-700 focus:bg-brand-700 active:bg-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition ease-in-out duration-150 sacred-glow"
                                        >
                                            Continue Shopping
                                        </Link>
                                        <Link
                                            href={route('home')}
                                            className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                        >
                                            Back to Homepage
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </BrandedStoreLayout>
        );
    }

    if (error) {
        return (
            <BrandedStoreLayout>
                <Head title="Newsletter Unsubscribe Error" />
                
                <div className="sacred-bg min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full">
                        <Card className="p-8 text-center bg-red-50 border-red-200">
                            <div className="space-y-6">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                
                                <div>
                                    <h1 className="text-2xl font-serif font-semibold text-red-800 mb-3">
                                        Unsubscribe Error
                                    </h1>
                                    <p className="text-red-700 mb-4">
                                        {error}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-sm text-red-600">
                                        If you continue to have issues, please contact our support team for assistance.
                                    </p>
                                    
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Link
                                            href={route('home')}
                                            className="inline-flex items-center justify-center px-4 py-2 bg-brand-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-brand-700 focus:bg-brand-700 active:bg-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            Back to Homepage
                                        </Link>
                                        <a
                                            href="mailto:support@sanatonimart.com"
                                            className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                        >
                                            Contact Support
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </BrandedStoreLayout>
        );
    }

    return (
        <BrandedStoreLayout>
            <Head title="Unsubscribe from Newsletter" />
            
            <div className="sacred-bg min-h-[60vh] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto">
                    <Card className="p-8">
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-serif font-semibold semantic-text mb-2">
                                    Unsubscribe from Newsletter
                                </h1>
                                <p className="semantic-textSub">
                                    We're sorry to see you go. Please confirm your unsubscription below.
                                </p>
                            </div>

                            <form onSubmit={handleUnsubscribe} className="space-y-4">
                                {!token && (
                                    <div>
                                        <Input
                                            type="email"
                                            placeholder="Enter your email address"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>
                                )}

                                {showFeedback && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium semantic-text mb-2">
                                                Why are you unsubscribing? (Optional)
                                            </label>
                                            <select
                                                value={data.reason}
                                                onChange={(e) => setData('reason', e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                            >
                                                <option value="">Select a reason...</option>
                                                {reasons.map((reason) => (
                                                    <option key={reason} value={reason}>
                                                        {reason}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium semantic-text mb-2">
                                                Additional feedback (Optional)
                                            </label>
                                            <textarea
                                                value={data.feedback}
                                                onChange={(e) => setData('feedback', e.target.value)}
                                                placeholder="Help us improve our newsletter..."
                                                rows={3}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col space-y-3">
                                    <Button
                                        type="submit"
                                        disabled={processing || (!token && !data.email.trim())}
                                        variant="primary"
                                        className="w-full"
                                    >
                                        {processing ? (
                                            <div className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Unsubscribing...
                                            </div>
                                        ) : (
                                            'Confirm Unsubscribe'
                                        )}
                                    </Button>

                                    {!showFeedback && (
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => setShowFeedback(true)}
                                            className="w-full"
                                        >
                                            Help Us Improve (Optional Feedback)
                                        </Button>
                                    )}

                                    <Link
                                        href={route('home')}
                                        className="w-full text-center inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition ease-in-out duration-150"
                                    >
                                        Cancel & Keep Subscription
                                    </Link>
                                </div>
                            </form>

                            <div className="text-center pt-4 border-t border-gray-200">
                                <p className="text-xs semantic-textSub">
                                    You can resubscribe at any time by visiting our website and signing up again.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </BrandedStoreLayout>
    );
}
