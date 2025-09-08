<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - #{{ $order->order_number }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
        }
        .container {
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #C99B3F;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #C99B3F;
            margin-bottom: 10px;
        }
        .order-number {
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 15px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
        }
        .order-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        .order-item:last-child {
            border-bottom: none;
        }
        .item-details {
            flex: 1;
        }
        .item-name {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 5px;
        }
        .item-meta {
            color: #6b7280;
            font-size: 14px;
        }
        .item-total {
            font-weight: 600;
            color: #1f2937;
        }
        .totals {
            background: #f9fafb;
            padding: 20px;
            border-radius: 6px;
            margin-top: 20px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .total-row:last-child {
            margin-bottom: 0;
            font-size: 18px;
            font-weight: bold;
            color: #C99B3F;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
        }
        .address-box {
            background: #f9fafb;
            padding: 15px;
            border-radius: 6px;
            margin-top: 10px;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            background: #fef3c7;
            color: #92400e;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .cta-button {
            display: inline-block;
            padding: 12px 24px;
            background: #C99B3F;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .container {
                padding: 20px;
            }
            .order-item {
                flex-direction: column;
                align-items: flex-start;
            }
            .item-total {
                margin-top: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🕉️ Sanatoni Mart</div>
            <h1 class="order-number">Order Confirmation #{{ $order->order_number }}</h1>
            <p>Thank you for your order, {{ $customerName }}!</p>
            <span class="status-badge">{{ ucfirst($order->status) }}</span>
        </div>

        <div class="section">
            <p>Dear {{ $customerName }},</p>
            <p>We're excited to confirm that we've received your order! Your sacred items are being prepared with care and devotion.</p>
            
            @if($order->estimated_delivery_date)
            <p><strong>Estimated Delivery:</strong> {{ $order->estimated_delivery_date->format('F j, Y') }}</p>
            @endif
        </div>

        <div class="section">
            <h2 class="section-title">Order Details</h2>
            @foreach($order->items as $item)
            <div class="order-item">
                <div class="item-details">
                    <div class="item-name">{{ $item->product_snapshot['name'] ?? $item->product->name }}</div>
                    <div class="item-meta">
                        SKU: {{ $item->product_snapshot['sku'] ?? $item->product->sku }} • 
                        Quantity: {{ $item->quantity }} • 
                        Price: ৳{{ number_format($item->price, 2) }}
                    </div>
                </div>
                <div class="item-total">৳{{ number_format($item->subtotal, 2) }}</div>
            </div>
            @endforeach

            <div class="totals">
                <div class="total-row">
                    <span>Subtotal</span>
                    <span>৳{{ number_format($order->subtotal, 2) }}</span>
                </div>
                <div class="total-row">
                    <span>Shipping</span>
                    <span>৳{{ number_format($order->shipping_cost, 2) }}</span>
                </div>
                <div class="total-row">
                    <span>Total</span>
                    <span>৳{{ number_format($order->total, 2) }}</span>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Shipping Address</h2>
            <div class="address-box">
                <strong>{{ $order->shipping_address['name'] }}</strong><br>
                {{ $order->shipping_address['phone'] }}<br>
                {{ $order->shipping_address['address_line_1'] }}<br>
                @if($order->shipping_address['address_line_2'])
                    {{ $order->shipping_address['address_line_2'] }}<br>
                @endif
                {{ $order->shipping_address['city'] }}
                @if($order->shipping_address['district'])
                    , {{ $order->shipping_address['district'] }}
                @endif
                @if($order->shipping_address['division'])
                    , {{ $order->shipping_address['division'] }}
                @endif
                @if($order->shipping_address['postal_code'])
                    <br>{{ $order->shipping_address['postal_code'] }}
                @endif
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Payment Information</h2>
            <p><strong>Payment Method:</strong> {{ $order->payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment' }}</p>
            <p><strong>Total Amount:</strong> ৳{{ number_format($order->total, 2) }}</p>
            @if($order->payment_method === 'cod')
            <p style="color: #059669; font-weight: 600;">Please keep the exact amount ready for delivery.</p>
            @endif
        </div>

        @if($order->notes)
        <div class="section">
            <h2 class="section-title">Order Notes</h2>
            <div class="address-box">
                {{ $order->notes }}
            </div>
        </div>
        @endif

        <div style="text-align: center;">
            <a href="{{ route('orders.show', $order->id) }}" class="cta-button">
                Track Your Order
            </a>
        </div>

        <div class="footer">
            <p>If you have any questions about your order, please contact us or visit your account dashboard.</p>
            <p>Order Date: {{ $order->created_at->format('F j, Y \a\t g:i A') }}</p>
            <p style="margin-top: 20px;">
                <strong>Sanatoni Mart</strong><br>
                Your trusted source for sacred items and spiritual essentials
            </p>
        </div>
    </div>
</body>
</html>
