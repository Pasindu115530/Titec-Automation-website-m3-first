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
    public function index()
    {
        $products = Product::all();
        // Ensure image paths are full URLs if needed, or frontend handles '/products/...'
        // Current implementation saves '/products/filename.jpg' which is web-accessible
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            // Save directly to public/products folder as requested
            $file->move(public_path('products'), $filename);
            $imagePath = '/products/' . $filename;
        }

        $validated['image'] = $imagePath;

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
            'image' => 'nullable', // Can be file or null
        ]);

        if ($request->hasFile('image')) {
             $request->validate([
                'image' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            ]);

            // Delete old image if it exists in public/products
            if ($product->image && file_exists(public_path($product->image))) {
                File::delete(public_path($product->image));
            }

            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('products'), $filename);
            $validated['image'] = '/products/' . $filename;
        } else {
             // If not uploading new image, keep the old one
             // remove 'image' from validated if it's null or not present to prevent nulling it out
             unset($validated['image']);
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
        // Delete image if exists
        if ($product->image && file_exists(public_path($product->image))) {
             File::delete(public_path($product->image));
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
}
