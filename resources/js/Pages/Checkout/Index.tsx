import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import BrandedStoreLayout from '@/Layouts/BrandedStoreLayout';
import { Button, Card, Input } from '@/Components/ui';
import { PageProps } from '@/types';
import { TruckIcon, ShieldCheckIcon, CreditCardIcon } from '@heroicons/react/24/outline';

interface CartItem {
    id: number;
    product: {
        id: number;
        name: string;
        price: number;
        images: Array<{ image_path: string }>;
    };
    quantity: number;
}

interface CartSummary {
    itemCount: number;
    uniqueItems: number;
    subtotal: number;
}

interface ShippingZone {
    id: number;
    name: string;
    shipping_cost: number;
    delivery_time_range: string;
}

interface CustomerAddress {
    id: number;
    name: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    district?: string;
    division?: string;
    postal_code?: string;
    is_default: boolean;
}

interface Props extends PageProps {
    cartItems: CartItem[];
    cartSummary: CartSummary;
    shippingZones: ShippingZone[];
    customerAddresses: CustomerAddress[];
}

export default function Checkout({ auth, cartItems, cartSummary, shippingZones, customerAddresses }: Props) {
    const [selectedAddress, setSelectedAddress] = useState<CustomerAddress | null>(
        customerAddresses.find(addr => addr.is_default) || null
    );
    const [useNewAddress, setUseNewAddress] = useState(!selectedAddress);
    const [shippingCost, setShippingCost] = useState<number>(0);
    const [deliveryTime, setDeliveryTime] = useState<string>('');
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        customer_name: auth.user?.name || '',
        customer_email: auth.user?.email || '',
        customer_phone: '',
        shipping_address: {
            name: '',
            phone: '',
            address_line_1: '',
            address_line_2: '',
            city: '',
            district: '',
            division: '',
            postal_code: '',
        },
        billing_same_as_shipping: true,
        billing_address: {
            name: '',
            phone: '',
            address_line_1: '',
            address_line_2: '',
            city: '',
            district: '',
            division: '',
            postal_code: '',
        },
        notes: '',
    });

    // Calculate shipping when address changes
    useEffect(() => {
        const address = useNewAddress ? data.shipping_address : selectedAddress;
        if (address?.city) {
            calculateShipping(address);
        }
    }, [useNewAddress, selectedAddress, data.shipping_address.city]);

    const calculateShipping = async (address: any) => {
        setIsCalculatingShipping(true);
        try {
            const response = await fetch(route('checkout.calculate-shipping'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    city: address.city,
                    district: address.district,
                    division: address.division,
                    postal_code: address.postal_code,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setShippingCost(Number(result.shippingCost) || 0);
                setDeliveryTime(result.deliveryTimeRange || '');
            }
        } catch (error) {
            console.error('Error calculating shipping:', error);
        } finally {
            setIsCalculatingShipping(false);
        }
    };

    const handleAddressSelect = (address: CustomerAddress) => {
        setSelectedAddress(address);
        setUseNewAddress(false);
        setData('shipping_address', {
            name: address.name,
            phone: address.phone,
            address_line_1: address.address_line_1,
            address_line_2: address.address_line_2 || '',
            city: address.city,
            district: address.district || '',
            division: address.division || '',
            postal_code: address.postal_code || '',
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data being submitted:', data);
        post(route('checkout.store'));
    };

    return (
        <BrandedStoreLayout>
            <Head title="Checkout" />
            
            <div className="sacred-bg min-h-screen py-8">
                <div className="container-custom">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                            Checkout
                        </h1>
                        <p className="text-semantic-textSub">
                            Complete your sacred purchase
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Checkout Form */}
                        <div className="space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Customer Information */}
                                <Card className="p-6 devotional-border">
                                    <h3 className="text-xl font-serif font-semibold text-semantic-text mb-4">
                                        Customer Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-semantic-text mb-1">
                                                Full Name
                                            </label>
                                            <Input
                                                name="customer_name"
                                                value={data.customer_name}
                                                onChange={(e) => setData('customer_name', e.target.value)}
                                                required
                                                className="w-full"
                                            />
                                            {errors.customer_name && (
                                                <p className="mt-1 text-sm text-danger-600">{errors.customer_name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-semantic-text mb-1">
                                                Email
                                            </label>
                                            <Input
                                                type="email"
                                                name="customer_email"
                                                value={data.customer_email}
                                                onChange={(e) => setData('customer_email', e.target.value)}
                                                required
                                                className="w-full"
                                            />
                                            {errors.customer_email && (
                                                <p className="mt-1 text-sm text-danger-600">{errors.customer_email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-semantic-text mb-1">
                                                Phone Number
                                            </label>
                                            <Input
                                                type="tel"
                                                name="customer_phone"
                                                value={data.customer_phone}
                                                onChange={(e) => setData('customer_phone', e.target.value)}
                                                required
                                                className="w-full"
                                            />
                                            {errors.customer_phone && (
                                                <p className="mt-1 text-sm text-danger-600">{errors.customer_phone}</p>
                                            )}
                                        </div>
                                    </div>
                                </Card>

                                {/* Shipping Address */}
                                <Card className="p-6 devotional-border">
                                    <h3 className="text-xl font-serif font-semibold text-semantic-text mb-4">
                                        Shipping Address
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-semantic-text mb-1">
                                                    Full Name
                                                </label>
                                                <Input
                                                    name="shipping_name"
                                                    value={data.shipping_address.name}
                                                    onChange={(e) => setData('shipping_address', {
                                                        ...data.shipping_address,
                                                        name: e.target.value
                                                    })}
                                                    required
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-semantic-text mb-1">
                                                    Phone Number
                                                </label>
                                                <Input
                                                    type="tel"
                                                    name="shipping_phone"
                                                    value={data.shipping_address.phone}
                                                    onChange={(e) => setData('shipping_address', {
                                                        ...data.shipping_address,
                                                        phone: e.target.value
                                                    })}
                                                    required
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-semantic-text mb-1">
                                                Address Line 1
                                            </label>
                                            <Input
                                                name="address_line_1"
                                                value={data.shipping_address.address_line_1}
                                                onChange={(e) => setData('shipping_address', {
                                                    ...data.shipping_address,
                                                    address_line_1: e.target.value
                                                })}
                                                required
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-semantic-text mb-1">
                                                Address Line 2 (Optional)
                                            </label>
                                            <Input
                                                name="address_line_2"
                                                value={data.shipping_address.address_line_2}
                                                onChange={(e) => setData('shipping_address', {
                                                    ...data.shipping_address,
                                                    address_line_2: e.target.value
                                                })}
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-semantic-text mb-1">
                                                    City
                                                </label>
                                                <Input
                                                    name="city"
                                                    value={data.shipping_address.city}
                                                    onChange={(e) => setData('shipping_address', {
                                                        ...data.shipping_address,
                                                        city: e.target.value
                                                    })}
                                                    required
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-semantic-text mb-1">
                                                    District
                                                </label>
                                                <Input
                                                    name="district"
                                                    value={data.shipping_address.district}
                                                    onChange={(e) => setData('shipping_address', {
                                                        ...data.shipping_address,
                                                        district: e.target.value
                                                    })}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-semantic-text mb-1">
                                                    Division
                                                </label>
                                                <Input
                                                    name="division"
                                                    value={data.shipping_address.division}
                                                    onChange={(e) => setData('shipping_address', {
                                                        ...data.shipping_address,
                                                        division: e.target.value
                                                    })}
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-semantic-text mb-1">
                                                    Postal Code
                                                </label>
                                                <Input
                                                    name="postal_code"
                                                    value={data.shipping_address.postal_code}
                                                    onChange={(e) => setData('shipping_address', {
                                                        ...data.shipping_address,
                                                        postal_code: e.target.value
                                                    })}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Order Notes */}
                                <Card className="p-6 devotional-border">
                                    <h3 className="text-xl font-serif font-semibold text-semantic-text mb-4">
                                        Order Notes (Optional)
                                    </h3>
                                    <textarea
                                        className="w-full rounded-md border border-semantic-border bg-white px-3 py-2 text-semantic-text placeholder:text-semantic-textSub focus:border-semantic-ring focus:ring-2 focus:ring-semantic-ring"
                                        rows={3}
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Any special instructions for your order..."
                                    />
                                </Card>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sacred-glow"
                                >
                                    {processing ? 'Placing Order...' : 'Place Order'}
                                </Button>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:sticky lg:top-8 h-fit">
                            <Card className="p-6 devotional-border">
                                <h3 className="text-xl font-serif font-semibold text-semantic-text mb-4">
                                    Order Summary
                                </h3>

                                {/* Cart Items */}
                                <div className="space-y-4 mb-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-3">
                                            <img
                                                src={item.product?.images?.[0]?.image_path || '/images/placeholder.jpg'}
                                                alt={item.product?.name}
                                                className="h-16 w-16 object-cover rounded-lg shadow-e1"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-semantic-text text-sm">
                                                    {item.product?.name}
                                                </h4>
                                                <p className="text-semantic-textSub text-sm">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <div className="text-brand-600 font-medium">
                                                ৳{(item.product?.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-semantic-border pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal ({cartSummary.itemCount} items)</span>
                                        <span>৳{cartSummary.subtotal.toFixed(2)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between text-sm">
                                        <span>Shipping</span>
                                        <span>
                                            {isCalculatingShipping ? (
                                                'Calculating...'
                                            ) : (typeof shippingCost === 'number' && shippingCost > 0) ? (
                                                `৳${shippingCost.toFixed(2)}`
                                            ) : (
                                                'Enter address'
                                            )}
                                        </span>
                                    </div>

                                    {deliveryTime && (
                                        <div className="flex justify-between text-sm text-semantic-textSub">
                                            <span>Delivery Time</span>
                                            <span>{deliveryTime}</span>
                                        </div>
                                    )}

                                    <div className="border-t border-semantic-border pt-2">
                                        <div className="flex justify-between font-semibold text-lg">
                                            <span>Total</span>
                                            <span className="text-brand-600">
                                                ৳{(cartSummary.subtotal + (Number(shippingCost) || 0)).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="mt-6 pt-6 border-t border-semantic-border">
                                    <div className="flex items-center space-x-3 p-3 bg-brand-50 rounded-lg">
                                        <CreditCardIcon className="h-5 w-5 text-brand-600" />
                                        <div>
                                            <div className="font-semibold text-semantic-text">Cash on Delivery</div>
                                            <div className="text-sm text-semantic-textSub">
                                                Pay when you receive your order
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Trust Badges */}
                                <div className="mt-6 space-y-2">
                                    <div className="flex items-center space-x-2 text-sm text-semantic-textSub">
                                        <ShieldCheckIcon className="h-4 w-4" />
                                        <span>Secure checkout with Cash on Delivery</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-semantic-textSub">
                                        <TruckIcon className="h-4 w-4" />
                                        <span>Free delivery on orders above ৳1000</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </BrandedStoreLayout>
    );
}

