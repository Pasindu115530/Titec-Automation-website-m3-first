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

        // Filter by on_store for client requests (when admin parameter is not present)
        if (!$request->input('admin', false)) {
            $query->where('on_store', true);
        }

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
            'brand' => 'nullable|string|max:100',
            'brand_id' => 'nullable|exists:brands,id',
            'stock' => 'required|integer',
            'unit' => 'nullable|string:max:20',
            'sku' => 'nullable|string|max:50',
            'on_store' => 'nullable|boolean',
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

        try {
            $product = Product::create($validated);
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            // Log duplicate entry with context
            \Illuminate\Support\Facades\Log::warning('Duplicate product entry attempted', [
                'user_id' => auth()->id() ?? 'guest',
                'model_number' => $validated['model_number'] ?? 'N/A',
                'sku' => $validated['sku'] ?? 'N/A',
                'name' => $validated['name'] ?? 'N/A',
                'ip_address' => request()->ip(),
                'exception' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Product with this Model Number or SKU already exists.',
                'error' => 'Duplicate Entry'
            ], 422);
        } catch (\Exception $e) {
            // Log unexpected errors with full context
            \Illuminate\Support\Facades\Log::error('Failed to create product - Unexpected Error', [
                'user_id' => auth()->id() ?? 'guest',
                'validated_data' => $validated,
                'ip_address' => request()->ip(),
                'exception_message' => $e->getMessage(),
                'exception_trace' => $e->getTraceAsString()
            ]);
            
             return response()->json([
                'message' => 'Failed to create product.',
                'error' => $e->getMessage()
            ], 500);
        }

        return response()->json([
            'data' => $product,
            'message' => 'Product created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
             return response()->json(['message' => 'Product not found'], 404);
        }

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
            'brand' => 'nullable|string|max:100',
            'brand_id' => 'nullable|exists:brands,id',
            'stock' => 'sometimes|required|integer',
            'unit' => 'nullable|string:max:20',
            'sku' => 'nullable|string|max:50',
            'on_store' => 'nullable|boolean',
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
        // Helper to strip public URL prefix to match DB storage paths if needed
        // Assuming images are stored as relative paths 'products/filename.jpg' in DB but full URLs sent?
        // Let's rely on exact string match if possible, or simple filename match.
        
        $currentImages = $product->images ?? [];
        
        // Handle deletions (with path traversal protection)
        if ($request->has('deleted_images')) {
            $deletedImages = $request->deleted_images; // Expected to be array of paths as stored in DB
            $currentImages = array_values(array_filter($currentImages, function($img) use ($deletedImages) {
                return !in_array($img, $deletedImages);
            }));

            // Safely delete physical files — only allow files within public/products/
            $allowedDir = realpath(public_path('products'));
            foreach ($deletedImages as $delImg) {
                $fullPath = public_path($delImg);
                $realPath = realpath($fullPath);
                // Only delete if file exists AND is within the allowed directory
                if ($realPath && $allowedDir && str_starts_with($realPath, $allowedDir)) {
                    File::delete($realPath);
                }
            }
        }
        
        // Handle new images (append)
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $filename = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
                $file->move(public_path('products'), $filename);
                $currentImages[] = '/products/' . $filename; // Ensure this format matches DB
            }
        }
        
        $validated['images'] = $currentImages;

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

        try {
            $product->update($validated);
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
             return response()->json([
                'message' => 'Product with this Model Number or SKU already exists.',
                'error' => 'Duplicate Entry'
            ], 422);
        } catch (\Exception $e) {
             return response()->json([
                'message' => 'Failed to update product.',
                'error' => $e->getMessage()
            ], 500);
        }

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
        try {
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
        } catch (\Illuminate\Database\QueryException $e) {
            if ((string) $e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Cannot delete this product because it is referenced by one or more quotation requests.'
                ], 409);
            }
            throw $e;
        }
    }
}
