<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of customer's orders
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        if (!$user) {
            return redirect()->route('login')->with([
                'flash' => [
                    'type' => 'error',
                    'message' => 'Please login to view your orders.'
                ]
            ]);
        }

        // Advanced filtering parameters
        $filters = $request->only(['status', 'search', 'date_from', 'date_to', 'amount_min', 'amount_max', 'sort_by', 'sort_direction']);
        
        $query = Order::with([
            'items.product.images', 
            'statusHistory' => function($q) {
                $q->orderBy('created_at', 'desc')->limit(3);
            }
        ])->where('user_id', $user->id);

        // Status filter
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Search filter (order number, product names, notes)
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('order_number', 'like', "%{$request->search}%")
                  ->orWhere('notes', 'like', "%{$request->search}%")
                  ->orWhereHas('items.product', function ($productQuery) use ($request) {
                      $productQuery->where('name', 'like', "%{$request->search}%");
                  });
            });
        }

        // Date range filter
        if ($request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Amount range filter
        if ($request->amount_min) {
            $query->where('total', '>=', $request->amount_min);
        }
        if ($request->amount_max) {
            $query->where('total', '<=', $request->amount_max);
        }

        // Sorting
        $sortBy = $request->sort_by ?? 'created_at';
        $sortDirection = $request->sort_direction ?? 'desc';
        
        $allowedSorts = ['created_at', 'total', 'order_number', 'status'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $orders = $query->paginate(12)->withQueryString();

        // Enhanced order statuses with counts
        $orderStatuses = [
            'pending' => 'Pending',
            'processing' => 'Processing', 
            'shipped' => 'Shipped',
            'delivered' => 'Delivered',
            'cancelled' => 'Cancelled',
        ];

        // Get order counts by status for quick filters
        $statusCounts = Order::where('user_id', $user->id)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Calculate order statistics
        $totalOrders = Order::where('user_id', $user->id)->count();
        $totalSpent = Order::where('user_id', $user->id)
            ->whereIn('status', ['delivered', 'processing', 'shipped'])
            ->sum('total');
        $averageOrderValue = $totalOrders > 0 ? $totalSpent / $totalOrders : 0;

        // Recent quick actions
        $quickActions = [
            'pending_orders' => Order::where('user_id', $user->id)
                ->where('status', 'pending')
                ->count(),
            'processing_orders' => Order::where('user_id', $user->id)
                ->where('status', 'processing')
                ->count(),
            'shipped_orders' => Order::where('user_id', $user->id)
                ->where('status', 'shipped')
                ->count(),
        ];

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'orderStatuses' => $orderStatuses,
            'statusCounts' => $statusCounts,
            'filters' => $filters,
            'orderStats' => [
                'total_orders' => $totalOrders,
                'total_spent' => $totalSpent,
                'average_order_value' => $averageOrderValue,
            ],
            'quickActions' => $quickActions,
        ]);
    }

    /**
     * Display the specified order
     */
    public function show(Order $order)
    {
        // Check if user can view this order
        if (!$this->canViewOrder($order)) {
            abort(403, 'Unauthorized to view this order.');
        }

        $order->load([
            'items.product.images',
            'statusHistory.changedBy',
            'invoice',
            'user'
        ]);

        // Enhanced order timeline with real-time tracking
        $timeline = $this->buildOrderTimeline($order);
        
        // Calculate delivery progress
        $deliveryProgress = $this->calculateDeliveryProgress($order);
        
        // Get recommended products for reorder
        $recommendedProducts = $this->getRecommendedProducts($order);
        
        // Calculate estimated delivery if not set
        if (!$order->estimated_delivery_date && in_array($order->status, ['processing', 'shipped'])) {
            $order->estimated_delivery_date = $this->calculateEstimatedDelivery($order);
        }

        return Inertia::render('Orders/Show', [
            'order' => $order,
            'timeline' => $timeline,
            'deliveryProgress' => $deliveryProgress,
            'recommendedProducts' => $recommendedProducts,
        ]);
    }

    /**
     * Cancel an order
     */
    public function cancel(Order $order)
    {
        // Check if user can cancel this order
        if (!$this->canViewOrder($order)) {
            abort(403, 'Unauthorized to cancel this order.');
        }

        if (!$order->canBeCancelled()) {
            return back()->with([
                'flash' => [
                    'type' => 'error',
                    'message' => 'This order cannot be cancelled at this stage.'
                ]
            ]);
        }

        // Update order status
        $order->update(['status' => Order::STATUS_CANCELLED]);

        // Create status history
        $order->statusHistory()->create([
            'from_status' => $order->getOriginal('status'),
            'to_status' => Order::STATUS_CANCELLED,
            'comment' => 'Order cancelled by customer',
            'changed_by' => auth()->id(),
        ]);

        // Restore product stock
        foreach ($order->items as $item) {
            if ($item->product && !$item->product->has_unlimited_stock) {
                $item->product->increment('stock_quantity', $item->quantity);
            }
        }

        return back()->with([
            'flash' => [
                'type' => 'success',
                'message' => 'Order cancelled successfully.'
            ]
        ]);
    }

    /**
     * Reorder - add order items to cart
     */
    public function reorder(Order $order)
    {
        // Check if user can reorder
        if (!$this->canViewOrder($order)) {
            abort(403, 'Unauthorized to reorder this order.');
        }

        $addedItems = 0;
        $unavailableItems = [];

        foreach ($order->items as $item) {
            $product = $item->product;
            
            // Check if product still exists and is published
            if (!$product || $product->status !== 'published') {
                $unavailableItems[] = $item->product_name;
                continue;
            }

            // Check stock availability
            if (!$product->has_unlimited_stock && $product->stock_quantity < $item->quantity) {
                $unavailableItems[] = $product->name . ' (insufficient stock)';
                continue;
            }

            // Add to cart (reuse cart logic)
            $sessionId = session()->getId();
            $userId = auth()->id();

            $existingCartItem = \App\Models\ShoppingCart::where('product_id', $product->id)
                ->where(function ($query) use ($userId, $sessionId) {
                    if ($userId) {
                        $query->where('user_id', $userId);
                    } else {
                        $query->where('session_id', $sessionId);
                    }
                })
                ->first();

            if ($existingCartItem) {
                $existingCartItem->increment('quantity', $item->quantity);
            } else {
                \App\Models\ShoppingCart::create([
                    'session_id' => $userId ? null : $sessionId,
                    'user_id' => $userId,
                    'product_id' => $product->id,
                    'quantity' => $item->quantity,
                ]);
            }

            $addedItems++;
        }

        $message = "Added {$addedItems} items to cart.";
        if (!empty($unavailableItems)) {
            $message .= ' Some items were unavailable: ' . implode(', ', $unavailableItems);
        }

        return redirect()->route('cart.index')->with([
            'flash' => [
                'type' => $addedItems > 0 ? 'success' : 'warning',
                'message' => $message
            ]
        ]);
    }

    /**
     * Show order tracking
     */
    public function track(Request $request)
    {
        $request->validate([
            'order_number' => 'required|string',
            'email' => 'required|email',
        ]);

        $order = Order::with(['items.product.images', 'statusHistory.changedBy'])
            ->where('order_number', $request->order_number)
            ->where(function ($query) use ($request) {
                $query->whereHas('user', function ($userQuery) use ($request) {
                    $userQuery->where('email', $request->email);
                })->orWhere('guest_email', $request->email);
            })
            ->first();

        if (!$order) {
            return back()->with([
                'flash' => [
                    'type' => 'error',
                    'message' => 'Order not found with the provided details.'
                ]
            ]);
        }

        return Inertia::render('Orders/Track', [
            'order' => $order,
        ]);
    }

    /**
     * Show order tracking form
     */
    public function trackForm()
    {
        return Inertia::render('Orders/TrackForm');
    }

    /**
     * Check if user can view the order
     */
    private function canViewOrder(Order $order): bool
    {
        $user = auth()->user();
        
        if (!$user) {
            return false;
        }

        return $order->user_id === $user->id;
    }

    /**
     * Build enhanced order timeline with real-time tracking
     */
    private function buildOrderTimeline(Order $order): array
    {
        $timeline = [];
        $statusFlow = ['pending', 'processing', 'shipped', 'delivered'];
        
        // Add status history
        foreach ($order->statusHistory as $history) {
            $timeline[] = [
                'type' => 'status_change',
                'title' => ucfirst($history->to_status),
                'description' => $history->comment ?? "Order status updated to " . ucfirst($history->to_status),
                'timestamp' => $history->created_at,
                'completed' => true,
                'icon' => $this->getStatusIcon($history->to_status),
                'variant' => $this->getStatusVariant($history->to_status),
            ];
        }

        // Add expected future steps
        $currentStatusIndex = array_search($order->status, $statusFlow);
        if ($currentStatusIndex !== false && $order->status !== 'cancelled') {
            for ($i = $currentStatusIndex + 1; $i < count($statusFlow); $i++) {
                $status = $statusFlow[$i];
                $timeline[] = [
                    'type' => 'future_step',
                    'title' => ucfirst($status),
                    'description' => $this->getStatusDescription($status),
                    'timestamp' => null,
                    'completed' => false,
                    'icon' => $this->getStatusIcon($status),
                    'variant' => 'secondary',
                ];
            }
        }

        // Sort by timestamp, keeping future steps at the end
        usort($timeline, function ($a, $b) {
            if ($a['completed'] && !$b['completed']) return -1;
            if (!$a['completed'] && $b['completed']) return 1;
            if ($a['timestamp'] && $b['timestamp']) {
                return strtotime($b['timestamp']) - strtotime($a['timestamp']);
            }
            return 0;
        });

        return $timeline;
    }

    /**
     * Calculate delivery progress percentage
     */
    private function calculateDeliveryProgress(Order $order): array
    {
        $statusSteps = [
            'pending' => ['label' => 'Order Placed', 'percentage' => 20],
            'processing' => ['label' => 'Preparing Order', 'percentage' => 40],
            'shipped' => ['label' => 'In Transit', 'percentage' => 70],
            'delivered' => ['label' => 'Delivered', 'percentage' => 100],
            'cancelled' => ['label' => 'Cancelled', 'percentage' => 0],
        ];

        $currentStep = $statusSteps[$order->status] ?? $statusSteps['pending'];
        
        return [
            'current_status' => $order->status,
            'current_label' => $currentStep['label'],
            'percentage' => $currentStep['percentage'],
            'steps' => $statusSteps,
            'estimated_delivery' => $order->estimated_delivery_date,
            'delivered_at' => $order->delivered_at,
        ];
    }

    /**
     * Get recommended products based on order history
     */
    private function getRecommendedProducts(Order $order): array
    {
        // Get products from the same categories as ordered items
        $categoryIds = $order->items()
            ->with('product.category')
            ->get()
            ->pluck('product.category.id')
            ->filter()
            ->unique();

        if ($categoryIds->isEmpty()) {
            return [];
        }

        $recommendations = \App\Models\Product::with(['images', 'category'])
            ->whereIn('category_id', $categoryIds)
            ->where('status', 'published')
            ->whereNotIn('id', $order->items->pluck('product_id'))
            ->inRandomOrder()
            ->limit(4)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'formatted_price' => '৳' . number_format($product->price, 2),
                    'image' => $product->images->first()?->image_path ?? '/images/placeholder.jpg',
                    'category' => $product->category?->name,
                ];
            });

        return $recommendations->toArray();
    }

    /**
     * Calculate estimated delivery date
     */
    private function calculateEstimatedDelivery(Order $order): string
    {
        $baseDeliveryDays = 3; // Default 3 business days
        
        // Add extra days based on location (simplified logic)
        $shippingAddress = $order->shipping_address;
        $extraDays = 0;
        
        if (isset($shippingAddress['division'])) {
            $division = strtolower($shippingAddress['division']);
            if (in_array($division, ['sylhet', 'chittagong', 'barisal', 'rangpur'])) {
                $extraDays = 2;
            } elseif (in_array($division, ['khulna', 'rajshahi'])) {
                $extraDays = 1;
            }
        }

        $deliveryDate = now()->addDays($baseDeliveryDays + $extraDays);
        
        // Skip weekends (simple approximation)
        while ($deliveryDate->isWeekend()) {
            $deliveryDate->addDay();
        }

        return $deliveryDate->toDateString();
    }

    /**
     * Get status icon for timeline
     */
    private function getStatusIcon(string $status): string
    {
        return match ($status) {
            'pending' => 'ClockIcon',
            'processing' => 'CogIcon',
            'shipped' => 'TruckIcon',
            'delivered' => 'CheckCircleIcon',
            'cancelled' => 'XCircleIcon',
            default => 'ClockIcon',
        };
    }

    /**
     * Get status variant for timeline
     */
    private function getStatusVariant(string $status): string
    {
        return match ($status) {
            'pending' => 'warning',
            'processing' => 'info',
            'shipped' => 'secondary',
            'delivered' => 'success',
            'cancelled' => 'danger',
            default => 'secondary',
        };
    }

    /**
     * Get status description for future steps
     */
    private function getStatusDescription(string $status): string
    {
        return match ($status) {
            'pending' => 'Your order is being reviewed',
            'processing' => 'We are preparing your sacred items',
            'shipped' => 'Your order is on its way to you',
            'delivered' => 'Your order has been delivered',
            default => 'Order status will be updated',
        };
    }
}
