<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - {{ $order->order_number }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .invoice-header {
            display: table;
            width: 100%;
            margin-bottom: 30px;
        }
        .company-info {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }
        .invoice-info {
            display: table-cell;
            width: 50%;
            vertical-align: top;
            text-align: right;
        }
        .company-logo {
            font-size: 24px;
            font-weight: bold;
            color: #C99B3F;
            margin-bottom: 10px;
        }
        .company-details {
            color: #666;
            line-height: 1.6;
        }
        .invoice-title {
            font-size: 32px;
            font-weight: bold;
            color: #C99B3F;
            margin-bottom: 10px;
        }
        .invoice-meta {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 30px;
        }
        .invoice-meta-row {
            display: table;
            width: 100%;
            margin-bottom: 8px;
        }
        .invoice-meta-row:last-child {
            margin-bottom: 0;
        }
        .invoice-meta-label {
            display: table-cell;
            width: 150px;
            font-weight: bold;
            color: #555;
        }
        .invoice-meta-value {
            display: table-cell;
            color: #333;
        }
        .billing-shipping {
            display: table;
            width: 100%;
            margin-bottom: 30px;
        }
        .billing-info, .shipping-info {
            display: table-cell;
            width: 48%;
            vertical-align: top;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 5px;
        }
        .billing-info {
            margin-right: 4%;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #C99B3F;
            margin-bottom: 10px;
            border-bottom: 2px solid #C99B3F;
            padding-bottom: 5px;
        }
        .address {
            line-height: 1.6;
            color: #555;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th {
            background: #C99B3F;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
        }
        .items-table td {
            padding: 12px 8px;
            border-bottom: 1px solid #e5e7eb;
        }
        .items-table tr:nth-child(even) {
            background: #f9fafb;
        }
        .item-description {
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
        }
        .item-sku {
            color: #666;
            font-size: 11px;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .totals-section {
            width: 300px;
            margin-left: auto;
            margin-bottom: 30px;
        }
        .total-row {
            display: table;
            width: 100%;
            margin-bottom: 8px;
        }
        .total-label {
            display: table-cell;
            padding: 8px 0;
            font-weight: 600;
            color: #555;
        }
        .total-value {
            display: table-cell;
            text-align: right;
            padding: 8px 0;
            font-weight: 600;
        }
        .grand-total {
            border-top: 2px solid #C99B3F;
            padding-top: 12px;
            margin-top: 12px;
        }
        .grand-total .total-label,
        .grand-total .total-value {
            font-size: 16px;
            font-weight: bold;
            color: #C99B3F;
        }
        .payment-info {
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 30px;
        }
        .payment-method {
            font-weight: bold;
            color: #0369a1;
            margin-bottom: 5px;
        }
        .notes-section {
            background: #fffbeb;
            border: 1px solid #f59e0b;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 30px;
        }
        .notes-title {
            font-weight: bold;
            color: #d97706;
            margin-bottom: 8px;
        }
        .footer {
            border-top: 2px solid #e5e7eb;
            padding-top: 20px;
            text-align: center;
            color: #666;
            font-size: 11px;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-processing { background: #dbeafe; color: #1e40af; }
        .status-shipped { background: #e0e7ff; color: #5b21b6; }
        .status-delivered { background: #dcfce7; color: #166534; }
        .status-cancelled { background: #fee2e2; color: #dc2626; }
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 100px;
            color: rgba(201, 155, 63, 0.1);
            z-index: -1;
            font-weight: bold;
        }
        @page {
            margin: 15mm;
        }
    </style>
</head>
<body>
    @if($order->status === 'cancelled')
        <div class="watermark">CANCELLED</div>
    @endif

    <div class="invoice-header">
        <div class="company-info">
            <div class="company-logo">🕉️ Sanatoni Mart</div>
            <div class="company-details">
                Your trusted source for sacred items<br>
                and spiritual essentials<br><br>
                Email: support@sanatonimart.com<br>
                Phone: +880 1XXX XXXXXX<br>
                Website: www.sanatonimart.com
            </div>
        </div>
        <div class="invoice-info">
            <div class="invoice-title">INVOICE</div>
            <div>
                <strong>Invoice #{{ $order->order_number }}</strong><br>
                Date: {{ $order->created_at->format('F j, Y') }}<br>
                <span class="status-badge status-{{ $order->status }}">
                    {{ ucfirst($order->status) }}
                </span>
            </div>
        </div>
    </div>

    <div class="invoice-meta">
        <div class="invoice-meta-row">
            <div class="invoice-meta-label">Order Number:</div>
            <div class="invoice-meta-value">#{{ $order->order_number }}</div>
        </div>
        <div class="invoice-meta-row">
            <div class="invoice-meta-label">Order Date:</div>
            <div class="invoice-meta-value">{{ $order->created_at->format('F j, Y \a\t g:i A') }}</div>
        </div>
        <div class="invoice-meta-row">
            <div class="invoice-meta-label">Customer:</div>
            <div class="invoice-meta-value">{{ $order->customer_name }}</div>
        </div>
        <div class="invoice-meta-row">
            <div class="invoice-meta-label">Email:</div>
            <div class="invoice-meta-value">{{ $order->customer_email }}</div>
        </div>
        @if($order->estimated_delivery_date)
        <div class="invoice-meta-row">
            <div class="invoice-meta-label">Est. Delivery:</div>
            <div class="invoice-meta-value">{{ $order->estimated_delivery_date->format('F j, Y') }}</div>
        </div>
        @endif
        @if($order->delivered_at)
        <div class="invoice-meta-row">
            <div class="invoice-meta-label">Delivered On:</div>
            <div class="invoice-meta-value">{{ $order->delivered_at->format('F j, Y \a\t g:i A') }}</div>
        </div>
        @endif
    </div>

    <div class="billing-shipping">
        <div class="billing-info">
            <div class="section-title">Customer Information</div>
            <div class="address">
                <strong>{{ $order->user ? $order->user->name : 'Guest Customer' }}</strong><br>
                {{ $order->user ? $order->user->email : $order->guest_email }}<br>
                @if($order->user && $order->user->phone)
                    {{ $order->user->phone }}<br>
                @endif
            </div>
        </div>
        <div class="shipping-info">
            <div class="section-title">Shipping Address</div>
            <div class="address">
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
    </div>

    <table class="items-table">
        <thead>
            <tr>
                <th width="8%">#</th>
                <th width="42%">Item</th>
                <th width="15%" class="text-center">Quantity</th>
                <th width="15%" class="text-right">Unit Price</th>
                <th width="20%" class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $index => $item)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>
                    <div class="item-description">
                        {{ $item->product_snapshot['name'] ?? $item->product->name }}
                    </div>
                    <div class="item-sku">
                        SKU: {{ $item->product_snapshot['sku'] ?? $item->product->sku }}
                    </div>
                </td>
                <td class="text-center">{{ $item->quantity }}</td>
                <td class="text-right">৳{{ number_format($item->price, 2) }}</td>
                <td class="text-right">৳{{ number_format($item->subtotal, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals-section">
        <div class="total-row">
            <div class="total-label">Subtotal:</div>
            <div class="total-value">৳{{ number_format($order->subtotal, 2) }}</div>
        </div>
        <div class="total-row">
            <div class="total-label">Shipping:</div>
            <div class="total-value">৳{{ number_format($order->shipping_cost, 2) }}</div>
        </div>
        <div class="total-row grand-total">
            <div class="total-label">Grand Total:</div>
            <div class="total-value">৳{{ number_format($order->total, 2) }}</div>
        </div>
    </div>

    <div class="payment-info">
        <div class="payment-method">
            Payment Method: {{ $order->payment_method === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment' }}
        </div>
        @if($order->payment_method === 'cod')
            <div>Please keep the exact amount ready for delivery.</div>
        @endif
        <div>
            <strong>Amount to Pay: ৳{{ number_format($order->total, 2) }}</strong>
        </div>
    </div>

    @if($order->notes)
    <div class="notes-section">
        <div class="notes-title">Order Notes:</div>
        <div>{{ $order->notes }}</div>
    </div>
    @endif

    <div class="footer">
        <p><strong>Thank you for choosing Sanatoni Mart!</strong></p>
        <p>This is a computer-generated invoice and does not require a signature.</p>
        <p>Generated on {{ now()->format('F j, Y \a\t g:i A') }}</p>
        <p>For any queries, contact us at support@sanatonimart.com or visit our website.</p>
    </div>
</body>
</html>
