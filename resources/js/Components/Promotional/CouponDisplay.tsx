import React, { useState } from 'react';
import { Button } from '@/Components/ui/Button';
import { Card } from '@/Components/ui/Card';
import { useForm } from '@inertiajs/react';

interface Coupon {
    id: number;
    code: string;
    type: 'percentage' | 'fixed_amount';
    value: number;
    description?: string;
    minimum_order_amount?: number;
    maximum_discount_amount?: number;
    valid_until?: string;
    usage_limit?: number;
    used_count?: number;
    is_active: boolean;
}

interface CouponDisplayProps {
    coupon?: Coupon;
    coupons?: Coupon[];
    variant?: 'card' | 'banner' | 'inline' | 'modal';
    showApplyForm?: boolean;
    onApply?: (code: string) => void;
    className?: string;
}

interface CouponFormData {
    coupon_code: string;
}

export default function CouponDisplay({ 
    coupon,
    coupons = [],
    variant = 'card',
    showApplyForm = false,
    onApply,
    className = '' 
}: CouponDisplayProps) {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(showApplyForm);

    const { data, setData, post, processing, errors, reset } = useForm<CouponFormData>({
        coupon_code: '',
    });

    const displayCoupons = coupon ? [coupon] : coupons.filter(c => c.is_active);

    const copyToClipboard = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    const handleApplyCoupon = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (onApply) {
            onApply(data.coupon_code);
        } else {
            post(route('cart.apply-coupon'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setShowForm(false);
                },
            });
        }
    };

    const formatDiscount = (coupon: Coupon) => {
        if (coupon.type === 'percentage') {
            return `${coupon.value}% OFF`;
        }
        return `₹${coupon.value} OFF`;
    };

    const formatExpiry = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    };

    const isExpiringSoon = (dateString: string) => {
        const expiryDate = new Date(dateString);
        const today = new Date();
        const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
        return expiryDate <= threeDaysFromNow;
    };

    if (displayCoupons.length === 0 && !showApplyForm) {
        return null;
    }

    // Apply form component
    const ApplyForm = () => (
        <form onSubmit={handleApplyCoupon} className="flex space-x-2">
            <div className="flex-1">
                <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={data.coupon_code}
                    onChange={(e) => setData('coupon_code', e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                {errors.coupon_code && (
                    <p className="mt-1 text-xs text-red-600">{errors.coupon_code}</p>
                )}
            </div>
            <Button
                type="submit"
                disabled={processing || !data.coupon_code.trim()}
                variant="primary"
                size="sm"
            >
                {processing ? 'Applying...' : 'Apply'}
            </Button>
        </form>
    );

    // Single coupon card component
    const CouponCard = ({ coupon }: { coupon: Coupon }) => (
        <Card className="relative overflow-hidden border-dashed border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-yellow-50">
            {/* Decorative perforated edge */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-white">
                <div className="flex flex-col justify-center h-full space-y-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-orange-200 rounded-full mx-auto" />
                    ))}
                </div>
            </div>

            <div className="pl-8 pr-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-lg font-bold">
                                {formatDiscount(coupon)}
                            </div>
                            <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                                CODE: {coupon.code}
                            </div>
                        </div>

                        {coupon.description && (
                            <p className="text-sm text-gray-700 mb-2">{coupon.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                            {coupon.minimum_order_amount && (
                                <span className="bg-gray-100 px-2 py-1 rounded">
                                    Min. order: ₹{coupon.minimum_order_amount}
                                </span>
                            )}
                            {coupon.maximum_discount_amount && coupon.type === 'percentage' && (
                                <span className="bg-gray-100 px-2 py-1 rounded">
                                    Max. discount: ₹{coupon.maximum_discount_amount}
                                </span>
                            )}
                            {coupon.valid_until && (
                                <span className={`px-2 py-1 rounded ${isExpiringSoon(coupon.valid_until) ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>
                                    Valid till: {formatExpiry(coupon.valid_until)}
                                </span>
                            )}
                        </div>

                        {coupon.usage_limit && coupon.used_count !== undefined && (
                            <div className="mt-2">
                                <div className="text-xs text-gray-600 mb-1">
                                    Used {coupon.used_count} of {coupon.usage_limit} times
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                    <div 
                                        className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                                        style={{ width: `${(coupon.used_count / coupon.usage_limit) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="ml-4 flex flex-col space-y-2">
                        <Button
                            onClick={() => copyToClipboard(coupon.code)}
                            variant="secondary"
                            size="sm"
                            className="whitespace-nowrap"
                        >
                            {copiedCode === coupon.code ? (
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Copied!
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Copy
                                </div>
                            )}
                        </Button>

                        {onApply && (
                            <Button
                                onClick={() => onApply(coupon.code)}
                                variant="primary"
                                size="sm"
                                className="whitespace-nowrap"
                            >
                                Apply Now
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Sacred decoration */}
            <div className="absolute top-2 right-2 text-orange-300 opacity-50">
                🕉️
            </div>
        </Card>
    );

    if (variant === 'banner') {
        return (
            <div className={`bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-lg ${className}`}>
                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start space-x-2 mb-1">
                            <span className="bg-yellow-400 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                                🎫 COUPON AVAILABLE
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">
                            Save up to {displayCoupons.length > 0 && formatDiscount(displayCoupons[0])}!
                        </h3>
                        <p className="text-sm text-green-100">
                            Use code: <span className="font-mono font-bold">{displayCoupons[0]?.code}</span>
                        </p>
                    </div>

                    <div className="flex space-x-3">
                        {displayCoupons[0] && (
                            <Button
                                onClick={() => copyToClipboard(displayCoupons[0].code)}
                                variant="secondary"
                                size="sm"
                            >
                                {copiedCode === displayCoupons[0].code ? 'Copied!' : 'Copy Code'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'inline') {
        return (
            <div className={`${className}`}>
                {showApplyForm && (
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Have a coupon code?</label>
                            {!showForm && (
                                <button
                                    type="button"
                                    onClick={() => setShowForm(true)}
                                    className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                                >
                                    Add coupon
                                </button>
                            )}
                        </div>
                        {showForm && <ApplyForm />}
                    </div>
                )}

                {displayCoupons.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Available Coupons:</h4>
                        {displayCoupons.slice(0, 3).map((coupon) => (
                            <div key={coupon.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                                <div>
                                    <div className="font-medium text-orange-800">{formatDiscount(coupon)}</div>
                                    <div className="text-xs text-orange-600">Code: {coupon.code}</div>
                                </div>
                                <Button
                                    onClick={() => copyToClipboard(coupon.code)}
                                    variant="secondary"
                                    size="sm"
                                >
                                    {copiedCode === coupon.code ? 'Copied!' : 'Copy'}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Default card variant
    return (
        <div className={`space-y-4 ${className}`}>
            {showApplyForm && (
                <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-3">Apply Coupon Code</h3>
                    <ApplyForm />
                </Card>
            )}

            {displayCoupons.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        🎁 Available Coupons ({displayCoupons.length})
                    </h3>
                    {displayCoupons.map((coupon) => (
                        <CouponCard key={coupon.id} coupon={coupon} />
                    ))}
                </div>
            )}
        </div>
    );
}
