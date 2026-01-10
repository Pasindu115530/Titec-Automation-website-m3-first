<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            'description' => 'nullable|string',
            'completion_date' => 'nullable|date',
            'status' => 'nullable|string|max:50',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB
        ]);

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $file = $request->file('thumbnail');
            $path = $file->store('projects', 'public');
            $thumbnailPath = $path;
        }

        $project = Project::create([
            'title' => $validated['title'],
            'client' => $validated['client'] ?? null,
            'description' => $validated['description'] ?? null,
            'completion_date' => $validated['completion_date'] ?? null,
            'status' => $validated['status'] ?? 'In Progress',
            'thumbnail_path' => $thumbnailPath,
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
            'description' => 'nullable|string',
            'completion_date' => 'nullable|date',
            'status' => 'nullable|string|max:50',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail if exists
            if ($project->thumbnail_path) {
                Storage::disk('public')->delete($project->thumbnail_path);
            }
            
            $file = $request->file('thumbnail');
            $path = $file->store('projects', 'public');
            $validated['thumbnail_path'] = $path;
        }

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
            Storage::disk('public')->delete($project->thumbnail_path);
        }

        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully'
        ]);
    }
}
