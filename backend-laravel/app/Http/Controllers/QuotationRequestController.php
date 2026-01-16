<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class QuotationRequestController extends Controller
{
    public function index()
    {
        return \App\Models\QuotationRequest::with(['user', 'products'])->latest()->get();
    }

    public function store(Request $request)
    {
        // Concatenate contact info with the message
        $contactInfo = "Name: " . ($request->name ?? 'N/A') . "\n";
        $contactInfo .= "Email: " . ($request->email ?? 'N/A') . "\n";
        $contactInfo .= "Phone: " . ($request->phone ?? 'N/A') . "\n\n";
        
        $fullMessage = $contactInfo . "Message: " . ($request->message ?? '');

        // 1. Create the Request "Header"
        $quoteRequest = QuotationRequest::create([
            'user_id' => auth()->id(), // or null if guest
            'customer_notes' => $fullMessage,
            'status' => 'pending'
        ]);

        // 2. Attach Products (The "Pivot" Magic)
        // Assuming frontend sends: items = [{product_id: 1, quantity: 5}, {product_id: 2, quantity: 1}]
        foreach ($request->items as $item) {
            $quoteRequest->products()->attach($item['product_id'], [
                'quantity' => $item['quantity']
            ]);
        }

        return response()->json(['message' => 'Request sent successfully!'], 201);
    }
}
