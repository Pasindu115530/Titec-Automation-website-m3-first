<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Brand::all();
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
            $file->move(public_path('brands'), $filename);
            $logoPath = 'brands/' . $filename;
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
            if ($brand->logo_path && File::exists(public_path($brand->logo_path))) {
                File::delete(public_path($brand->logo_path));
            }
            
            $file = $request->file('logo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('brands'), $filename);
            $brand->logo_path = 'brands/' . $filename;
        }

        $brand->save();

        return response()->json($brand);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
        if ($brand->logo_path && File::exists(public_path($brand->logo_path))) {
             File::delete(public_path($brand->logo_path));
        }
        $brand->delete();

        return response()->json(['message' => 'Brand deleted successfully']);
    }
}
