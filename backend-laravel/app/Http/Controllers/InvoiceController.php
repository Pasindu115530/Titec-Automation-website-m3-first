<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Invoice::with('client');

        if ($request->filled('status')) {
            $query->status($request->status);
        }
        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }
        if ($request->filled('search')) {
            $query->where('invoice_number', 'like', "%{$request->search}%");
        }
        if ($request->filled('from') && $request->filled('to')) {
            $query->dateRange($request->from, $request->to);
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function show(Invoice $invoice)
    {
        $invoice->load(['client', 'items.product', 'createdBy']);
        return response()->json($invoice);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'tax_rate' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'discount_type' => 'nullable|in:fixed,percentage',
            'payment_method' => 'nullable|string',
            'notes' => 'nullable|string',
            'terms' => 'nullable|string',
            'due_date' => 'nullable|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.serial_number' => 'nullable|string',
            'items.*.warranty_months' => 'nullable|integer|min:0',
            'items.*.notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $invoice = Invoice::create([
                'client_id' => $validated['client_id'],
                'created_by' => auth()->id() ?? 1, // fallback for testing
                'status' => 'draft',
                'tax_rate' => $validated['tax_rate'] ?? 0,
                'discount_amount' => $validated['discount_amount'] ?? 0,
                'discount_type' => $validated['discount_type'] ?? 'fixed',
                'payment_method' => $validated['payment_method'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'terms' => $validated['terms'] ?? null,
                'due_date' => $validated['due_date'] ?? null,
            ]);

            foreach ($validated['items'] as $itemData) {
                $product = Product::find($itemData['product_id']);
                $warrantyMonths = $itemData['warranty_months'] ?? $product->warranty_months;

                $invoice->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_model' => $product->model_number,
                    'product_sku' => $product->sku,
                    'serial_number' => $itemData['serial_number'] ?? null,
                    'unit_price' => $itemData['unit_price'],
                    'quantity' => $itemData['quantity'],
                    'unit' => $product->unit ?? 'pcs',
                    'warranty_months' => $warrantyMonths,
                    'notes' => $itemData['notes'] ?? null,
                ]);
            }

            $invoice->calculateTotals();
            $invoice->save();
            DB::commit();

            return response()->json($invoice->load('items'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create invoice.', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, Invoice $invoice)
    {
        if ($invoice->status !== 'draft') {
            return response()->json(['message' => 'Only draft invoices can be updated.'], 422);
        }

        $validated = $request->validate([
            'tax_rate' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'discount_type' => 'nullable|in:fixed,percentage',
            'payment_method' => 'nullable|string',
            'notes' => 'nullable|string',
            'terms' => 'nullable|string',
            'due_date' => 'nullable|date',
            'items' => 'sometimes|array|min:1',
            'items.*.product_id' => 'required_with:items|exists:products,id',
            'items.*.quantity' => 'required_with:items|integer|min:1',
            'items.*.unit_price' => 'required_with:items|numeric|min:0',
            'items.*.serial_number' => 'nullable|string',
            'items.*.warranty_months' => 'nullable|integer|min:0',
            'items.*.notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $invoice->update([
                'tax_rate' => $validated['tax_rate'] ?? $invoice->tax_rate,
                'discount_amount' => $validated['discount_amount'] ?? $invoice->discount_amount,
                'discount_type' => $validated['discount_type'] ?? $invoice->discount_type,
                'payment_method' => $validated['payment_method'] ?? $invoice->payment_method,
                'notes' => $validated['notes'] ?? $invoice->notes,
                'terms' => $validated['terms'] ?? $invoice->terms,
                'due_date' => $validated['due_date'] ?? $invoice->due_date,
            ]);

            if (isset($validated['items'])) {
                $invoice->items()->delete();
                foreach ($validated['items'] as $itemData) {
                    $product = Product::find($itemData['product_id']);
                    $warrantyMonths = $itemData['warranty_months'] ?? $product->warranty_months;

                    $invoice->items()->create([
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'product_model' => $product->model_number,
                        'product_sku' => $product->sku,
                        'serial_number' => $itemData['serial_number'] ?? null,
                        'unit_price' => $itemData['unit_price'],
                        'quantity' => $itemData['quantity'],
                        'unit' => $product->unit ?? 'pcs',
                        'warranty_months' => $warrantyMonths,
                        'notes' => $itemData['notes'] ?? null,
                    ]);
                }
            }

            $invoice->calculateTotals();
            $invoice->save();
            DB::commit();

            return response()->json($invoice->load('items'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update invoice.'], 500);
        }
    }

    public function confirm(Invoice $invoice)
    {
        if ($invoice->status !== 'draft') {
            return response()->json(['message' => 'Only draft invoices can be confirmed.'], 422);
        }

        DB::transaction(function () use ($invoice) {
            foreach ($invoice->items as $item) {
                if ($item->product_id) {
                    $product = Product::lockForUpdate()->find($item->product_id);
                    if ($product->stock < $item->quantity) {
                        throw new \Exception("Insufficient stock for {$product->name}. Available: {$product->stock}, Requested: {$item->quantity}");
                    }
                }
            }

            foreach ($invoice->items as $item) {
                if ($item->product_id) {
                    $product = Product::find($item->product_id);
                    $product->deductStock($item->quantity, auth()->id() ?? 1, $invoice->id);
                }
                $item->setWarrantyDates(now());
                $item->save();
            }

            $invoice->update(['status' => 'confirmed']);
        });

        return response()->json([
            'message' => 'Invoice confirmed. Stock has been deducted.',
            'data' => $invoice->fresh(['items', 'client']),
        ]);
    }

    public function payment(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'payment_date' => 'required|date',
        ]);

        if (in_array($invoice->status, ['draft', 'void', 'paid'])) {
            return response()->json(['message' => 'Cannot apply payment to this invoice.'], 422);
        }

        $newPaidAmount = $invoice->amount_paid + $validated['amount'];
        $status = $newPaidAmount >= $invoice->grand_total ? 'paid' : 'partially_paid';

        $invoice->update([
            'amount_paid' => $newPaidAmount,
            'payment_method' => $validated['payment_method'],
            'payment_date' => $validated['payment_date'],
            'status' => $status,
        ]);

        return response()->json($invoice);
    }

    public function void(Invoice $invoice)
    {
        if (!in_array($invoice->status, ['confirmed', 'paid', 'partially_paid'])) {
            return response()->json(['message' => 'Cannot void this invoice.'], 422);
        }

        DB::transaction(function () use ($invoice) {
            foreach ($invoice->items as $item) {
                if ($item->product_id) {
                    $product = Product::find($item->product_id);
                    $product->restoreStock($item->quantity, auth()->id() ?? 1, $invoice->id);
                }
            }
            $invoice->update(['status' => 'void']);
        });

        return response()->json(['message' => 'Invoice voided. Stock has been restored.']);
    }

    public function generatePdf(Invoice $invoice)
    {
        $invoice->load(['client', 'items.product', 'createdBy']);

        $pdf = Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice,
            'company' => config('company'),
        ]);

        $filename = "invoice_{$invoice->invoice_number}.pdf";
        $path = "invoices/{$filename}";

        Storage::disk('public')->put($path, $pdf->output());
        $invoice->update(['pdf_path' => $path]);

        return $pdf->download($filename);
    }

    public function batch(Request $request)
    {
        $request->validate([
            'invoices' => 'required|array',
            'invoices.*.uuid' => 'required|uuid',
            'invoices.*.client_id' => 'required|exists:clients,id',
            'invoices.*.items' => 'required|array|min:1',
        ]);

        $results = [];

        foreach ($request->invoices as $invoiceData) {
            $existing = Invoice::where('uuid', $invoiceData['uuid'])->first();
            if ($existing) {
                $results[] = [
                    'uuid' => $invoiceData['uuid'],
                    'status' => 'already_exists',
                    'invoice_id' => $existing->id,
                    'invoice_number' => $existing->invoice_number,
                ];
                continue;
            }

            DB::beginTransaction();
            try {
                $invoice = Invoice::create([
                    'uuid' => $invoiceData['uuid'],
                    'client_id' => $invoiceData['client_id'],
                    'created_by' => auth()->id() ?? 1,
                    'status' => 'draft',
                    'tax_rate' => $invoiceData['tax_rate'] ?? 0,
                    'discount_amount' => $invoiceData['discount_amount'] ?? 0,
                    'discount_type' => $invoiceData['discount_type'] ?? 'fixed',
                    'payment_method' => $invoiceData['payment_method'] ?? null,
                    'notes' => $invoiceData['notes'] ?? null,
                    'sync_status' => 'synced',
                    'synced_at' => now(),
                ]);

                foreach ($invoiceData['items'] as $itemData) {
                    $product = Product::find($itemData['product_id']);
                    $warrantyMonths = $itemData['warranty_months'] ?? ($product?->warranty_months ?? 0);

                    $invoice->items()->create([
                        'product_id' => $itemData['product_id'],
                        'product_name' => $product?->name ?? $itemData['product_name'] ?? 'Unknown',
                        'product_model' => $product?->model_number ?? null,
                        'product_sku' => $product?->sku ?? null,
                        'serial_number' => $itemData['serial_number'] ?? null,
                        'unit_price' => $itemData['unit_price'],
                        'quantity' => $itemData['quantity'],
                        'unit' => $itemData['unit'] ?? 'pcs',
                        'warranty_months' => $warrantyMonths,
                    ]);
                }

                $invoice->calculateTotals();
                $invoice->save();
                DB::commit();

                $results[] = [
                    'uuid' => $invoiceData['uuid'],
                    'status' => 'created',
                    'invoice_id' => $invoice->id,
                    'invoice_number' => $invoice->invoice_number,
                ];
            } catch (\Exception $e) {
                DB::rollBack();
                $results[] = [
                    'uuid' => $invoiceData['uuid'],
                    'status' => 'error',
                    'message' => 'Failed to create invoice.',
                ];
            }
        }

        return response()->json(['message' => 'Batch sync completed.', 'results' => $results]);
    }
}
