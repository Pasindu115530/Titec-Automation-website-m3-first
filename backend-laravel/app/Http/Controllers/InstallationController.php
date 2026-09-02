<?php

namespace App\Http\Controllers;

use App\Models\Installation;
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
        $installation->load(['client', 'invoice', 'technicians', 'notes.user']);
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
        return response()->json($installation);
    }

    public function addNote(Request $request, Installation $installation)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'attachments' => 'nullable|array',
        ]);

        $note = $installation->notes()->create([
            'user_id' => auth()->id() ?? 1,
            'content' => $validated['content'],
            'attachments' => $validated['attachments'] ?? null,
        ]);

        return response()->json($note, 201);
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
        return response()->json($installation->load('technicians'));
    }

    public function destroy(Installation $installation)
    {
        $installation->delete();
        return response()->json(null, 204);
    }
}
