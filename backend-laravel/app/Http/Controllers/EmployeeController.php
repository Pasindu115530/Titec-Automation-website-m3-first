<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with('user');
        
        if ($request->filled('status')) {
            $query->where('employment_status', $request->status);
        }
        
        $employees = $query->latest()->get();
        return response()->json($employees);
    }

    public function show(Employee $employee)
    {
        $employee->load('user.roles');
        return response()->json($employee);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'department' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'nic' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'date_joined' => 'nullable|date',
            'address' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'employment_status' => 'required|in:active,inactive,terminated',
            'notes' => 'nullable|string',
        ]);

        $employee->update($validated);
        
        $employee->load('user.roles');

        return response()->json($employee);
    }
}
