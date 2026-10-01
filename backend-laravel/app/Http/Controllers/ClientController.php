<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $query = Client::query();

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('type')) {
            $query->where('client_type', $request->type);
        }

        if ($request->filled('city')) {
            $query->where('city', $request->city);
        }

        $clients = $query->latest()->paginate(15);
        return response()->json($clients);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'nullable|string|max:255',
            'contact_person' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|max:20',
            'secondary_phone' => 'nullable|string|max:20',
            'nic' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'district' => 'nullable|string|max:100',
            'client_type' => 'required|in:individual,business',
            'tax_id' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $client = Client::create($validated);
        return response()->json($client, 201);
    }

    public function show(Client $client)
    {
        return response()->json($client);
    }

    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'company_name' => 'nullable|string|max:255',
            'contact_person' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|max:20',
            'secondary_phone' => 'nullable|string|max:20',
            'nic' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'district' => 'nullable|string|max:100',
            'client_type' => 'required|in:individual,business',
            'tax_id' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $client->update($validated);
        return response()->json($client);
    }

    public function destroy(Client $client)
    {
        $client->delete();
        return response()->json(null, 204);
    }

    public function history(Client $client)
    {
        $client->load([
            'invoices' => fn($q) => $q->orderBy('created_at', 'desc'),
            'installations' => fn($q) => $q->orderBy('scheduled_date', 'desc'),
            'serviceLogs' => fn($q) => $q->orderBy('service_date', 'desc')
        ]);
        
        return response()->json([
            'client' => $client,
            'history' => [
                'invoices' => $client->invoices,
                'installations' => $client->installations,
                'service_logs' => $client->serviceLogs,
            ]
        ]);
    }
}
