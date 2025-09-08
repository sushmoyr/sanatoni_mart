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

        $orders = Order::with(['items.product.images', 'statusHistory'])
            ->where('user_id', $user->id)
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->when($request->search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('order_number', 'like', "%{$search}%")
                      ->orWhereHas('items.product', function ($productQuery) use ($search) {
                          $productQuery->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $orderStatuses = [
            'pending' => 'Pending',
            'processing' => 'Processing',
            'shipped' => 'Shipped',
            'delivered' => 'Delivered',
            'cancelled' => 'Cancelled',
        ];

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'orderStatuses' => $orderStatuses,
            'filters' => $request->only(['status', 'search']),
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
            'invoice'
        ]);

        return Inertia::render('Orders/Show', [
            'order' => $order,
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
}
