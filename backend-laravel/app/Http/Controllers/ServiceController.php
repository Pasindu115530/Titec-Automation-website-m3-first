<?php

namespace App\Http\Controllers;

use App\Models\ServiceCategory;
use App\Models\ServiceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    /**
     * Display a listing of service categories with their items.
     */
    public function index()
    {
        $services = ServiceCategory::with('items')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => $services,
            'message' => 'Services retrieved successfully'
        ]);
    }

    /**
     * Display a single service category by slug.
     */
    public function show($slug)
    {
        $service = ServiceCategory::with('items')
            ->where('slug', $slug)
            ->first();

        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        return response()->json([
            'data' => $service,
            'message' => 'Service retrieved successfully'
        ]);
    }

    /**
     * Store a new service category with items.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'slug' => 'nullable|string|max:255|unique:service_categories,slug',
            'sort_order' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'items' => 'nullable|array',
            'items.*.title' => 'required|string|max:255',
            'items.*.description' => 'nullable|string',
        ]);

        // Auto-generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
            $file->move(public_path('services'), $filename);
            $validated['image_path'] = '/services/' . $filename;
        }

        try {
            $service = ServiceCategory::create([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'image_path' => $validated['image_path'] ?? null,
                'slug' => $validated['slug'],
                'sort_order' => $validated['sort_order'] ?? 0,
            ]);

            // Create items
            if (!empty($validated['items'])) {
                foreach ($validated['items'] as $index => $item) {
                    $service->items()->create([
                        'title' => $item['title'],
                        'description' => $item['description'] ?? null,
                        'sort_order' => $index,
                    ]);
                }
            }

            $service->load('items');

            return response()->json([
                'data' => $service,
                'message' => 'Service created successfully'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create service.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing service category with items.
     */
    public function update(Request $request, ServiceCategory $service)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'slug' => 'nullable|string|max:255|unique:service_categories,slug,' . $service->id,
            'sort_order' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'items' => 'nullable|array',
            'items.*.id' => 'nullable|integer',
            'items.*.title' => 'required|string|max:255',
            'items.*.description' => 'nullable|string',
        ]);

        // Handle image upload (replace old)
        if ($request->hasFile('image')) {
            // Delete old image
            if ($service->image_path && file_exists(public_path($service->image_path))) {
                File::delete(public_path($service->image_path));
            }

            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
            $file->move(public_path('services'), $filename);
            $validated['image_path'] = '/services/' . $filename;
        }

        try {
            $service->update([
                'title' => $validated['title'] ?? $service->title,
                'description' => $validated['description'] ?? $service->description,
                'image_path' => $validated['image_path'] ?? $service->image_path,
                'slug' => $validated['slug'] ?? $service->slug,
                'sort_order' => $validated['sort_order'] ?? $service->sort_order,
            ]);

            // Sync items: delete old, create new
            if (isset($validated['items'])) {
                $service->items()->delete();
                foreach ($validated['items'] as $index => $item) {
                    $service->items()->create([
                        'title' => $item['title'],
                        'description' => $item['description'] ?? null,
                        'sort_order' => $index,
                    ]);
                }
            }

            $service->load('items');

            return response()->json([
                'data' => $service,
                'message' => 'Service updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update service.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a service category and its items.
     */
    public function destroy(ServiceCategory $service)
    {
        // Delete image file
        if ($service->image_path && file_exists(public_path($service->image_path))) {
            File::delete(public_path($service->image_path));
        }

        $service->delete(); // cascade deletes items

        return response()->json([
            'message' => 'Service deleted successfully'
        ]);
    }
}
