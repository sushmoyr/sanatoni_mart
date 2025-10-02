<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\ShoppingCart;
use App\Models\ShippingZone;
use App\Models\CustomerAddress;
use App\Models\Product;
use App\Models\Coupon;
use App\Models\CouponUsage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    /**
     * Show checkout page
     */
    public function index()
    {
        $cartItems = $this->getCartItems();
        
        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with([
                'flash' => [
                    'type' => 'error',
                    'message' => 'Your cart is empty. Add some products to proceed with checkout.'
                ]
            ]);
        }

        $cartSummary = $this->getCartSummary($cartItems);
        $shippingZones = ShippingZone::active()->get();
        $addresses = auth()->check() ? auth()->user()->addresses : collect();

        return Inertia::render('Checkout/Index', [
            'cartItems' => $cartItems,
            'cartSummary' => $cartSummary,
            'shippingZones' => $shippingZones,
            'customerAddresses' => $addresses,
            'user' => auth()->user(),
        ]);
    }

    /**
     * Calculate shipping cost based on address
     */
    public function calculateShipping(Request $request)
    {
        $request->validate([
            'city' => 'required|string|max:255',
            'district' => 'nullable|string|max:255',
            'division' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
        ]);

        $address = $request->only(['city', 'district', 'division', 'postal_code']);
        $shippingZone = ShippingZone::findForAddress($address);

        if (!$shippingZone) {
            return response()->json([
                'error' => 'Unable to determine shipping cost for this location'
            ], 400);
        }

        $cartItems = $this->getCartItems();
        $cartSummary = $this->getCartSummary($cartItems);

        return response()->json([
            'shippingZone' => $shippingZone,
            'shippingCost' => $shippingZone->shipping_cost,
            'deliveryTimeRange' => $shippingZone->delivery_time_range,
            'total' => $cartSummary['total'] + $shippingZone->shipping_cost,
        ]);
    }

    /**
     * Process checkout and create order
     */
    public function store(Request $request)
    {
        $cartItems = $this->getCartItems();
        
        if ($cartItems->isEmpty()) {
            return back()->with([
                'flash' => [
                    'type' => 'error',
                    'message' => 'Your cart is empty.'
                ]
            ]);
        }

        // Validate the request
        $validated = $request->validate([
            // Customer information (for guest checkout)
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            
            // Shipping address
            'shipping_address.name' => 'required|string|max:255',
            'shipping_address.phone' => 'required|string|max:20',
            'shipping_address.address_line_1' => 'required|string|max:255',
            'shipping_address.address_line_2' => 'nullable|string|max:255',
            'shipping_address.city' => 'required|string|max:255',
            'shipping_address.district' => 'nullable|string|max:255',
            'shipping_address.division' => 'nullable|string|max:255',
            'shipping_address.postal_code' => 'nullable|string|max:20',
            
            // Billing address (optional)
            'billing_same_as_shipping' => 'boolean',
            'billing_address.name' => 'nullable|string|max:255',
            'billing_address.phone' => 'nullable|string|max:20',
            'billing_address.address_line_1' => 'nullable|string|max:255',
            'billing_address.address_line_2' => 'nullable|string|max:255',
            'billing_address.city' => 'nullable|string|max:255',
            'billing_address.district' => 'nullable|string|max:255',
            'billing_address.division' => 'nullable|string|max:255',
            'billing_address.postal_code' => 'nullable|string|max:20',
            
            // Order notes
            'notes' => 'nullable|string|max:1000',
        ]);

        // Calculate shipping cost
        $shippingZone = ShippingZone::findForAddress($validated['shipping_address']);
        if (!$shippingZone) {
            return back()->with([
                'flash' => [
                    'type' => 'error',
                    'message' => 'Unable to determine shipping cost for your location.'
                ]
            ]);
        }

        DB::beginTransaction();

        try {
            // Calculate order totals
            $cartSummary = $this->getCartSummary($cartItems);
            $subtotal = $cartSummary['subtotal'];
            $discount = $cartSummary['discount'];
            $subtotalAfterDiscount = $cartSummary['total'];
            $shippingCost = $shippingZone->shipping_cost;
            $total = $subtotalAfterDiscount + $shippingCost;

            // Prepare addresses
            $shippingAddress = $validated['shipping_address'];
            $billingAddress = $validated['billing_same_as_shipping'] ?? true 
                ? $shippingAddress 
                : $validated['billing_address'];

            // Create order
            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => auth()->id(),
                'guest_email' => auth()->check() ? null : $validated['customer_email'],
                'status' => Order::STATUS_PENDING,
                'subtotal' => $subtotal,
                'discount_amount' => $discount,
                'shipping_cost' => $shippingCost,
                'total' => $total,
                'shipping_address' => $shippingAddress,
                'billing_address' => $billingAddress,
                'notes' => $validated['notes'],
                'payment_method' => Order::PAYMENT_METHOD_COD,
                'estimated_delivery_date' => now()->addDays($shippingZone->delivery_time_max ?? 7),
            ]);

            // Create order items and update inventory
            foreach ($cartItems as $cartItem) {
                $product = $cartItem->product;
                
                // Check if product has sufficient stock (if not unlimited)
                if (!$product->has_unlimited_stock && $product->stock_quantity < $cartItem->quantity) {
                    throw new \Exception("Insufficient stock for product: {$product->name}");
                }

                // Create order item
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $cartItem->quantity,
                    'price' => $product->price,
                    'subtotal' => $cartItem->quantity * $product->price,
                    'product_snapshot' => [
                        'name' => $product->name,
                        'description' => $product->description,
                        'price' => $product->price,
                        'image' => $product->images->first()?->image_path,
                        'sku' => $product->sku,
                    ],
                ]);

                // Update product stock (if not unlimited)
                if (!$product->has_unlimited_stock) {
                    $product->decrement('stock_quantity', $cartItem->quantity);
                }
            }

            // Handle coupon usage if applied
            $appliedCoupon = Session::get('applied_coupon');
            if ($appliedCoupon && $discount > 0) {
                $coupon = Coupon::where('code', $appliedCoupon['code'])->first();
                if ($coupon) {
                    // Record coupon usage
                    CouponUsage::create([
                        'coupon_id' => $coupon->id,
                        'order_id' => $order->id,
                        'user_id' => auth()->id(),
                        'customer_email' => auth()->check() ? auth()->user()->email : $validated['customer_email'],
                        'discount_amount' => $discount,
                    ]);
                    
                    // Increment coupon usage count
                    $coupon->increment('used_count');
                    
                    // Remove coupon from session
                    Session::forget('applied_coupon');
                }
            }

            // Create order status history
            OrderStatusHistory::create([
                'order_id' => $order->id,
                'from_status' => null,
                'to_status' => Order::STATUS_PENDING,
                'comment' => 'Order placed successfully',
                'changed_by' => auth()->id(),
            ]);

            // Clear cart
            $this->clearCart();

            DB::commit();

            // Send order confirmation email
            $this->sendOrderConfirmationEmail($order);

            return redirect()->route('orders.show', $order->id)->with([
                'flash' => [
                    'type' => 'success',
                    'message' => 'Order placed successfully! You will receive a confirmation email shortly.'
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->with([
                'flash' => [
                    'type' => 'error',
                    'message' => 'Failed to place order: ' . $e->getMessage()
                ]
            ]);
        }
    }

    /**
     * Get cart items for current user/session
     */
    private function getCartItems()
    {
        $sessionId = session()->getId();
        $userId = auth()->id();

        return ShoppingCart::with(['product.images'])
            ->where(function ($query) use ($userId, $sessionId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('session_id', $sessionId);
                }
            })
            ->get();
    }

    /**
     * Get cart summary
     */
    private function getCartSummary($cartItems)
    {
        $subtotal = $cartItems->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });

        $appliedCoupon = Session::get('applied_coupon');
        $discount = 0;

        if ($appliedCoupon) {
            $coupon = Coupon::where('code', $appliedCoupon['code'])
                ->where('status', 'active')
                ->first();
            
            if ($coupon && $coupon->isValidForCart($subtotal)) {
                $discount = $coupon->calculateDiscount($subtotal, []);
            } else {
                // Remove invalid coupon from session
                Session::forget('applied_coupon');
                $appliedCoupon = null;
            }
        }

        return [
            'itemCount' => $cartItems->sum('quantity'),
            'uniqueItems' => $cartItems->count(),
            'subtotal' => $subtotal,
            'discount' => $discount,
            'total' => max(0, $subtotal - $discount),
            'appliedCoupon' => $appliedCoupon ? [
                'code' => $appliedCoupon['code'],
                'discount_amount' => $discount,
                'discount_type' => $appliedCoupon['discount_type']
            ] : null
        ];
    }

    /**
     * Clear cart for current user/session
     */
    private function clearCart()
    {
        $sessionId = session()->getId();
        $userId = auth()->id();

        ShoppingCart::where(function ($query) use ($userId, $sessionId) {
            if ($userId) {
                $query->where('user_id', $userId);
            } else {
                $query->where('session_id', $sessionId);
            }
        })->delete();
    }

    /**
     * Send order confirmation email
     */
    private function sendOrderConfirmationEmail(Order $order)
    {
        try {
            Mail::to($order->customer_email)->send(new \App\Mail\OrderConfirmation($order));
        } catch (\Exception $e) {
            // Log the error but don't fail the order
            logger()->error('Failed to send order confirmation email', [
                'order_id' => $order->id,
                'customer_email' => $order->customer_email,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
