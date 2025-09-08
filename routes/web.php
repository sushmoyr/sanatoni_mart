<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

// Public product browsing routes
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');
Route::get('/categories/{category}/products', [ProductController::class, 'byCategory'])->name('products.by-category');
Route::get('/search/products', [ProductController::class, 'search'])->name('products.search');

// Shopping cart routes (available for both guest and authenticated users)
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::put('/cart/{shoppingCart}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{shoppingCart}', [CartController::class, 'destroy'])->name('cart.destroy');
Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');
Route::get('/cart/count', [CartController::class, 'count'])->name('cart.count');

// Checkout routes (available for both guest and authenticated users)
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout/calculate-shipping', [CheckoutController::class, 'calculateShipping'])->name('checkout.calculate-shipping');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

// Order tracking for guests
Route::get('/track-order', [OrderController::class, 'trackForm'])->name('orders.track-form');
Route::post('/track-order', [OrderController::class, 'track'])->name('orders.track');

Route::get('/dashboard', function () {
    $user = auth()->user();
    
    // Redirect admin/manager users to admin dashboard
    if ($user && $user->hasAdminAccess()) {
        return redirect()->route('admin.dashboard');
    }
    
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Customer-specific authenticated routes
Route::middleware(['auth'])->group(function () {
    // Customer dashboard and profile
    Route::get('/customer/dashboard', [CustomerController::class, 'index'])->name('customer.dashboard');
    Route::get('/customer/profile', [CustomerController::class, 'show'])->name('customer.profile.show');
    Route::get('/customer/profile/edit', [CustomerController::class, 'edit'])->name('customer.profile.edit');
    Route::put('/customer/profile', [CustomerController::class, 'update'])->name('customer.profile.update');
    Route::delete('/customer/profile/picture', [CustomerController::class, 'deleteProfilePicture'])->name('customer.profile.delete-picture');
    
    // Customer settings
    Route::get('/customer/settings', [CustomerController::class, 'settings'])->name('customer.settings');
    Route::put('/customer/settings', [CustomerController::class, 'updateSettings'])->name('customer.settings.update');
    Route::post('/customer/deactivate', [CustomerController::class, 'deactivate'])->name('customer.deactivate');
    Route::delete('/customer/account', [CustomerController::class, 'destroy'])->name('customer.destroy');

    // Customer addresses
    Route::resource('addresses', AddressController::class);
    Route::put('/addresses/{address}/default', [AddressController::class, 'setDefault'])->name('addresses.set-default');

    // Wishlist management
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('/wishlist', [WishlistController::class, 'store'])->name('wishlist.store');
    Route::delete('/wishlist/{wishlist}', [WishlistController::class, 'destroy'])->name('wishlist.destroy');
    Route::post('/wishlist/toggle', [WishlistController::class, 'toggle'])->name('wishlist.toggle');
    Route::get('/wishlist/check/{product}', [WishlistController::class, 'check'])->name('wishlist.check');
    Route::post('/wishlist/{wishlist}/move-to-cart', [WishlistController::class, 'moveToCart'])->name('wishlist.move-to-cart');

    // Authenticated cart operations
    Route::post('/cart/merge-guest', [CartController::class, 'mergeGuestCart'])->name('cart.merge-guest');

    // Customer orders
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
    Route::post('/orders/{order}/reorder', [OrderController::class, 'reorder'])->name('orders.reorder');
});

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
