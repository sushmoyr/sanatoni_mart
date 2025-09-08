import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { useForm } from '@inertiajs/react';

interface NewsletterSignupProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'inline' | 'popup' | 'sidebar' | 'footer';
    showDiscount?: boolean;
    discountPercent?: number;
    className?: string;
}

interface NewsletterFormData {
    email: string;
}

export default function NewsletterSignup({ 
    size = 'md', 
    variant = 'inline',
    showDiscount = true,
    discountPercent = 10,
    className = '' 
}: NewsletterSignupProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showFullForm, setShowFullForm] = useState(variant !== 'inline');

    const { data, setData, post, processing, errors, reset } = useForm<NewsletterFormData>({
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        post(route('newsletter.subscribe'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitted(true);
                reset();
            },
        });
    };

    const sizeClasses = {
        sm: 'text-xs p-2',
        md: 'text-sm p-3',
        lg: 'text-base p-4',
        xl: 'text-lg p-6'
    };

    const containerClasses = {
        inline: 'bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200',
        popup: 'bg-white shadow-2xl border border-orange-300',
        sidebar: 'bg-orange-100 border-l-4 border-orange-500',
        footer: 'bg-orange-800 text-white'
    };

    if (isSubmitted) {
        return (
            <Card className={`${containerClasses[variant]} ${sizeClasses[size]} ${className}`}>
                <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className={`font-serif font-semibold ${variant === 'footer' ? 'text-white' : 'text-orange-800'}`}>
                        🙏 Welcome to Our Sacred Community!
                    </h3>
                    <p className={`text-sm ${variant === 'footer' ? 'text-orange-100' : 'text-orange-700'}`}>
                        Your subscription has been confirmed. Check your email for a special welcome offer!
                    </p>
                    {showDiscount && (
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variant === 'footer' ? 'bg-orange-700 text-orange-100' : 'bg-orange-200 text-orange-800'}`}>
                            🎁 {discountPercent}% OFF your first order!
                        </div>
                    )}
                </div>
            </Card>
        );
    }

    // Compact inline version
    if (variant === 'inline' && !showFullForm) {
        return (
            <div className={`flex items-center space-x-3 ${className}`}>
                <div className="flex-1">
                    <Input
                        type="email"
                        placeholder="Enter email for sacred updates"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="border-orange-300 focus:border-orange-500"
                        size="sm"
                    />
                </div>
                <Button
                    onClick={data.email.trim() ? handleSubmit : () => setShowFullForm(true)}
                    disabled={processing}
                    variant="primary"
                    size="sm"
                    className="whitespace-nowrap"
                >
                    {processing ? '...' : showDiscount ? `Get ${discountPercent}% OFF` : 'Subscribe'}
                </Button>
            </div>
        );
    }

    return (
        <Card className={`${containerClasses[variant]} ${sizeClasses[size]} ${className}`}>
            <div className="space-y-4">
                <div className="text-center">
                    <div className={`w-16 h-16 ${variant === 'footer' ? 'bg-orange-700' : 'bg-orange-100'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <svg className={`w-8 h-8 ${variant === 'footer' ? 'text-orange-200' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    
                    <h3 className={`text-xl font-serif font-semibold mb-2 ${variant === 'footer' ? 'text-white' : 'text-orange-800'}`}>
                        🕉️ Join Our Sacred Community
                    </h3>
                    
                    <p className={`${variant === 'footer' ? 'text-orange-100' : 'text-orange-700'} mb-4`}>
                        Receive spiritual insights, exclusive offers, and be the first to know about our sacred collections.
                    </p>

                    {showDiscount && (
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4 ${variant === 'footer' ? 'bg-orange-700 text-orange-100' : 'bg-orange-200 text-orange-800'}`}>
                            ✨ Get {discountPercent}% OFF your first order when you subscribe!
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <Input
                            type="email"
                            placeholder="Enter your email address"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={`w-full ${variant === 'footer' ? 'bg-orange-700 border-orange-600 text-white placeholder-orange-300' : 'border-orange-300 focus:border-orange-500'}`}
                            required
                        />
                        {errors.email && (
                            <p className={`mt-1 text-xs ${variant === 'footer' ? 'text-orange-300' : 'text-red-600'}`}>
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={processing || !data.email.trim()}
                        variant={variant === 'footer' ? 'secondary' : 'primary'}
                        className="w-full sacred-glow"
                    >
                        {processing ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Subscribing...
                            </div>
                        ) : (
                            `Subscribe & ${showDiscount ? `Save ${discountPercent}%` : 'Stay Connected'}`
                        )}
                    </Button>
                </form>

                <div className="text-center">
                    <p className={`text-xs ${variant === 'footer' ? 'text-orange-300' : 'text-orange-600'}`}>
                        By subscribing, you agree to receive marketing emails. You can unsubscribe at any time.
                    </p>
                    <Link
                        href={route('privacy-policy')}
                        className={`text-xs underline ${variant === 'footer' ? 'text-orange-200 hover:text-white' : 'text-orange-500 hover:text-orange-700'}`}
                    >
                        Privacy Policy
                    </Link>
                </div>

                {variant === 'popup' && (
                    <div className="flex justify-center space-x-3 pt-2 border-t border-orange-200">
                        <div className="flex items-center text-xs text-orange-600">
                            <span>🔒 Secure & Sacred</span>
                        </div>
                        <div className="flex items-center text-xs text-orange-600">
                            <span>📧 No Spam Promise</span>
                        </div>
                        <div className="flex items-center text-xs text-orange-600">
                            <span>🎁 Exclusive Offers</span>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
