<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\ShippingZoneController;
use App\Http\Controllers\Admin\FlashSaleController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\NewsletterController;
use App\Http\Controllers\Admin\SliderController;
use App\Http\Controllers\Admin\ProductReviewController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

// Admin login routes (for non-authenticated users)
Route::middleware('guest')->prefix('admin')->name('admin.')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

// Admin routes - requires authentication and admin/manager roles
Route::middleware(['auth', 'role:admin,manager'])->prefix('admin')->name('admin.')->group(function () {
    
    // Admin Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Category Management - Admin and Manager
    Route::resource('categories', CategoryController::class);
    
    // Product Management - Admin and Manager
    Route::resource('products', ProductController::class);
    
    // Product Image Management
    Route::post('products/upload-image', [ProductController::class, 'uploadImage'])->name('products.upload-image');
    Route::delete('products/delete-image', [ProductController::class, 'deleteImage'])->name('products.delete-image');
    Route::put('products/update-image', [ProductController::class, 'updateImage'])->name('products.update-image');
    
    // Slider Management - Admin and Manager
    Route::resource('sliders', SliderController::class);
    Route::post('sliders/bulk-action', [SliderController::class, 'bulkAction'])->name('sliders.bulk-action');
    Route::post('sliders/reorder', [SliderController::class, 'reorder'])->name('sliders.reorder');
    
    // Reports
    Route::get('reports/dashboard', [ReportController::class, 'dashboard'])->name('reports.dashboard');
    Route::get('reports/sales', [ReportController::class, 'salesOverview'])->name('reports.sales');
    Route::get('reports/orders', [ReportController::class, 'orderAnalytics'])->name('reports.orders');
    Route::get('reports/inventory', [ReportController::class, 'inventory'])->name('reports.inventory');
    Route::get('reports/inventory-alerts', [ReportController::class, 'inventoryAlerts'])->name('reports.inventory-alerts');
    
    // Order Management - Admin and Manager
    Route::resource('orders', OrderController::class)->except(['store']);
    Route::post('orders/{order}/update-status', [OrderController::class, 'updateStatus'])->name('orders.update-status');
    Route::get('orders/{order}/invoice', [OrderController::class, 'invoice'])->name('orders.invoice');
    Route::get('orders/export/{format}', [OrderController::class, 'export'])->name('orders.export');
    
    // Shipping Zone Management - Admin and Manager
    Route::resource('shipping-zones', ShippingZoneController::class);
    Route::post('shipping-zones/{shippingZone}/toggle-status', [ShippingZoneController::class, 'toggleStatus'])->name('shipping-zones.toggle-status');
    Route::post('shipping-zones/test-area', [ShippingZoneController::class, 'testArea'])->name('shipping-zones.test-area');
    
    // Flash Sales Management - Admin and Manager
    Route::resource('flash-sales', FlashSaleController::class);
    Route::post('flash-sales/{flashSale}/toggle-status', [FlashSaleController::class, 'toggleStatus'])->name('flash-sales.toggle-status');
    Route::get('flash-sales/active/api', [FlashSaleController::class, 'getActive'])->name('flash-sales.active');
    
    // Coupon Management - Admin and Manager
    Route::resource('coupons', CouponController::class);
    Route::post('coupons/{coupon}/toggle-status', [CouponController::class, 'toggleStatus'])->name('coupons.toggle-status');
    Route::post('coupons/validate', [CouponController::class, 'validateCoupon'])->name('coupons.validate');
    Route::get('coupons/generate-code', [CouponController::class, 'generateCode'])->name('coupons.generate-code');
    
    // Newsletter Management - Admin and Manager
    Route::resource('newsletters', NewsletterController::class);
    Route::post('newsletters/{newsletter}/send-now', [NewsletterController::class, 'sendNow'])->name('newsletters.send-now');
    Route::post('newsletters/{newsletter}/duplicate', [NewsletterController::class, 'duplicate'])->name('newsletters.duplicate');
    Route::get('newsletters/{newsletter}/preview', [NewsletterController::class, 'preview'])->name('newsletters.preview');
    Route::get('newsletters/analytics/subscribers', [NewsletterController::class, 'subscriberAnalytics'])->name('newsletters.subscriber-analytics');
    
    // Product Review Management - Admin and Manager
    Route::resource('reviews', App\Http\Controllers\Admin\ProductReviewController::class)->only(['index', 'show', 'destroy']);
    Route::post('reviews/{review}/approve', [App\Http\Controllers\Admin\ProductReviewController::class, 'approve'])->name('reviews.approve');
    Route::post('reviews/{review}/reject', [App\Http\Controllers\Admin\ProductReviewController::class, 'reject'])->name('reviews.reject');
    Route::post('reviews/bulk-approve', [App\Http\Controllers\Admin\ProductReviewController::class, 'bulkApprove'])->name('reviews.bulk-approve');
    Route::post('reviews/bulk-reject', [App\Http\Controllers\Admin\ProductReviewController::class, 'bulkReject'])->name('reviews.bulk-reject');
    Route::get('reviews/statistics', [App\Http\Controllers\Admin\ProductReviewController::class, 'statistics'])->name('reviews.statistics');
    
    // User Management - Admin only
    Route::middleware('role:admin')->group(function () {
        Route::resource('users', UserController::class);
    });
    
    // Future admin routes will be added here as we progress through milestones
    // Route::resource('invoices', InvoiceController::class);
    // etc.
});
