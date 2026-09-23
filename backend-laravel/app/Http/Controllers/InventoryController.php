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

    public function createMovement(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'movement_type' => 'required|in:received,adjustment,damaged,return',
            'quantity' => 'required|integer|not_in:0',
            'notes' => 'nullable|string'
        ]);

        $product = Product::findOrFail($validated['product_id']);
        
        // Determine the actual quantity delta based on movement type
        $quantity = $validated['quantity'];
        if ($validated['movement_type'] === 'damaged') {
            // Damaged should always reduce stock, so ensure negative
            $quantity = -abs($quantity);
        } elseif (in_array($validated['movement_type'], ['received', 'return'])) {
            // Received and return should always increase stock
            $quantity = abs($quantity);
        }
        // 'adjustment' can be either positive or negative

        DB::transaction(function () use ($product, $quantity, $validated) {
            $stockBefore = $product->stock;
            $product->stock += $quantity;
            $product->save();

            StockMovement::create([
                'product_id' => $product->id,
                'user_id' => auth()->id() ?? 1,
                'type' => $validated['movement_type'],
                'quantity' => $quantity,
                'stock_before' => $stockBefore,
                'stock_after' => $product->stock,
                'reference_type' => 'manual',
                'notes' => $validated['notes'] ?? null,
            ]);
        });

        return response()->json(['message' => 'Stock movement recorded.', 'data' => $product->fresh()]);
    }

    public function createBulkMovement(Request $request)
    {
        $validated = $request->validate([
            'movement_type' => 'required|in:received,adjustment,damaged,return',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|not_in:0',
            'notes' => 'nullable|string'
        ]);

        $products = Product::whereIn('id', collect($validated['items'])->pluck('product_id'))->get()->keyBy('id');
        $movementType = $validated['movement_type'];
        $notes = $validated['notes'] ?? null;
        $userId = auth()->id() ?? 1;

        DB::transaction(function () use ($validated, $products, $movementType, $notes, $userId) {
            foreach ($validated['items'] as $item) {
                $product = $products->get($item['product_id']);
                if (!$product) continue;

                $quantity = $item['quantity'];
                if ($movementType === 'damaged') {
                    $quantity = -abs($quantity);
                } elseif (in_array($movementType, ['received', 'return'])) {
                    $quantity = abs($quantity);
                }

                $stockBefore = $product->stock;
                $product->stock += $quantity;
                $product->save();

                StockMovement::create([
                    'product_id' => $product->id,
                    'user_id' => $userId,
                    'type' => $movementType,
                    'quantity' => $quantity,
                    'stock_before' => $stockBefore,
                    'stock_after' => $product->stock,
                    'reference_type' => 'manual',
                    'notes' => $notes,
                ]);
            }
        });

        return response()->json(['message' => 'Bulk stock movements recorded.']);
    }

    public function movements(Product $product)
    {
        return response()->json($product->stockMovements()->with('user:id,name')->latest()->paginate(20));
    }
}
