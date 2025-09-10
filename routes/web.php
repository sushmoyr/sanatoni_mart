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

// Admin panel redirect
Route::get('/admin', function () {
    if (auth()->check() && auth()->user()->hasRole(['admin', 'manager'])) {
        return redirect('/admin/dashboard');
    }
    return redirect('/admin/login');
})->name('admin.redirect');

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

// Public Content Routes
Route::get('/pages/{page:slug}', [App\Http\Controllers\PageController::class, 'show'])->name('pages.show');
Route::get('/pages/{page:slug}/preview', [App\Http\Controllers\PageController::class, 'preview'])->name('pages.preview');

// Public Blog Routes  
Route::get('/blog', [App\Http\Controllers\BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{post:slug}', [App\Http\Controllers\BlogController::class, 'show'])->name('blog.show');
Route::get('/blog/category/{category:slug}', [App\Http\Controllers\BlogController::class, 'byCategory'])->name('blog.category');
Route::get('/blog/tag/{tag:slug}', [App\Http\Controllers\BlogController::class, 'byTag'])->name('blog.tag');

// Admin Content Management Routes
Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified'])->group(function () {
    
    // Media Management
    Route::resource('media', App\Http\Controllers\Admin\MediaController::class);
    Route::post('media/bulk-action', [App\Http\Controllers\Admin\MediaController::class, 'bulkAction'])->name('media.bulk-action');
    Route::post('media/{media}/generate-thumbnail', [App\Http\Controllers\Admin\MediaController::class, 'generateThumbnail'])->name('media.generate-thumbnail');
    Route::get('media-selection', [App\Http\Controllers\Admin\MediaController::class, 'selection'])->name('media.selection');
    
    // Page Management
    Route::resource('pages', App\Http\Controllers\Admin\PageController::class);
    Route::post('pages/bulk-action', [App\Http\Controllers\Admin\PageController::class, 'bulkAction'])->name('pages.bulk-action');
    Route::post('pages/{page}/duplicate', [App\Http\Controllers\Admin\PageController::class, 'duplicate'])->name('pages.duplicate');
    Route::get('pages/{page}/preview', [App\Http\Controllers\Admin\PageController::class, 'preview'])->name('pages.preview');
    Route::post('pages/{page}/export', [App\Http\Controllers\Admin\PageController::class, 'export'])->name('pages.export');
    Route::post('pages/import', [App\Http\Controllers\Admin\PageController::class, 'import'])->name('pages.import');
    
    // Page Sections API
    Route::prefix('pages/{page}/sections')->name('pages.sections.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\PageController::class, 'getSections'])->name('index');
        Route::post('/', [App\Http\Controllers\Admin\PageController::class, 'addSection'])->name('store');
        Route::put('/{section}', [App\Http\Controllers\Admin\PageController::class, 'updateSection'])->name('update');
        Route::delete('/{section}', [App\Http\Controllers\Admin\PageController::class, 'deleteSection'])->name('destroy');
        Route::post('/reorder', [App\Http\Controllers\Admin\PageController::class, 'reorderSections'])->name('reorder');
    });
    
    // Blog Management
    Route::resource('blog', App\Http\Controllers\Admin\BlogController::class);
    Route::post('blog/bulk-action', [App\Http\Controllers\Admin\BlogController::class, 'bulkAction'])->name('blog.bulk-action');
    Route::post('blog/{post}/duplicate', [App\Http\Controllers\Admin\BlogController::class, 'duplicate'])->name('blog.duplicate');
    Route::get('blog/{post}/preview', [App\Http\Controllers\Admin\BlogController::class, 'preview'])->name('blog.preview');
    Route::get('blog/statistics', [App\Http\Controllers\Admin\BlogController::class, 'statistics'])->name('blog.statistics');
    
    // Blog Categories
    Route::resource('blog-categories', App\Http\Controllers\Admin\BlogCategoryController::class)->names([
        'index' => 'blog.categories.index',
        'create' => 'blog.categories.create',
        'store' => 'blog.categories.store',
        'show' => 'blog.categories.show',
        'edit' => 'blog.categories.edit',
        'update' => 'blog.categories.update',
        'destroy' => 'blog.categories.destroy'
    ]);
    Route::post('blog-categories/bulk-action', [App\Http\Controllers\Admin\BlogCategoryController::class, 'bulkAction'])->name('blog.categories.bulk-action');
    Route::post('blog-categories/reorder', [App\Http\Controllers\Admin\BlogCategoryController::class, 'reorder'])->name('blog.categories.reorder');
    Route::get('blog-categories/{category}/statistics', [App\Http\Controllers\Admin\BlogCategoryController::class, 'statistics'])->name('blog.categories.statistics');
    Route::get('blog-categories-api', [App\Http\Controllers\Admin\BlogCategoryController::class, 'api'])->name('blog.categories.api');
    
    // SEO Management
    Route::prefix('seo')->name('seo.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\SeoController::class, 'index'])->name('index');
        Route::post('/analyze', [App\Http\Controllers\Admin\SeoController::class, 'analyze'])->name('analyze');
        Route::post('/update-settings', [App\Http\Controllers\Admin\SeoController::class, 'updateSettings'])->name('update-settings');
        Route::post('/generate-sitemap', [App\Http\Controllers\Admin\SeoController::class, 'generateSitemap'])->name('generate-sitemap');
        Route::post('/preview-meta', [App\Http\Controllers\Admin\SeoController::class, 'previewMeta'])->name('preview-meta');
        Route::post('/optimize', [App\Http\Controllers\Admin\SeoController::class, 'optimize'])->name('optimize');
    });
    
});

// Language switching routes
Route::prefix('language')->name('language.')->group(function () {
    Route::post('/switch', [App\Http\Controllers\LanguageController::class, 'switch'])->name('switch');
    Route::get('/available', [App\Http\Controllers\LanguageController::class, 'available'])->name('available');
    Route::get('/settings', [App\Http\Controllers\LanguageController::class, 'settings'])->name('settings');
    Route::post('/settings', [App\Http\Controllers\LanguageController::class, 'updateSettings'])->name('settings.update');
});
