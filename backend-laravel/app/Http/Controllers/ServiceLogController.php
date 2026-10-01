<?php

namespace App\Http\Controllers;

use App\Models\ServiceLog;
use App\Models\InvoiceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ServiceLogController extends Controller
{
    public function index(Request $request)
    {
        $query = ServiceLog::with(['client', 'product', 'technician']);
        return response()->json($query->latest()->paginate(15));
    }

    public function show(ServiceLog $serviceLog)
    {
        $serviceLog->load(['client', 'product', 'technician', 'invoiceItem']);
        return response()->json($serviceLog);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'invoice_item_id' => 'nullable|exists:invoice_items,id',
            'product_id' => 'nullable|exists:products,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'diagnosis' => 'nullable|string',
            'resolution' => 'nullable|string',
            'service_type' => 'required|in:maintenance,repair,inspection,warranty_claim,installation_followup',
            'service_charge' => 'nullable|numeric|min:0',
            'service_date' => 'required|date',
            'next_service_date' => 'nullable|date',
            'status' => 'nullable|in:pending,completed,requires_followup',
            'notes' => 'nullable|string',
        ]);

        $serviceLog = new ServiceLog($validated);
        $serviceLog->uuid = (string) Str::uuid();
        $serviceLog->technician_id = auth()->id() ?? 1;
        $serviceLog->status = $validated['status'] ?? 'pending';
        $serviceLog->service_charge = $validated['service_charge'] ?? 0;
        
        $serviceLog->checkWarranty(); // Auto-detect warranty status
        $serviceLog->save();

        return response()->json($serviceLog, 201);
    }

    public function update(Request $request, ServiceLog $serviceLog)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'diagnosis' => 'nullable|string',
            'resolution' => 'nullable|string',
            'service_type' => 'nullable|in:maintenance,repair,inspection,warranty_claim,installation_followup',
            'service_charge' => 'nullable|numeric|min:0',
            'service_date' => 'nullable|date',
            'next_service_date' => 'nullable|date',
            'status' => 'nullable|in:pending,completed,requires_followup',
            'notes' => 'nullable|string',
        ]);

        $serviceLog->update($validated);
        return response()->json($serviceLog);
    }

    public function batch(Request $request)
    {
        $request->validate([
            'logs' => 'required|array',
            'logs.*.uuid' => 'required|uuid',
            'logs.*.client_id' => 'required|exists:clients,id',
            'logs.*.title' => 'required|string|max:255',
            'logs.*.description' => 'required|string',
            'logs.*.service_type' => 'required|string',
            'logs.*.service_date' => 'required|date',
        ]);

        $results = [];

        foreach ($request->logs as $logData) {
            $existing = ServiceLog::where('uuid', $logData['uuid'])->first();
            if ($existing) {
                $results[] = [
                    'uuid' => $logData['uuid'],
                    'status' => 'already_exists',
                    'id' => $existing->id,
                ];
                continue;
            }

            try {
                $serviceLog = new ServiceLog($logData);
                $serviceLog->technician_id = auth()->id() ?? 1;
                $serviceLog->sync_status = 'synced';
                $serviceLog->checkWarranty();
                $serviceLog->save();

                $results[] = [
                    'uuid' => $logData['uuid'],
                    'status' => 'created',
                    'id' => $serviceLog->id,
                ];
            } catch (\Exception $e) {
                $results[] = [
                    'uuid' => $logData['uuid'],
                    'status' => 'error',
                    'message' => 'Failed to sync.',
                ];
            }
        }

        return response()->json(['message' => 'Batch sync completed.', 'results' => $results]);
    }

    // Warranty Endpoints

    public function checkWarranty(Request $request)
    {
        $query = InvoiceItem::with(['invoice.client']);

        if ($request->filled('serial_number')) {
            $query->where('serial_number', $request->serial_number);
        } elseif ($request->filled('client_id') && $request->filled('product_id')) {
            $query->where('product_id', $request->product_id)
                  ->whereHas('invoice', function ($q) use ($request) {
                      $q->where('client_id', $request->client_id);
                  });
        } else {
            return response()->json(['message' => 'Please provide serial_number or client_id and product_id'], 400);
        }

        $item = $query->latest('warranty_end_date')->first();

        if (!$item) {
            return response()->json(['message' => 'No warranty record found'], 404);
        }

        $isUnderWarranty = $item->isUnderWarranty();
        $daysRemaining = $isUnderWarranty && $item->warranty_end_date 
            ? now()->diffInDays($item->warranty_end_date, false) 
            : 0;

        return response()->json([
            'is_under_warranty' => $isUnderWarranty,
            'warranty_start_date' => $item->warranty_start_date,
            'warranty_end_date' => $item->warranty_end_date,
            'days_remaining' => max(0, (int) $daysRemaining),
            'invoice_number' => $item->invoice->invoice_number ?? null,
            'product_name' => $item->product_name,
            'client' => $item->invoice->client ?? null,
        ]);
    }

    public function expiringWarranties(Request $request)
    {
        $days = (int) $request->input('days', 30);
        $dateThreshold = now()->addDays($days);

        $items = InvoiceItem::with(['invoice.client'])
            ->whereNotNull('warranty_end_date')
            ->where('warranty_end_date', '>=', now())
            ->where('warranty_end_date', '<=', $dateThreshold)
            ->orderBy('warranty_end_date', 'asc')
            ->get();

        return response()->json($items);
    }
}
