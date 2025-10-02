<?php

namespace App\Http\Controllers;

use App\Models\ShoppingCart;
use App\Models\Product;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display user's shopping cart
     */
    public function index()
    {
        $cartItems = $this->getCartItems();
        $cartSummary = $this->getCartSummary($cartItems);

        return Inertia::render('Cart/Index', [
            'cartItems' => $cartItems,
            'cartSummary' => $cartSummary
        ]);
    }

    /**
     * Add product to cart
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'integer|min:1|max:99'
        ]);

        $productId = $request->product_id;
        $quantity = $request->get('quantity', 1);

        // Check if product exists and is published
        $product = Product::where('id', $productId)
            ->where('status', 'published')
            ->firstOrFail();

        $sessionId = $this->getSessionId();
        $userId = auth()->id();

        // Check if item already exists in cart
        $cartItem = ShoppingCart::where('product_id', $productId)
            ->where(function ($query) use ($userId, $sessionId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('session_id', $sessionId);
                }
            })
            ->first();

        if ($cartItem) {
            // Update quantity
            $cartItem->update([
                'quantity' => $cartItem->quantity + $quantity
            ]);
        } else {
            // Create new cart item
            ShoppingCart::create([
                'session_id' => $userId ? null : $sessionId,
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => $quantity
            ]);
        }

        return back()->with([
            'flash' => [
                'type' => 'success',
                'message' => 'Product added to cart successfully'
            ]
        ]);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, ShoppingCart $shoppingCart)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:99'
        ]);

        // Ensure the cart item belongs to the current user/session
        if (!$this->cartItemBelongsToUser($shoppingCart)) {
            abort(403, 'Unauthorized action');
        }

        $shoppingCart->update([
            'quantity' => $request->quantity
        ]);

        $cartItems = $this->getCartItems();
        $cartSummary = $this->getCartSummary($cartItems);

        return back()->with([
            'flash' => [
                'type' => 'success',
                'message' => 'Cart updated successfully'
            ]
        ]);
    }

    /**
     * Remove item from cart
     */
    public function destroy(ShoppingCart $shoppingCart)
    {
        // Ensure the cart item belongs to the current user/session
        if (!$this->cartItemBelongsToUser($shoppingCart)) {
            abort(403, 'Unauthorized action');
        }

        $shoppingCart->delete();

        return back()->with([
            'flash' => [
                'type' => 'success',
                'message' => 'Item removed from cart'
            ]
        ]);
    }

    /**
     * Clear all items from cart
     */
    public function clear()
    {
        $sessionId = $this->getSessionId();
        $userId = auth()->id();

        ShoppingCart::where(function ($query) use ($userId, $sessionId) {
            if ($userId) {
                $query->where('user_id', $userId);
            } else {
                $query->where('session_id', $sessionId);
            }
        })->delete();

        return redirect()->route('cart.index')->with([
            'flash' => [
                'type' => 'success',
                'message' => 'Cart cleared successfully'
            ]
        ]);
    }

    /**
     * Get cart count for badge
     */
    public function count()
    {
        return response()->json([
            'count' => $this->getCartCount()
        ]);
    }

    /**
     * Merge guest cart with user cart on login
     */
    public function mergeGuestCart(Request $request)
    {
        $guestSessionId = $request->get('guest_session_id');
        $userId = auth()->id();

        if (!$guestSessionId || !$userId) {
            return response()->json(['message' => 'Invalid parameters'], 400);
        }

        // Get guest cart items
        $guestCartItems = ShoppingCart::where('session_id', $guestSessionId)->get();

        foreach ($guestCartItems as $guestItem) {
            // Check if user already has this product in cart
            $userCartItem = ShoppingCart::where('user_id', $userId)
                ->where('product_id', $guestItem->product_id)
                ->first();

            if ($userCartItem) {
                // Merge quantities
                $userCartItem->update([
                    'quantity' => $userCartItem->quantity + $guestItem->quantity
                ]);
            } else {
                // Transfer to user cart
                $guestItem->update([
                    'user_id' => $userId,
                    'session_id' => null
                ]);
            }
        }

        // Delete any remaining guest cart items
        ShoppingCart::where('session_id', $guestSessionId)->delete();

        return response()->json([
            'message' => 'Cart merged successfully',
            'cartCount' => $this->getCartCount()
        ]);
    }

    /**
     * Helper: Get cart items for current user/session
     */
    private function getCartItems()
    {
        $sessionId = $this->getSessionId();
        $userId = auth()->id();

        return ShoppingCart::with(['product.images'])
            ->where(function ($query) use ($userId, $sessionId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('session_id', $sessionId);
                }
            })
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Helper: Get cart summary
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
     * Helper: Get cart count
     */
    private function getCartCount()
    {
        $sessionId = $this->getSessionId();
        $userId = auth()->id();

        return ShoppingCart::where(function ($query) use ($userId, $sessionId) {
            if ($userId) {
                $query->where('user_id', $userId);
            } else {
                $query->where('session_id', $sessionId);
            }
        })->sum('quantity');
    }

    /**
     * Helper: Get session ID for guest users
     */
    private function getSessionId()
    {
        return session()->getId();
    }

    /**
     * Apply coupon to cart
     */
    public function applyCoupon(Request $request)
    {
        $request->validate([
            'coupon_code' => 'required|string|max:50'
        ]);

        $couponCode = strtoupper(trim($request->coupon_code));
        
        // Find the coupon
        $coupon = Coupon::where('code', $couponCode)
            ->where('status', 'active')
            ->first();

        if (!$coupon) {
            return back()->withErrors([
                'coupon_code' => 'Invalid coupon code.'
            ]);
        }

        // Get current cart total for validation
        $cartItems = $this->getCartItems();
        $subtotal = $cartItems->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });

        // Validate coupon for current cart
        $validationResult = $coupon->validateForCart($cartItems->toArray(), $subtotal);
        
        if (!$validationResult['valid']) {
            return back()->withErrors([
                'coupon_code' => $validationResult['message']
            ]);
        }

        // Store coupon in session
        Session::put('applied_coupon', [
            'code' => $coupon->code,
            'discount_type' => $coupon->type,
            'discount_value' => $coupon->value
        ]);

        return back()->with('success', 'Coupon applied successfully!');
    }

    /**
     * Remove coupon from cart
     */
    public function removeCoupon()
    {
        Session::forget('applied_coupon');
        return back()->with('success', 'Coupon removed successfully!');
    }

    /**
     * Helper: Check if cart item belongs to current user/session
     */
    private function cartItemBelongsToUser(ShoppingCart $cartItem)
    {
        $userId = auth()->id();
        $sessionId = $this->getSessionId();

        if ($userId) {
            return $cartItem->user_id === $userId;
        } else {
            return $cartItem->session_id === $sessionId;
        }
    }
}
