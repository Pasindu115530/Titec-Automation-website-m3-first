<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ServiceController;

// Registration route — 3 attempts per minute to prevent account spam
Route::middleware('throttle:3,1')->post('/register', [AuthController::class, 'register']);

// Login route — 5 attempts per minute to prevent brute-force attacks
Route::middleware('throttle:5,1')->post('/login', [AuthController::class, 'login']);

// Public read routes — 60 requests per minute per IP
// Generous enough for normal browsing and crawlers, but bounded against floods
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{project}', [ProjectController::class, 'show']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/brands', [BrandController::class, 'index']);
    Route::get('/brands/{brand}', [BrandController::class, 'show']);
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/{slug}', [ServiceController::class, 'show']);
});

// Protected routes (any authenticated user)
Route::middleware('auth:sanctum')->group(function () {
// Route::group([], function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Admin-only routes — requires 'admin' role
    Route::middleware('admin')->group(function () {
        // Project routes (admin only)
        Route::post('/projects', [ProjectController::class, 'store']);
        Route::put('/projects/{project}', [ProjectController::class, 'update']);
        Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);

        // Product routes (admin only)
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);

        // Protected SuperAdmin Routes (admin only, hidden from retailer)
        Route::middleware('superadmin')->group(function () {
            // Brand routes (superadmin only)
        Route::post('/brands', [BrandController::class, 'store']);
        Route::put('/brands/{brand}', [BrandController::class, 'update']);
        Route::delete('/brands/{brand}', [BrandController::class, 'destroy']);

        // Service routes (admin only)
        Route::post('/services', [ServiceController::class, 'store']);
        Route::put('/services/{service}', [ServiceController::class, 'update']);
        Route::delete('/services/{service}', [ServiceController::class, 'destroy']);

        // Quotation routes (admin only)
        Route::get('/quotations', [App\Http\Controllers\QuotationController::class, 'index']);
        Route::post('/quotations/preview', [App\Http\Controllers\QuotationController::class, 'preview']);
        Route::get('/quotations/{quotation}', [App\Http\Controllers\QuotationController::class, 'show']);
        Route::put('/quotations/{quotation}', [App\Http\Controllers\QuotationController::class, 'update']);
        
        // Quotation Requests (admin only)
        Route::get('/quotation-requests', [App\Http\Controllers\QuotationRequestController::class, 'index']);
        Route::post('/quotation-requests/{id}/reply', [App\Http\Controllers\QuotationRequestController::class, 'reply']);
        Route::post('/quotation-requests/direct', [App\Http\Controllers\QuotationRequestController::class, 'sendDirectQuote']);
        Route::get('/quotation-requests/{id}/download', [App\Http\Controllers\QuotationRequestController::class, 'download']);
        });
        
        // Dashboard Stats (admin & retailer)
        Route::get('/dashboard/stats', [App\Http\Controllers\DashboardController::class, 'index']);
    });
});

// Public store route for requests (can also be auth protected if needed, but currently public for simplicity or user/guest mix)
// If you want it protected, move inside, but "store" often needs to be accessible. Re-check logic. 
// Plan said: POST /quotation-requests (Public/Auth). Let's put it outside middleware for now or keep inside if user mandatory. 
// Store page says "Login if prompted", implying Auth. Let's put inside auth group for "User" requests, 
// OR allow guest. Controller has `auth()->id()`. If guest, it's null.
// Public form routes - Throttled to 3 requests per minute per IP to prevent spam/abuse
Route::middleware('throttle:3,1')->group(function () {
    Route::post('/quotation-requests', [App\Http\Controllers\QuotationRequestController::class, 'store']);
    Route::post('/contact', [App\Http\Controllers\ContactController::class, 'store']);
});
