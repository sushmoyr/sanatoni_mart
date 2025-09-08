<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Status Update - #{{ $order->order_number }}</title>
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
        .status-update {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: #f0f9ff;
            border-radius: 8px;
            border: 1px solid #0ea5e9;
        }
        .status-badges {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin: 20px 0;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-processing { background: #dbeafe; color: #1e40af; }
        .status-shipped { background: #e0e7ff; color: #5b21b6; }
        .status-delivered { background: #dcfce7; color: #166534; }
        .status-cancelled { background: #fee2e2; color: #dc2626; }
        .status-arrow {
            font-size: 18px;
            color: #6b7280;
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
        .timeline {
            background: #f9fafb;
            padding: 20px;
            border-radius: 6px;
            margin-top: 15px;
        }
        .timeline-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e5e7eb;
        }
        .timeline-item:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        .timeline-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-size: 14px;
            font-weight: bold;
        }
        .timeline-icon.active {
            background: #C99B3F;
            color: white;
        }
        .timeline-icon.completed {
            background: #10b981;
            color: white;
        }
        .timeline-icon.upcoming {
            background: #e5e7eb;
            color: #6b7280;
        }
        .address-box {
            background: #f9fafb;
            padding: 15px;
            border-radius: 6px;
            margin-top: 10px;
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
        .alert {
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .alert-info {
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            color: #0369a1;
        }
        .alert-success {
            background: #f0fdf4;
            border: 1px solid #10b981;
            color: #047857;
        }
        .alert-warning {
            background: #fffbeb;
            border: 1px solid #f59e0b;
            color: #d97706;
        }
        .alert-danger {
            background: #fef2f2;
            border: 1px solid #ef4444;
            color: #dc2626;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .container {
                padding: 20px;
            }
            .status-badges {
                flex-direction: column;
                gap: 10px;
            }
            .status-arrow {
                transform: rotate(90deg);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🕉️ Sanatoni Mart</div>
            <h1 class="order-number">Order #{{ $order->order_number }}</h1>
            <p>Status Update</p>
        </div>

        <div class="status-update">
            <h2 style="margin: 0 0 20px 0; color: #1f2937;">Your order status has been updated!</h2>
            
            <div class="status-badges">
                <span class="status-badge status-{{ $oldStatus }}">
                    {{ ucfirst(str_replace('_', ' ', $oldStatus)) }}
                </span>
                <span class="status-arrow">→</span>
                <span class="status-badge status-{{ $newStatus }}">
                    {{ ucfirst(str_replace('_', ' ', $newStatus)) }}
                </span>
            </div>

            @if($comment)
            <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 6px; border: 1px solid #e5e7eb;">
                <strong>Update Note:</strong> {{ $comment }}
            </div>
            @endif
        </div>

        <div class="section">
            <p>Dear {{ $customerName }},</p>
            
            @if($newStatus === 'processing')
                <p>Great news! We've started processing your order. Our team is carefully preparing your sacred items for shipment.</p>
                <div class="alert alert-info">
                    <strong>What's Next:</strong> We'll notify you as soon as your order is shipped with tracking information.
                </div>
            @elseif($newStatus === 'shipped')
                <p>Excellent! Your order has been shipped and is on its way to you.</p>
                <div class="alert alert-success">
                    <strong>Tracking:</strong> You can track your package using the tracking information provided separately.
                </div>
            @elseif($newStatus === 'delivered')
                <p>Wonderful! Your order has been successfully delivered. We hope you enjoy your sacred items!</p>
                <div class="alert alert-success">
                    <strong>Delivered:</strong> Your package was delivered on {{ $order->delivered_at ? $order->delivered_at->format('F j, Y \a\t g:i A') : 'today' }}.
                </div>
            @elseif($newStatus === 'cancelled')
                <p>We're sorry to inform you that your order has been cancelled.</p>
                <div class="alert alert-danger">
                    <strong>Refund:</strong> If you've already made a payment, we'll process your refund within 5-7 business days.
                </div>
            @else
                <p>Your order status has been updated. We'll keep you informed of any further changes.</p>
            @endif
        </div>

        <div class="section">
            <h2 class="section-title">Order Progress</h2>
            <div class="timeline">
                @php
                    $statuses = ['pending', 'processing', 'shipped', 'delivered'];
                    $currentIndex = array_search($newStatus, $statuses);
                    $isCancelled = $newStatus === 'cancelled';
                @endphp

                @foreach($statuses as $index => $status)
                    <div class="timeline-item">
                        <div class="timeline-icon {{ 
                            $isCancelled && $status === $newStatus ? 'active' : 
                            ($index < $currentIndex || ($index === $currentIndex && !$isCancelled)) ? 'completed' : 
                            ($index === $currentIndex && !$isCancelled) ? 'active' : 'upcoming' 
                        }}">
                            {{ $index + 1 }}
                        </div>
                        <div>
                            <strong>{{ ucfirst($status) }}</strong>
                            @if($index < $currentIndex || ($index === $currentIndex && !$isCancelled))
                                <span style="color: #10b981; margin-left: 10px;">✓</span>
                            @elseif($index === $currentIndex && !$isCancelled)
                                <span style="color: #C99B3F; margin-left: 10px;">● Current</span>
                            @endif
                        </div>
                    </div>
                @endforeach

                @if($isCancelled)
                    <div class="timeline-item">
                        <div class="timeline-icon" style="background: #dc2626; color: white;">
                            ✕
                        </div>
                        <div>
                            <strong>Cancelled</strong>
                            <span style="color: #dc2626; margin-left: 10px;">● Current</span>
                        </div>
                    </div>
                @endif
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Order Summary</h2>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Order Number:</span>
                <strong>#{{ $order->order_number }}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Order Total:</span>
                <strong>৳{{ number_format($order->total, 2) }}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Payment Method:</span>
                <span>{{ $order->payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment' }}</span>
            </div>
            @if($order->estimated_delivery_date && $newStatus !== 'delivered' && $newStatus !== 'cancelled')
            <div style="display: flex; justify-content: space-between;">
                <span>Estimated Delivery:</span>
                <span>{{ $order->estimated_delivery_date->format('F j, Y') }}</span>
            </div>
            @endif
        </div>

        <div style="text-align: center;">
            <a href="{{ route('orders.show', $order->id) }}" class="cta-button">
                View Order Details
            </a>
        </div>

        <div class="footer">
            <p>If you have any questions about your order, please contact our support team.</p>
            <p>Update sent on: {{ now()->format('F j, Y \a\t g:i A') }}</p>
            <p style="margin-top: 20px;">
                <strong>Sanatoni Mart</strong><br>
                Your trusted source for sacred items and spiritual essentials
            </p>
        </div>
    </div>
</body>
</html>
