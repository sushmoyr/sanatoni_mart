<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of orders
     */
    public function index(Request $request)
    {
        $orders = Order::with(['user', 'items.product'])
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->when($request->payment_method, function ($query, $method) {
                return $query->where('payment_method', $method);
            })
            ->when($request->search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('order_number', 'like', "%{$search}%")
                      ->orWhere('guest_email', 'like', "%{$search}%")
                      ->orWhereHas('user', function ($userQuery) use ($search) {
                          $userQuery->where('name', 'like', "%{$search}%")
                                  ->orWhere('email', 'like', "%{$search}%");
                      });
                });
            })
            ->when($request->date_from, function ($query, $date) {
                return $query->whereDate('created_at', '>=', $date);
            })
            ->when($request->date_to, function ($query, $date) {
                return $query->whereDate('created_at', '<=', $date);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        $orderStats = [
            'total' => Order::count(),
            'pending' => Order::where('status', Order::STATUS_PENDING)->count(),
            'processing' => Order::where('status', Order::STATUS_PROCESSING)->count(),
            'shipped' => Order::where('status', Order::STATUS_SHIPPED)->count(),
            'delivered' => Order::where('status', Order::STATUS_DELIVERED)->count(),
            'cancelled' => Order::where('status', Order::STATUS_CANCELLED)->count(),
            'total_revenue' => Order::where('status', '!=', Order::STATUS_CANCELLED)
                                   ->sum('total'),
        ];

        $statusOptions = [
            Order::STATUS_PENDING => 'Pending',
            Order::STATUS_PROCESSING => 'Processing',
            Order::STATUS_SHIPPED => 'Shipped',
            Order::STATUS_DELIVERED => 'Delivered',
            Order::STATUS_CANCELLED => 'Cancelled',
        ];

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'orderStats' => $orderStats,
            'statusOptions' => $statusOptions,
            'filters' => $request->only(['status', 'payment_method', 'search', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Display the specified order
     */
    public function show(Order $order)
    {
        $order->load([
            'user',
            'items.product.images',
            'statusHistory.changedBy',
            'invoice'
        ]);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Show the form for editing the order
     */
    public function edit(Order $order)
    {
        $order->load(['user', 'items.product']);

        $statusOptions = [
            Order::STATUS_PENDING => 'Pending',
            Order::STATUS_PROCESSING => 'Processing',
            Order::STATUS_SHIPPED => 'Shipped',
            Order::STATUS_DELIVERED => 'Delivered',
            Order::STATUS_CANCELLED => 'Cancelled',
        ];

        return Inertia::render('Admin/Orders/Edit', [
            'order' => $order,
            'statusOptions' => $statusOptions,
        ]);
    }

    /**
     * Update the order
     */
    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(array_keys([
                Order::STATUS_PENDING => 'Pending',
                Order::STATUS_PROCESSING => 'Processing',
                Order::STATUS_SHIPPED => 'Shipped',
                Order::STATUS_DELIVERED => 'Delivered',
                Order::STATUS_CANCELLED => 'Cancelled',
            ]))],
            'notes' => 'nullable|string|max:1000',
            'shipping_address.name' => 'required|string|max:255',
            'shipping_address.phone' => 'required|string|max:20',
            'shipping_address.address_line_1' => 'required|string|max:255',
            'shipping_address.address_line_2' => 'nullable|string|max:255',
            'shipping_address.city' => 'required|string|max:255',
            'shipping_address.district' => 'nullable|string|max:255',
            'shipping_address.division' => 'nullable|string|max:255',
            'shipping_address.postal_code' => 'nullable|string|max:20',
        ]);

        $oldStatus = $order->status;
        
        $order->update([
            'status' => $validated['status'],
            'notes' => $validated['notes'],
            'shipping_address' => $validated['shipping_address'],
            'delivered_at' => $validated['status'] === Order::STATUS_DELIVERED ? now() : null,
        ]);

        // Create status history if status changed
        if ($oldStatus !== $validated['status']) {
            OrderStatusHistory::create([
                'order_id' => $order->id,
                'from_status' => $oldStatus,
                'to_status' => $validated['status'],
                'comment' => 'Status updated by admin',
                'changed_by' => auth()->id(),
            ]);

            // Handle stock restoration for cancelled orders
            if ($validated['status'] === Order::STATUS_CANCELLED && $oldStatus !== Order::STATUS_CANCELLED) {
                foreach ($order->items as $item) {
                    if ($item->product && !$item->product->has_unlimited_stock) {
                        $item->product->increment('stock_quantity', $item->quantity);
                    }
                }
            }

            // Handle stock deduction if order is reactivated from cancelled
            if ($oldStatus === Order::STATUS_CANCELLED && $validated['status'] !== Order::STATUS_CANCELLED) {
                foreach ($order->items as $item) {
                    if ($item->product && !$item->product->has_unlimited_stock) {
                        // Check if sufficient stock is available
                        if ($item->product->stock_quantity < $item->quantity) {
                            return back()->with([
                                'flash' => [
                                    'type' => 'error',
                                    'message' => "Insufficient stock for product: {$item->product->name}"
                                ]
                            ]);
                        }
                        $item->product->decrement('stock_quantity', $item->quantity);
                    }
                }
            }
        }

        return redirect()->route('admin.orders.show', $order)->with([
            'flash' => [
                'type' => 'success',
                'message' => 'Order updated successfully.'
            ]
        ]);
    }

    /**
     * Update order status only
     */
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in([
                Order::STATUS_PENDING,
                Order::STATUS_PROCESSING,
                Order::STATUS_SHIPPED,
                Order::STATUS_DELIVERED,
                Order::STATUS_CANCELLED,
            ])],
            'comment' => 'nullable|string|max:255',
        ]);

        $oldStatus = $order->status;
        
        if ($oldStatus === $validated['status']) {
            return back()->with([
                'flash' => [
                    'type' => 'info',
                    'message' => 'Order status is already ' . ucfirst($validated['status'])
                ]
            ]);
        }

        $order->update([
            'status' => $validated['status'],
            'delivered_at' => $validated['status'] === Order::STATUS_DELIVERED ? now() : null,
        ]);

        // Create status history
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'from_status' => $oldStatus,
            'to_status' => $validated['status'],
            'comment' => $validated['comment'] ?: 'Status updated by admin',
            'changed_by' => auth()->id(),
        ]);

        // Handle stock restoration/deduction for cancelled orders
        if ($validated['status'] === Order::STATUS_CANCELLED && $oldStatus !== Order::STATUS_CANCELLED) {
            foreach ($order->items as $item) {
                if ($item->product && !$item->product->has_unlimited_stock) {
                    $item->product->increment('stock_quantity', $item->quantity);
                }
            }
        } elseif ($oldStatus === Order::STATUS_CANCELLED && $validated['status'] !== Order::STATUS_CANCELLED) {
            foreach ($order->items as $item) {
                if ($item->product && !$item->product->has_unlimited_stock) {
                    if ($item->product->stock_quantity < $item->quantity) {
                        // Rollback the status change
                        $order->update(['status' => $oldStatus]);
                        return back()->with([
                            'flash' => [
                                'type' => 'error',
                                'message' => "Cannot reactivate order. Insufficient stock for: {$item->product->name}"
                            ]
                        ]);
                    }
                    $item->product->decrement('stock_quantity', $item->quantity);
                }
            }
        }

        return back()->with([
            'flash' => [
                'type' => 'success',
                'message' => 'Order status updated to ' . ucfirst($validated['status'])
            ]
        ]);
    }

    /**
     * Remove the order
     */
    public function destroy(Order $order)
    {
        // Only allow deletion of cancelled orders
        if ($order->status !== Order::STATUS_CANCELLED) {
            return back()->with([
                'flash' => [
                    'type' => 'error',
                    'message' => 'Only cancelled orders can be deleted.'
                ]
            ]);
        }

        $orderNumber = $order->order_number;
        $order->delete();

        return redirect()->route('admin.orders.index')->with([
            'flash' => [
                'type' => 'success',
                'message' => "Order {$orderNumber} has been deleted."
            ]
        ]);
    }

    /**
     * Export orders
     */
    public function export(Request $request, $format = 'csv')
    {
        // TODO: Implement export functionality
        // This will be implemented later with appropriate export libraries
        
        return back()->with([
            'flash' => [
                'type' => 'info',
                'message' => 'Export functionality will be implemented soon.'
            ]
        ]);
    }
}
