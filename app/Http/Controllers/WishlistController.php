<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WishlistController extends Controller
{
    /**
     * Display user's wishlist
     */
    public function index()
    {
        $wishlistItems = auth()->user()->wishlists()
            ->with(['product.images'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Wishlist/Index', [
            'wishlistItems' => $wishlistItems
        ]);
    }

    /**
     * Add product to wishlist
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        $user = auth()->user();
        $productId = $request->product_id;

        // Check if already in wishlist
        if ($user->hasInWishlist($productId)) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Product is already in your wishlist',
                    'inWishlist' => true
                ], 409);
            }
            
            return back()->with('error', 'Product is already in your wishlist');
        }

        // Add to wishlist
        $wishlistItem = $user->wishlists()->create([
            'product_id' => $productId
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Product added to wishlist',
                'inWishlist' => true,
                'wishlistItem' => $wishlistItem
            ]);
        }

        return back()->with('success', 'Product added to wishlist');
    }

    /**
     * Remove product from wishlist
     */
    public function destroy(Wishlist $wishlist)
    {
        // Ensure the wishlist item belongs to the authenticated user
        if ($wishlist->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action');
        }

        $wishlist->delete();

        if (request()->expectsJson()) {
            return response()->json([
                'message' => 'Product removed from wishlist',
                'inWishlist' => false
            ]);
        }

        return back()->with('success', 'Product removed from wishlist');
    }

    /**
     * Toggle product in wishlist (add if not present, remove if present)
     */
    public function toggle(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        $user = auth()->user();
        $productId = $request->product_id;

        $wishlistItem = $user->wishlists()->where('product_id', $productId)->first();

        if ($wishlistItem) {
            // Remove from wishlist
            $wishlistItem->delete();
            return response()->json([
                'message' => 'Product removed from wishlist',
                'inWishlist' => false
            ]);
        } else {
            // Add to wishlist
            $wishlistItem = $user->wishlists()->create([
                'product_id' => $productId
            ]);
            return response()->json([
                'message' => 'Product added to wishlist',
                'inWishlist' => true,
                'wishlistItem' => $wishlistItem
            ]);
        }
    }

    /**
     * Check if product is in user's wishlist
     */
    public function check(Product $product)
    {
        if (!auth()->check()) {
            return response()->json(['inWishlist' => false]);
        }

        $inWishlist = auth()->user()->hasInWishlist($product->id);

        return response()->json(['inWishlist' => $inWishlist]);
    }

    /**
     * Move wishlist item to cart
     */
    public function moveToCart(Wishlist $wishlist)
    {
        // Ensure the wishlist item belongs to the authenticated user
        if ($wishlist->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action');
        }

        $user = auth()->user();
        
        // Check if product is already in cart
        if ($user->hasInCart($wishlist->product_id)) {
            return response()->json([
                'message' => 'Product is already in your cart'
            ], 409);
        }

        // Add to cart
        $user->cartItems()->create([
            'product_id' => $wishlist->product_id,
            'quantity' => 1
        ]);

        // Remove from wishlist
        $wishlist->delete();

        return response()->json([
            'message' => 'Product moved to cart successfully'
        ]);
    }
}
