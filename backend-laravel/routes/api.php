<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ServiceController;

// ═══════════════════════════════════════════════
// PUBLIC ROUTES (no authentication required)
// ═══════════════════════════════════════════════

Route::middleware('throttle:5,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{project}', [ProjectController::class, 'show']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/brands', [BrandController::class, 'index']);
Route::get('/brands/{brand}', [BrandController::class, 'show']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{slug}', [ServiceController::class, 'show']);

Route::middleware('throttle:3,1')->group(function () {
    Route::post('/quotation-requests', [App\Http\Controllers\QuotationRequestController::class, 'store']);
    Route::post('/contact', [App\Http\Controllers\ContactController::class, 'store']);
});

// ═══════════════════════════════════════════════
// AUTHENTICATED ROUTES
// ═══════════════════════════════════════════════

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        $user = $request->user();
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ]);
    });

    // ── Content Management ──────────────────────
    Route::middleware('permission:products.create')->post('/products', [ProductController::class, 'store']);
    Route::middleware('permission:products.edit')->put('/products/{product}', [ProductController::class, 'update']);
    Route::middleware('permission:products.delete')->delete('/products/{product}', [ProductController::class, 'destroy']);

    Route::middleware('permission:projects.create')->post('/projects', [ProjectController::class, 'store']);
    Route::middleware('permission:projects.edit')->put('/projects/{project}', [ProjectController::class, 'update']);
    Route::middleware('permission:projects.delete')->delete('/projects/{project}', [ProjectController::class, 'destroy']);

    Route::middleware('permission:brands.create')->post('/brands', [BrandController::class, 'store']);
    Route::middleware('permission:brands.edit')->put('/brands/{brand}', [BrandController::class, 'update']);
    Route::middleware('permission:brands.delete')->delete('/brands/{brand}', [BrandController::class, 'destroy']);

    Route::middleware('permission:services.create')->post('/services', [ServiceController::class, 'store']);
    Route::middleware('permission:services.edit')->put('/services/{service}', [ServiceController::class, 'update']);
    Route::middleware('permission:services.delete')->delete('/services/{service}', [ServiceController::class, 'destroy']);

    // ── Quotations ──────────────────────────────
    Route::middleware('permission:quotations.view')->group(function () {
        Route::get('/quotations', [App\Http\Controllers\QuotationController::class, 'index']);
        Route::get('/quotations/{quotation}', [App\Http\Controllers\QuotationController::class, 'show']);
        Route::get('/quotation-requests', [App\Http\Controllers\QuotationRequestController::class, 'index']);
        Route::get('/quotation-requests/{id}/download', [App\Http\Controllers\QuotationRequestController::class, 'download']);
    });
    Route::middleware('permission:quotations.reply')->group(function () {
        Route::post('/quotation-requests/{id}/reply', [App\Http\Controllers\QuotationRequestController::class, 'reply']);
        Route::post('/quotation-requests/direct', [App\Http\Controllers\QuotationRequestController::class, 'sendDirectQuote']);
        Route::post('/quotations/preview', [App\Http\Controllers\QuotationController::class, 'preview']);
        Route::put('/quotations/{quotation}', [App\Http\Controllers\QuotationController::class, 'update']);
    });

    // ── Dashboard ───────────────────────────────
    Route::middleware('permission:dashboard.view')->get('/dashboard/stats', [App\Http\Controllers\DashboardController::class, 'index']);
});
