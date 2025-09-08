import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';

interface NewsletterSubscriptionProps {
    className?: string;
    showTitle?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

interface SubscriptionData {
    email: string;
    name: string;
}

export default function NewsletterSubscription({ 
    className = '', 
    showTitle = true, 
    size = 'md' 
}: NewsletterSubscriptionProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm<SubscriptionData>({
        email: '',
        name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        post(route('newsletter.subscribe'), {
            onSuccess: () => {
                setIsSubmitted(true);
                reset();
            },
        });
    };

    const sizeClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    const titleSizes = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl',
    };

    const descriptionSizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    if (isSubmitted) {
        return (
            <Card className={`${sizeClasses[size]} ${className} text-center bg-green-50 border-green-200`}>
                <div className="space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h3 className={`${titleSizes[size]} font-serif font-semibold text-green-800 mb-2`}>
                            🙏 Subscription Confirmed!
                        </h3>
                        <p className={`${descriptionSizes[size]} text-green-700 mb-4`}>
                            Thank you for joining our sacred community. Please check your email to confirm your subscription.
                        </p>
                        <p className="text-sm text-green-600">
                            You'll receive spiritual updates, special offers, and divine inspiration in your inbox.
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={() => setIsSubmitted(false)}
                        className="text-green-700 border-green-300 hover:bg-green-100"
                    >
                        Subscribe Another Email
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <Card className={`${sizeClasses[size]} ${className} sacred-bg`}>
            <div className="space-y-6">
                {showTitle && (
                    <div className="text-center">
                        <h3 className={`${titleSizes[size]} font-serif font-semibold semantic-text mb-2`}>
                            🕉️ Join Our Sacred Community
                        </h3>
                        <p className={`${descriptionSizes[size]} semantic-textSub`}>
                            Receive divine inspiration, spiritual updates, and exclusive offers for Hindu religious items directly in your inbox.
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            type="text"
                            placeholder="Your name (optional)"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full"
                        />
                    </div>

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

                    <Button
                        type="submit"
                        disabled={processing || !data.email.trim()}
                        className="w-full sacred-glow"
                    >
                        {processing ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Subscribing...
                            </div>
                        ) : (
                            '📧 Subscribe to Newsletter'
                        )}
                    </Button>

                    <p className="text-xs semantic-textSub text-center">
                        By subscribing, you agree to receive emails from us. You can unsubscribe at any time. 
                        We respect your privacy and spiritual journey.
                    </p>
                </form>
            </div>
        </Card>
    );
}
