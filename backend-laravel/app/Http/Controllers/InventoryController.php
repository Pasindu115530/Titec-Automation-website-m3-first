<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();
        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('sku', 'like', "%{$request->search}%")
                  ->orWhere('model_number', 'like', "%{$request->search}%");
        }
        return response()->json($query->paginate(15));
    }

    public function adjust(Request $request, Product $product)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer', // Can be positive or negative
            'notes' => 'nullable|string'
        ]);

        DB::transaction(function () use ($product, $validated) {
            $stockBefore = $product->stock;
            $product->stock += $validated['quantity'];
            $product->save();

            StockMovement::create([
                'product_id' => $product->id,
                'user_id' => auth()->id() ?? 1,
                'type' => 'adjustment',
                'quantity' => $validated['quantity'],
                'stock_before' => $stockBefore,
                'stock_after' => $product->stock,
                'reference_type' => 'adjustment',
                'notes' => $validated['notes'] ?? null,
            ]);
        });

        return response()->json(['message' => 'Stock adjusted.', 'data' => $product->fresh()]);
    }

    public function receive(Request $request, Product $product)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string'
        ]);

        DB::transaction(function () use ($product, $validated) {
            $stockBefore = $product->stock;
            $product->stock += $validated['quantity'];
            $product->save();

            StockMovement::create([
                'product_id' => $product->id,
                'user_id' => auth()->id() ?? 1,
                'type' => 'received',
                'quantity' => $validated['quantity'],
                'stock_before' => $stockBefore,
                'stock_after' => $product->stock,
                'reference_type' => 'received',
                'notes' => $validated['notes'] ?? null,
            ]);
        });

        return response()->json(['message' => 'Stock received.', 'data' => $product->fresh()]);
    }

    public function movements(Product $product)
    {
        return response()->json($product->stockMovements()->with('user')->latest()->paginate(20));
    }
}
