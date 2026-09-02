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

    // ═══════════════════════════════════════════════
    // NEW ERP CORE MODULES
    // ═══════════════════════════════════════════════

    // ── Clients ──────────────────────────────────
    Route::middleware('permission:clients.view')->group(function () {
        Route::get('/clients', [\App\Http\Controllers\ClientController::class, 'index']);
        Route::get('/clients/{client}', [\App\Http\Controllers\ClientController::class, 'show']);
        Route::get('/clients/{client}/history', [\App\Http\Controllers\ClientController::class, 'history']);
    });
    Route::middleware('permission:clients.create')->post('/clients', [\App\Http\Controllers\ClientController::class, 'store']);
    Route::middleware('permission:clients.edit')->put('/clients/{client}', [\App\Http\Controllers\ClientController::class, 'update']);
    Route::middleware('permission:clients.delete')->delete('/clients/{client}', [\App\Http\Controllers\ClientController::class, 'destroy']);

    // ── Invoices ─────────────────────────────────
    Route::middleware('permission:invoices.view')->group(function () {
        Route::get('/invoices', [\App\Http\Controllers\InvoiceController::class, 'index']);
        Route::get('/invoices/{invoice}', [\App\Http\Controllers\InvoiceController::class, 'show']);
        Route::get('/invoices/{invoice}/pdf', [\App\Http\Controllers\InvoiceController::class, 'generatePdf']);
    });
    Route::middleware('permission:invoices.create')->group(function () {
        Route::post('/invoices', [\App\Http\Controllers\InvoiceController::class, 'store']);
        Route::post('/invoices/batch', [\App\Http\Controllers\InvoiceController::class, 'batch']);
    });
    Route::middleware('permission:invoices.edit')->group(function () {
        Route::put('/invoices/{invoice}', [\App\Http\Controllers\InvoiceController::class, 'update']);
        Route::post('/invoices/{invoice}/confirm', [\App\Http\Controllers\InvoiceController::class, 'confirm']);
        Route::post('/invoices/{invoice}/payment', [\App\Http\Controllers\InvoiceController::class, 'payment']);
        Route::post('/invoices/{invoice}/void', [\App\Http\Controllers\InvoiceController::class, 'void']);
    });

    // ── Inventory ────────────────────────────────
    Route::middleware('permission:inventory.view')->group(function () {
        Route::get('/inventory', [\App\Http\Controllers\InventoryController::class, 'index']);
        Route::get('/inventory/{product}/movements', [\App\Http\Controllers\InventoryController::class, 'movements']);
    });
    Route::middleware('permission:inventory.adjust')->post('/inventory/{product}/adjust', [\App\Http\Controllers\InventoryController::class, 'adjust']);
    Route::middleware('permission:inventory.receive')->post('/inventory/{product}/receive', [\App\Http\Controllers\InventoryController::class, 'receive']);

    // ── Installations ────────────────────────────
    Route::get('/my-installations', [\App\Http\Controllers\InstallationController::class, 'myInstallations']); // Technician specific
    
    Route::middleware('permission:installations.view')->group(function () {
        Route::get('/installations', [\App\Http\Controllers\InstallationController::class, 'index']);
        Route::get('/installations/{installation}', [\App\Http\Controllers\InstallationController::class, 'show']);
    });
    Route::middleware('permission:installations.create')->post('/installations', [\App\Http\Controllers\InstallationController::class, 'store']);
    Route::middleware('permission:installations.edit')->group(function () {
        Route::put('/installations/{installation}', [\App\Http\Controllers\InstallationController::class, 'update']);
        Route::post('/installations/{installation}/assign', [\App\Http\Controllers\InstallationController::class, 'assign']);
    });
    Route::middleware('permission:installations.update_status')->group(function () {
        Route::patch('/installations/{installation}/status', [\App\Http\Controllers\InstallationController::class, 'updateStatus']);
        Route::post('/installations/{installation}/notes', [\App\Http\Controllers\InstallationController::class, 'addNote']);
    });

    // ── Service Logs & Warranty ──────────────────
    Route::middleware('permission:service_logs.view')->group(function () {
        Route::get('/service-logs', [\App\Http\Controllers\ServiceLogController::class, 'index']);
        Route::get('/service-logs/{serviceLog}', [\App\Http\Controllers\ServiceLogController::class, 'show']);
        Route::get('/warranty/check', [\App\Http\Controllers\ServiceLogController::class, 'checkWarranty']);
        Route::get('/warranty/expiring', [\App\Http\Controllers\ServiceLogController::class, 'expiringWarranties']);
    });
    Route::middleware('permission:service_logs.create')->group(function () {
        Route::post('/service-logs', [\App\Http\Controllers\ServiceLogController::class, 'store']);
        Route::post('/service-logs/batch', [\App\Http\Controllers\ServiceLogController::class, 'batch']);
    });
    Route::middleware('permission:service_logs.edit')->put('/service-logs/{serviceLog}', [\App\Http\Controllers\ServiceLogController::class, 'update']);
});
