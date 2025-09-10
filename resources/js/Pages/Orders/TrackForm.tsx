import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button, Input } from '@/Components/ui';

export default function TrackForm() {
    const { data, setData, post, processing, errors } = useForm({
        order_number: '',
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('orders.track'));
    };

    return (
        <GuestLayout>
            <Head title="Track Your Order" />

            <div className="mb-4">
                <h2 className="text-xl font-semibold text-semantic-text">Track Your Order</h2>
                <p className="mt-1 text-sm text-semantic-textSub">
                    Enter your order number and email address to track your order status.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="order_number" className="block text-sm font-medium text-semantic-text mb-2">
                        Order Number
                    </label>
                    <Input
                        id="order_number"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.order_number}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('order_number', e.target.value)}
                        placeholder="e.g., ORD-2025-123456"
                        required
                        error={errors.order_number}
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-semantic-text mb-2">
                        Email Address
                    </label>
                    <Input
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value)}
                        placeholder="Enter the email used for this order"
                        required
                        error={errors.email}
                    />
                </div>

                <div className="pt-4">
                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? 'Searching...' : 'Track Order'}
                    </Button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-semantic-textSub">
                    Need help? <a href="mailto:support@sanatonimart.com" className="text-primary-600 hover:text-primary-500">Contact Support</a>
                </p>
            </div>
        </GuestLayout>
    );
}
