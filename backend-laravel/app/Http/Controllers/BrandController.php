<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brands = \Illuminate\Support\Facades\Cache::remember('brands_index', now()->addMinutes(15), function () {
            return Brand::all();
        });
        return $brands;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|mimes:svg,png,jpg,jpeg,webm,gif,xml|max:10240',
        ]);

        $slug = Str::slug($request->name);
        $logoPath = null;

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('brands', $filename, 'public');
            $logoPath = 'storage/brands/' . $filename;
        }

        $brand = Brand::create([
            'name' => $request->name,
            'slug' => $slug,
            'logo_path' => $logoPath,
        ]);

        return response()->json($brand, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Brand $brand)
    {
        return $brand;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Brand $brand)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|mimes:svg,png,jpg,jpeg,webm,gif,xml|max:10240',
        ]);

        $brand->name = $request->name;
        $brand->slug = Str::slug($request->name);

        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($brand->logo_path) {
                if (str_starts_with($brand->logo_path, 'storage/')) {
                    Storage::disk('public')->delete(str_replace('storage/', '', $brand->logo_path));
                } else {
                    $oldPath = public_path($brand->logo_path);
                    if (file_exists($oldPath)) @unlink($oldPath);
                }
            }
            
            $file = $request->file('logo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('brands', $filename, 'public');
            $brand->logo_path = 'storage/brands/' . $filename;
        }

        $brand->save();

        return response()->json($brand);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
        if ($brand->logo_path) {
            if (str_starts_with($brand->logo_path, 'storage/')) {
                Storage::disk('public')->delete(str_replace('storage/', '', $brand->logo_path));
            } else {
                $fullPath = public_path($brand->logo_path);
                if (file_exists($fullPath)) @unlink($fullPath);
            }
        }
        $brand->delete();

        return response()->json(['message' => 'Brand deleted successfully']);
    }
}
