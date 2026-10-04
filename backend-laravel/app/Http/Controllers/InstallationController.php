<?php

namespace App\Http\Controllers;

use App\Models\Installation;
use App\Models\InstallationNote;
use App\Models\InvoiceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InstallationController extends Controller
{
    public function index(Request $request)
    {
        $query = Installation::with(['client', 'technicians']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }
        if ($request->filled('technician_id')) {
            $query->assignedTo($request->technician_id);
        }
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }
        if ($request->filled('from') && $request->filled('to')) {
            $query->whereBetween('scheduled_date', [$request->from, $request->to]);
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function myInstallations(Request $request)
    {
        $query = Installation::with(['client', 'technicians'])
            ->assignedTo(auth()->id() ?? 1); // fallback for testing

        return response()->json($query->latest()->paginate(15));
    }

    public function show(Installation $installation)
    {
        $installation->load(['client', 'invoice', 'technicians', 'notes.user', 'notes.reviewedByUser']);
        return response()->json($installation);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'invoice_id' => 'nullable|exists:invoices,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'required|string',
            'location_coordinates' => 'nullable|string',
            'scheduled_date' => 'nullable|date',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'notes' => 'nullable|string',
            'technicians' => 'nullable|array',
            'technicians.*' => 'exists:users,id',
        ]);

        DB::beginTransaction();
        try {
            $installation = Installation::create([
                'client_id' => $validated['client_id'],
                'invoice_id' => $validated['invoice_id'] ?? null,
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'location' => $validated['location'],
                'location_coordinates' => $validated['location_coordinates'] ?? null,
                'scheduled_date' => $validated['scheduled_date'] ?? null,
                'priority' => $validated['priority'] ?? 'medium',
                'notes' => $validated['notes'] ?? null,
            ]);

            if (!empty($validated['technicians'])) {
                $syncData = [];
                foreach ($validated['technicians'] as $index => $techId) {
                    $syncData[$techId] = ['role' => $index === 0 ? 'lead' : 'assistant'];
                }
                $installation->technicians()->sync($syncData);
            }
            DB::commit();

            return response()->json($installation->load('technicians'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create installation.'], 500);
        }
    }

    public function update(Request $request, Installation $installation)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'location' => 'nullable|string',
            'location_coordinates' => 'nullable|string',
            'scheduled_date' => 'nullable|date',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'notes' => 'nullable|string',
        ]);

        $installation->update($validated);
        return response()->json($installation);
    }

    public function updateStatus(Request $request, Installation $installation)
    {
        $validated = $request->validate([
            'status' => 'required|in:scheduled,in_progress,completed,on_hold,cancelled',
        ]);

        $updates = ['status' => $validated['status']];
        if ($validated['status'] === 'in_progress' && !$installation->started_date) {
            $updates['started_date'] = now();
        } elseif ($validated['status'] === 'completed' && !$installation->completed_date) {
            $updates['completed_date'] = now();
        }

        $installation->update($updates);

        activity()
            ->causedBy(auth()->user())
            ->performedOn($installation)
            ->useLog('installations')
            ->log("Installation #{$installation->reference_number} status → {$validated['status']}");

        return response()->json($installation);
    }

    public function addNote(Request $request, Installation $installation)
    {
        $type = $request->input('type', 'progress');

        // ── Build dynamic validation rules per type ──
        $rules = [
            'content'          => 'required|string',
            'type'             => 'required|in:progress,completion,extra_cost,defect,additional_parts',
            'cost_description' => 'nullable|string|max:255',
        ];

        // Image requirement varies by type
        $requiresImage  = in_array($type, ['completion', 'extra_cost', 'defect']);
        $rules['images']   = $requiresImage ? 'required|array|min:1' : 'nullable|array';
        $rules['images.*'] = 'image|max:5120'; // 5MB per image

        // Cost requirement varies by type
        $requiresCost = in_array($type, ['extra_cost', 'additional_parts']);
        $rules['cost_amount'] = $requiresCost ? 'required|numeric|min:0.01' : 'nullable|numeric|min:0';

        $validated = $request->validate($rules);

        // ── Store all uploaded images ────────────────
        $attachments = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $attachments[] = $image->store('notes', 'public');
            }
        }
        // Also handle legacy single 'image' field for backward compat
        if (empty($attachments) && $request->hasFile('image')) {
            $attachments[] = $request->file('image')->store('notes', 'public');
        }

        // ── Determine review status ─────────────────
        $reviewStatus = in_array($type, InstallationNote::REVIEWABLE_TYPES) ? 'pending' : null;

        $note = $installation->notes()->create([
            'user_id'          => auth()->id() ?? 1,
            'content'          => $validated['content'],
            'type'             => $type,
            'attachments'      => empty($attachments) ? null : $attachments,
            'cost_amount'      => $validated['cost_amount'] ?? null,
            'cost_description' => $validated['cost_description'] ?? null,
            'review_status'    => $reviewStatus,
        ]);

        $note->load('user');

        return response()->json($note, 201);
    }

    /**
     * Accountant reviews a financial note (approve / reject).
     * On approval with cost, auto-creates an adjustment InvoiceItem on the linked Invoice.
     */
    public function reviewNote(Request $request, Installation $installation, InstallationNote $note)
    {
        // Ensure the note belongs to this installation
        if ($note->installation_id !== $installation->id) {
            return response()->json(['message' => 'Note does not belong to this installation.'], 404);
        }

        if ($note->review_status !== 'pending') {
            return response()->json(['message' => 'This note has already been reviewed.'], 422);
        }

        $validated = $request->validate([
            'action'           => 'required|in:approve,reject',
            'rejection_reason' => 'required_if:action,reject|nullable|string|max:500',
        ]);

        DB::beginTransaction();
        try {
            $note->update([
                'review_status'    => $validated['action'] === 'approve' ? 'approved' : 'rejected',
                'reviewed_by'      => auth()->id(),
                'reviewed_at'      => now(),
                'rejection_reason' => $validated['action'] === 'reject' ? $validated['rejection_reason'] : null,
            ]);

            // ── Auto-add to linked Invoice on approval ──
            if ($validated['action'] === 'approve' && $note->cost_amount > 0 && $installation->invoice_id) {
                $typeLabels = [
                    'extra_cost'       => 'Extra Cost',
                    'defect'           => 'Defect Repair',
                    'additional_parts' => 'Additional Parts',
                ];
                $label = $typeLabels[$note->type] ?? 'Adjustment';
                $description = $note->cost_description
                    ? "{$label}: {$note->cost_description}"
                    : "{$label} — {$installation->reference_number}";

                InvoiceItem::create([
                    'invoice_id'   => $installation->invoice_id,
                    'product_id'   => null,
                    'product_name' => $description,
                    'quantity'     => 1,
                    'unit_price'   => $note->cost_amount,
                    'line_total'   => $note->cost_amount,
                ]);

                // Recalculate invoice totals
                $invoice = $installation->invoice;
                if ($invoice) {
                    $invoice->calculateTotals();
                    $invoice->save();
                }
            }

            DB::commit();

            $note->load(['user', 'reviewedByUser']);
            return response()->json($note);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to review note.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * List all notes pending accountant review (across all installations).
     */
    public function pendingReviews(Request $request)
    {
        $notes = InstallationNote::with(['installation.client', 'user'])
            ->pendingReview()
            ->latest()
            ->paginate(20);

        return response()->json($notes);
    }

    public function assign(Request $request, Installation $installation)
    {
        $validated = $request->validate([
            'technicians' => 'required|array',
            'technicians.*.user_id' => 'required|exists:users,id',
            'technicians.*.role' => 'required|in:lead,assistant',
        ]);

        $syncData = [];
        foreach ($validated['technicians'] as $tech) {
            $syncData[$tech['user_id']] = ['role' => $tech['role']];
        }

        $installation->technicians()->sync($syncData);

        activity()
            ->causedBy(auth()->user())
            ->performedOn($installation)
            ->useLog('installations')
            ->log("Technicians assigned to Installation #{$installation->reference_number}");

        return response()->json($installation->load('technicians'));
    }

    public function destroy(Installation $installation)
    {
        $installation->delete();
        return response()->json(null, 204);
    }
}
