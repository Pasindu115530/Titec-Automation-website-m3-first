<?php

namespace App\Http\Controllers;

use App\Models\Quotation;
use Illuminate\Http\Request;

class QuotationController extends Controller
{
    public function index()
    {
        return Quotation::orderBy('created_at', 'desc')->get();
    }

    public function show($id)
    {
        return Quotation::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $quotation = Quotation::findOrFail($id);

        $validatedData = $request->validate([
            'items' => 'required|array',
            'status' => 'required|in:pending,sent,rejected',
            'total_amount' => 'nullable|numeric',
        ]);

        $quotation->update($validatedData);

        return response()->json($quotation);
    }

    public function store(Request $request) 
    {
         // Basic store method for testing creation if needed, though mostly seeded
        $validatedData = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'items' => 'required|array',
        ]);
        
        $quotation = Quotation::create($validatedData);
        return response()->json($quotation, 201);
    }
}
