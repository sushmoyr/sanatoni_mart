<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use Illuminate\Support\Facades\Route;

// Admin routes - requires authentication and admin/manager roles
Route::middleware(['auth', 'role:admin,manager'])->prefix('admin')->name('admin.')->group(function () {
    
    // Admin Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Category Management - Admin and Manager
    Route::resource('categories', CategoryController::class);
    
    // Product Management - Admin and Manager
    Route::resource('products', ProductController::class);
    
    // User Management - Admin only
    Route::middleware('role:admin')->group(function () {
        Route::resource('users', UserController::class);
    });
    
    // Future admin routes will be added here as we progress through milestones
    // Route::resource('orders', OrderController::class);
    // etc.
});
