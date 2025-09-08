<?php

use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Product API routes
Route::get('/products/autocomplete', [ProductController::class, 'autocomplete'])->name('api.products.autocomplete');

// Routes that need session (for recently viewed functionality)
Route::middleware(['web'])->group(function () {
    Route::get('/products/recently-viewed', [ProductController::class, 'recentlyViewed'])->name('api.products.recently-viewed');
    Route::post('/products/{product}/track-view', [ProductController::class, 'trackView'])->name('api.products.track-view');
});
