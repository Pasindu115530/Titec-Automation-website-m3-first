<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('model_number', 'LIKE', "%{$search}%")
                  ->orWhere('sku', 'LIKE', "%{$search}%")
                  ->orWhere('category', 'LIKE', "%{$search}%");
            });
        }

        $products = $query->latest()->get();

        return response()->json([
            'data' => $products,
            'message' => 'Products retrieved successfully'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'category' => 'required|string|max:100',
            'stock' => 'required|integer',
            'sku' => 'nullable|string|max:50',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'datasheet' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        // Handle Images
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $filename = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
                $file->move(public_path('products'), $filename);
                $imagePaths[] = '/products/' . $filename;
            }
        }
        $validated['images'] = $imagePaths;

        // Handle Datasheet
        if ($request->hasFile('datasheet')) {
            $file = $request->file('datasheet');
            $filename = time() . '_datasheet_' . $file->getClientOriginalName();
            $file->move(public_path('datasheets'), $filename);
            $validated['datasheet_path'] = '/datasheets/' . $filename;
        }

        // Ensure model_number is set (fallback to SKU or generate unique default)
        if (empty($validated['model_number'])) {
            $validated['model_number'] = !empty($validated['sku']) ? $validated['sku'] : 'MN-' . strtoupper(uniqid()); 
        }

        $product = Product::create($validated);

        return response()->json([
            'data' => $product,
            'message' => 'Product created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return response()->json([
            'data' => $product,
            'message' => 'Product retrieved successfully'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric',
            'category' => 'sometimes|required|string|max:100',
            'stock' => 'sometimes|required|integer',
            'sku' => 'nullable|string|max:50',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'datasheet' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        // Handle Images (If provided, replace or append? Typically replace in simple implementations, or append. Let's append for now or replace? 
        // User didn't specify, but typically "update" with files replaces the set or adds to it. 
        // Let's assume simpler REPLACEMENT if files are sent, otherwise keep old.
        // Actually, for multiple images, standard simple CRUD usually appends or you have a separate delete mechanism.
        // Let's implement APPEND logic: keep existing, add new. 
        // If they want to delete, they'd need a delete endpoint or we clear if empty array passed?
        // Let's go with: if 'images' is present, we add them to existing.
        
        // Wait, typical "HTML form" update replaces content. 
        // Let's start with APPEND logic as it's safer.
        $currentImages = $product->images ?? [];
        
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $filename = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
                $file->move(public_path('products'), $filename);
                $currentImages[] = '/products/' . $filename;
            }
            $validated['images'] = $currentImages;
        } else {
             unset($validated['images']); // Don't overwrite with null
        }

        // Sync model_number with SKU if present
        if (!empty($validated['sku'])) {
            $validated['model_number'] = $validated['sku'];
        }

        // Handle Datasheet (Replace)
        if ($request->hasFile('datasheet')) {
            // Delete old
            if ($product->datasheet_path && file_exists(public_path($product->datasheet_path))) {
                File::delete(public_path($product->datasheet_path));
            }
            
            $file = $request->file('datasheet');
            $filename = time() . '_datasheet_' . $file->getClientOriginalName();
            $file->move(public_path('datasheets'), $filename);
            $validated['datasheet_path'] = '/datasheets/' . $filename;
        }

        $product->update($validated);

        return response()->json([
            'data' => $product,
            'message' => 'Product updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // Delete images
        if ($product->images) {
            foreach ($product->images as $img) {
                if (file_exists(public_path($img))) {
                    File::delete(public_path($img));
                }
            }
        }

        // Delete datasheet
        if ($product->datasheet_path && file_exists(public_path($product->datasheet_path))) {
            File::delete(public_path($product->datasheet_path));
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
}
