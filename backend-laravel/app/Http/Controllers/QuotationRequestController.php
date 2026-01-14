<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class QuotationRequestController extends Controller
{
    public function store(Request $request)
    {
        // 1. Create the Request "Header"
        $quoteRequest = QuotationRequest::create([
            'user_id' => auth()->id(), // or null if guest
            'customer_notes' => $request->message,
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
