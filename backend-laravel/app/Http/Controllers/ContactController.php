<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactMessage;
use App\Mail\ContactFormSubmitted;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string',
        ]);

        $contactMessage = ContactMessage::create($validated);

        // Send email to sales
        // Assuming 'sales@titecautomation.com' or configured via .env
        $salesEmail = config('MAIL_SALES_ADDRESS', 'sales@titecautomation.lk'); 
        
        try {
            Mail::to($salesEmail)->send(new ContactFormSubmitted($contactMessage));
        } catch (\Exception $e) {
            // Log error but don't fail the request if email fails?
            // Or fail? For now, we'll just log it.
            \Log::error('Failed to send contact email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Message sent successfully!',
            'data' => $contactMessage
        ], 201);
    }
}
