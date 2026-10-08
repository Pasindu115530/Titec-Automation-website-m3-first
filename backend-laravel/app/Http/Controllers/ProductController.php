<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

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
            'show_price' => 'nullable|boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'datasheet' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        $validated['stock'] = $validated['stock'] ?? 0;

        // Handle Images (Safely storing in public disk instead of public_path to support Docker/Coolify)
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $filename = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
                $file->storeAs('products', $filename, 'public');
                $imagePaths[] = '/storage/products/' . $filename;
            }
        }
        $validated['images'] = $imagePaths;

        // Handle Datasheet
        if ($request->hasFile('datasheet')) {
            $file = $request->file('datasheet');
            $filename = time() . '_datasheet_' . $file->getClientOriginalName();
            $file->storeAs('datasheets', $filename, 'public');
            $validated['datasheet_path'] = '/storage/datasheets/' . $filename;
        }

        // Ensure model_number is set (fallback to SKU or generate unique default)
        if (empty($validated['model_number'])) {
            $validated['model_number'] = !empty($validated['sku']) ? $validated['sku'] : 'MN-' . strtoupper(uniqid()); 
        }

        try {
            $product = Product::create($validated);
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            Log::warning('Duplicate product entry attempted', [
                'user_id' => auth()->id() ?? 'guest',
                'model_number' => $validated['model_number'] ?? 'N/A',
                'sku' => $validated['sku'] ?? 'N/A',
                'ip_address' => request()->ip(),
                'exception' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Product with this Model Number or SKU already exists.',
                'error' => 'Duplicate Entry'
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to create product - Unexpected Error', [
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
            'show_price' => 'nullable|boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'datasheet' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        // Ensure we always have an array, even if the DB cast failed or returned null
        $currentImages = is_array($product->images) ? $product->images : [];
        
        // Handle deletions
        if ($request->has('deleted_images')) {
            $deletedImages = $request->input('deleted_images', []);
            if (!is_array($deletedImages)) {
                $deletedImages = [$deletedImages]; // Fallback if sent as single string
            }
            
            Log::info('Deleting product images', ['product_id' => $product->id, 'deleted_images' => $deletedImages, 'current_images' => $currentImages]);
            
            $currentImages = array_values(array_filter($currentImages, function($img) use ($deletedImages) {
                return !in_array($img, $deletedImages);
            }));

            // Safely delete physical files
            foreach ($deletedImages as $delImg) {
                if (str_starts_with($delImg, '/storage/')) {
                    $path = str_replace('/storage/', '', $delImg);
                    Storage::disk('public')->delete($path);
                } else {
                    $fullPath = public_path(ltrim($delImg, '/'));
                    if (file_exists($fullPath)) {
                        @unlink($fullPath);
                    }
                }
            }
        }
        
        // Handle new images (append) safely using storage
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $filename = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
                $file->storeAs('products', $filename, 'public');
                $currentImages[] = '/storage/products/' . $filename;
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
            if ($product->datasheet_path) {
                if (str_starts_with($product->datasheet_path, '/storage/')) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $product->datasheet_path));
                } else {
                    $oldPath = public_path(ltrim($product->datasheet_path, '/'));
                    if (file_exists($oldPath)) @unlink($oldPath);
                }
            }
            
            $file = $request->file('datasheet');
            $filename = time() . '_datasheet_' . $file->getClientOriginalName();
            $file->storeAs('datasheets', $filename, 'public');
            $validated['datasheet_path'] = '/storage/datasheets/' . $filename;
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
            if (is_array($product->images)) {
                foreach ($product->images as $img) {
                    if (str_starts_with($img, '/storage/')) {
                        Storage::disk('public')->delete(str_replace('/storage/', '', $img));
                    } else {
                        $fullPath = public_path(ltrim($img, '/'));
                        if (file_exists($fullPath)) @unlink($fullPath);
                    }
                }
            }

            // Delete datasheet
            if ($product->datasheet_path) {
                if (str_starts_with($product->datasheet_path, '/storage/')) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $product->datasheet_path));
                } else {
                    $fullPath = public_path(ltrim($product->datasheet_path, '/'));
                    if (file_exists($fullPath)) @unlink($fullPath);
                }
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
