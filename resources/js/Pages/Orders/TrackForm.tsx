import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

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
                <h2 className="text-xl font-semibold text-gray-900">Track Your Order</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Enter your order number and email address to track your order status.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="order_number" value="Order Number" />
                    <TextInput
                        id="order_number"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.order_number}
                        onChange={(e) => setData('order_number', e.target.value)}
                        placeholder="e.g., ORD-2025-123456"
                        required
                    />
                    <InputError message={errors.order_number} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email Address" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Enter the email used for this order"
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="pt-4">
                    <PrimaryButton disabled={processing} className="w-full">
                        {processing ? 'Searching...' : 'Track Order'}
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Need help? <a href="mailto:support@sanatonimart.com" className="text-indigo-600 hover:text-indigo-700">Contact Support</a>
                </p>
            </div>
        </GuestLayout>
    );
}
