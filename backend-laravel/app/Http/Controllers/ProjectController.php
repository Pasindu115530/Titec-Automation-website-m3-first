<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class ProjectController extends Controller
{
    /**
     * Display a listing of the projects.
     */
    public function index()
    {
        $projects = Project::all();
        return response()->json([
            'data' => $projects,
            'message' => 'Projects retrieved successfully'
        ]);
    }

    /**
     * Store a newly created project in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'client' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'completion_date' => 'nullable|date',
            'status' => 'nullable|string|max:50',
            'technologies' => 'nullable|array',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048', // 2MB
            'project_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $file = $request->file('thumbnail');
            $filename = time() . '_' . uniqid() . '_thumb_' . $file->getClientOriginalName();
            $file->move(public_path('projects'), $filename);
            $thumbnailPath = '/projects/' . $filename;
        }

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = time() . '_' . uniqid() . '_logo_' . $file->getClientOriginalName();
            $file->move(public_path('projects/logos'), $filename);
            $logoPath = '/projects/logos/' . $filename;
        }

        $galleryPaths = [];
        if ($request->hasFile('project_images')) {
            foreach ($request->file('project_images') as $image) {
                $filename = time() . '_' . uniqid() . '_gallery_' . $image->getClientOriginalName();
                $image->move(public_path('projects/gallery'), $filename);
                $galleryPaths[] = '/projects/gallery/' . $filename;
            }
        }

        $project = Project::create([
            'title' => $validated['title'],
            'client' => $validated['client'] ?? null,
            'location' => $validated['location'] ?? null,
            'description' => $validated['description'] ?? null,
            'completion_date' => $validated['completion_date'] ?? null,
            'status' => $validated['status'] ?? 'In Progress',
            'technologies' => $validated['technologies'] ?? [],
            'thumbnail_path' => $thumbnailPath,
            'logo_path' => $logoPath,
            'project_image_urls' => $galleryPaths, // Casted to array in model
        ]);

        return response()->json([
            'data' => $project,
            'message' => 'Project created successfully'
        ], 201);
    }

    /**
     * Display the specified project.
     */
    public function show(Project $project)
    {
        return response()->json([
            'data' => $project,
            'message' => 'Project retrieved successfully'
        ]);
    }

    /**
     * Update the specified project in storage.
     */
    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'client' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'completion_date' => 'nullable|date',
            'status' => 'nullable|string|max:50',
            'technologies' => 'nullable|array',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048', // 2MB
            'project_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'deleted_images' => 'nullable|array',
            'deleted_images.*' => 'string',
        ]);

        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail if exists
            if ($project->thumbnail_path && file_exists(public_path($project->thumbnail_path))) {
                File::delete(public_path($project->thumbnail_path));
            }
            
            $file = $request->file('thumbnail');
            $filename = time() . '_' . uniqid() . '_thumb_' . $file->getClientOriginalName();
            $file->move(public_path('projects'), $filename);
            $validated['thumbnail_path'] = '/projects/' . $filename;
        }

        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($project->logo_path && file_exists(public_path($project->logo_path))) {
                File::delete(public_path($project->logo_path));
            }
            
            $file = $request->file('logo');
            $filename = time() . '_' . uniqid() . '_logo_' . $file->getClientOriginalName();
            $file->move(public_path('projects/logos'), $filename);
            $validated['logo_path'] = '/projects/logos/' . $filename;
        }

        // Handle Gallery Images
        $currentImages = $project->project_image_urls ?? [];

        // 1. Remove deleted images (with path traversal protection)
        if ($request->has('deleted_images')) {
            $deletedImages = $request->input('deleted_images');
            $allowedDir = realpath(public_path('projects'));
            foreach ($deletedImages as $delImg) {
                // Remove from array
                if (in_array($delImg, $currentImages)) {
                    // Safely delete physical file — only allow files within public/projects/
                    $realPath = realpath(public_path($delImg));
                    if ($realPath && $allowedDir && str_starts_with($realPath, $allowedDir)) {
                        File::delete($realPath);
                    }
                    $currentImages = array_values(array_diff($currentImages, [$delImg]));
                }
            }
        }

        // 2. Add new images
        if ($request->hasFile('project_images')) {
            foreach ($request->file('project_images') as $image) {
                $filename = time() . '_' . uniqid() . '_gallery_' . $image->getClientOriginalName();
                $image->move(public_path('projects/gallery'), $filename);
                $currentImages[] = '/projects/gallery/' . $filename;
            }
        }

        $validated['project_image_urls'] = $currentImages;

        $project->update($validated);

        return response()->json([
            'data' => $project,
            'message' => 'Project updated successfully'
        ]);
    }

    /**
     * Remove the specified project from storage.
     */
    public function destroy(Project $project)
    {
        // Delete thumbnail if exists
        if ($project->thumbnail_path) {
            if (file_exists(public_path($project->thumbnail_path))) {
                File::delete(public_path($project->thumbnail_path));
            }
        }

        // Delete logo if exists
        if ($project->logo_path) {
            if (file_exists(public_path($project->logo_path))) {
                File::delete(public_path($project->logo_path));
            }
        }

        // Delete gallery images
        if ($project->project_image_urls) {
            foreach ($project->project_image_urls as $imagePath) {
                if (file_exists(public_path($imagePath))) {
                    File::delete(public_path($imagePath));
                }
            }
        }

        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully'
        ]);
    }
}
