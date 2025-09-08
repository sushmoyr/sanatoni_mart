import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';

interface FlashSale {
    id: number;
    title: string;
    description: string;
    discount_percentage: number;
    starts_at: string;
    ends_at: string;
    is_active: boolean;
    products_count?: number;
}

interface FlashSaleBannerProps {
    flashSale?: FlashSale;
    variant?: 'hero' | 'banner' | 'sidebar' | 'popup';
    showCountdown?: boolean;
    className?: string;
}

export default function FlashSaleBanner({ 
    flashSale,
    variant = 'banner',
    showCountdown = true,
    className = '' 
}: FlashSaleBannerProps) {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    useEffect(() => {
        if (!flashSale || !showCountdown) return;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const endTime = new Date(flashSale.ends_at).getTime();
            const difference = endTime - now;

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                };
            }
            return null;
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        setTimeLeft(calculateTimeLeft());
        
        return () => clearInterval(timer);
    }, [flashSale, showCountdown]);

    if (!flashSale || !flashSale.is_active) {
        return null;
    }

    const variantClasses = {
        hero: 'bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500 text-white p-8 rounded-2xl shadow-2xl',
        banner: 'bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-lg shadow-lg',
        sidebar: 'bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg',
        popup: 'bg-white border-2 border-red-500 rounded-xl p-6 shadow-2xl'
    };

    const textClasses = {
        hero: 'text-white',
        banner: 'text-white',
        sidebar: 'text-red-800',
        popup: 'text-red-800'
    };

    const CountdownTimer = () => {
        if (!timeLeft) return null;

        return (
            <div className="flex items-center justify-center space-x-2">
                <div className="text-center">
                    <div className={`text-2xl font-bold ${variant === 'hero' ? 'text-yellow-200' : variant === 'banner' ? 'text-yellow-100' : 'text-red-600'}`}>
                        {timeLeft.days.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs opacity-75">DAYS</div>
                </div>
                <div className="text-xl opacity-75">:</div>
                <div className="text-center">
                    <div className={`text-2xl font-bold ${variant === 'hero' ? 'text-yellow-200' : variant === 'banner' ? 'text-yellow-100' : 'text-red-600'}`}>
                        {timeLeft.hours.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs opacity-75">HRS</div>
                </div>
                <div className="text-xl opacity-75">:</div>
                <div className="text-center">
                    <div className={`text-2xl font-bold ${variant === 'hero' ? 'text-yellow-200' : variant === 'banner' ? 'text-yellow-100' : 'text-red-600'}`}>
                        {timeLeft.minutes.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs opacity-75">MIN</div>
                </div>
                <div className="text-xl opacity-75">:</div>
                <div className="text-center">
                    <div className={`text-2xl font-bold ${variant === 'hero' ? 'text-yellow-200' : variant === 'banner' ? 'text-yellow-100' : 'text-red-600'}`}>
                        {timeLeft.seconds.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs opacity-75">SEC</div>
                </div>
            </div>
        );
    };

    if (variant === 'hero') {
        return (
            <div className={`${variantClasses[variant]} ${className}`}>
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-yellow-400 text-red-800 px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                            🔥 FLASH SALE 🔥
                        </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
                        {flashSale.title}
                    </h1>
                    
                    <p className="text-xl md:text-2xl mb-6 text-yellow-100">
                        {flashSale.description}
                    </p>

                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                        <div className="text-6xl font-bold text-yellow-300 mb-2">
                            {flashSale.discount_percentage}% OFF
                        </div>
                        <div className="text-lg text-yellow-100">
                            Sacred Collection Items
                        </div>
                    </div>

                    {showCountdown && timeLeft && (
                        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 mb-6">
                            <div className="text-lg font-semibold mb-3 text-yellow-200">
                                ⏰ Sale Ends In:
                            </div>
                            <CountdownTimer />
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={route('flash-sales.show', flashSale.id)}
                            className="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-red-800 text-lg font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            🛍️ Shop Flash Sale
                        </Link>
                        <Link
                            href={route('products.index', { sale: 'flash' })}
                            className="inline-flex items-center justify-center px-8 py-4 bg-white/20 hover:bg-white/30 text-white text-lg font-semibold rounded-xl transition-all duration-300 border-2 border-white/30"
                        >
                            View All Deals
                        </Link>
                    </div>

                    {flashSale.products_count && (
                        <div className="mt-4 text-yellow-200">
                            🏷️ {flashSale.products_count} Sacred Items on Sale
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (variant === 'banner') {
        return (
            <div className={`${variantClasses[variant]} ${className}`}>
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                            <span className="bg-yellow-400 text-red-800 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                                🔥 FLASH SALE
                            </span>
                            <span className="text-yellow-200 font-bold text-lg">
                                {flashSale.discount_percentage}% OFF
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">{flashSale.title}</h3>
                        <p className="text-sm text-yellow-100">{flashSale.description}</p>
                    </div>

                    {showCountdown && timeLeft && (
                        <div className="hidden md:block mx-6">
                            <div className="text-xs text-yellow-200 mb-1 text-center">TIME LEFT:</div>
                            <div className="flex space-x-1">
                                <div className="bg-white/20 rounded px-2 py-1 text-center min-w-[40px]">
                                    <div className="text-sm font-bold">{timeLeft.days}</div>
                                    <div className="text-xs">D</div>
                                </div>
                                <div className="bg-white/20 rounded px-2 py-1 text-center min-w-[40px]">
                                    <div className="text-sm font-bold">{timeLeft.hours}</div>
                                    <div className="text-xs">H</div>
                                </div>
                                <div className="bg-white/20 rounded px-2 py-1 text-center min-w-[40px]">
                                    <div className="text-sm font-bold">{timeLeft.minutes}</div>
                                    <div className="text-xs">M</div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex space-x-3">
                        <Link
                            href={route('flash-sales.show', flashSale.id)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-red-800 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300"
                        >
                            Shop Now
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'sidebar') {
        return (
            <div className={`${variantClasses[variant]} ${className}`}>
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            🔥 FLASH
                        </span>
                        <span className="text-red-600 font-bold">
                            {flashSale.discount_percentage}% OFF
                        </span>
                    </div>
                    
                    <h4 className="font-semibold text-red-800">{flashSale.title}</h4>
                    
                    {showCountdown && timeLeft && (
                        <div className="bg-red-100 rounded-lg p-3">
                            <div className="text-xs text-red-600 mb-1">⏰ ENDS IN:</div>
                            <div className="flex justify-between text-sm font-bold text-red-700">
                                <span>{timeLeft.days}d</span>
                                <span>{timeLeft.hours}h</span>
                                <span>{timeLeft.minutes}m</span>
                            </div>
                        </div>
                    )}

                    <Link
                        href={route('flash-sales.show', flashSale.id)}
                        className="block w-full bg-red-500 hover:bg-red-600 text-white text-center py-2 rounded-lg font-semibold text-sm transition-colors duration-300"
                    >
                        Shop Flash Sale
                    </Link>
                </div>
            </div>
        );
    }

    // Popup variant
    return (
        <div className={`${variantClasses[variant]} ${className}`}>
            <div className="text-center space-y-4">
                <div className="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-bounce">
                    🔥 LIMITED TIME FLASH SALE 🔥
                </div>
                
                <h3 className="text-2xl font-serif font-bold text-red-800">
                    {flashSale.title}
                </h3>
                
                <div className="bg-red-100 rounded-xl p-4">
                    <div className="text-3xl font-bold text-red-600 mb-1">
                        {flashSale.discount_percentage}% OFF
                    </div>
                    <div className="text-red-700">{flashSale.description}</div>
                </div>

                {showCountdown && timeLeft && (
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-red-600 mb-2">⏰ Sale Ends In:</div>
                        <CountdownTimer />
                    </div>
                )}

                <div className="flex space-x-3">
                    <Link
                        href={route('flash-sales.show', flashSale.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-300 text-center"
                    >
                        Shop Now
                    </Link>
                    <button
                        type="button"
                        className="px-4 py-3 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                        onClick={() => {
                            // Close popup logic would go here
                            console.log('Close popup');
                        }}
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
}
