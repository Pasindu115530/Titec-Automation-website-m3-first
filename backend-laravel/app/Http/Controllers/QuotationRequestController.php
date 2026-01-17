<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\QuotationRequest;
use App\Mail\QuotationReplyMail;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;

class QuotationRequestController extends Controller
{
    public function index()
    {
        return \App\Models\QuotationRequest::with(['user', 'products'])->latest()->get();
    }

    public function store(Request $request)
    {
        // Concatenate contact info with the message for notes, but also store separately
        // We keep message in notes for now as per original design or just store message
        $fullMessage = "Message: " . ($request->message ?? '');

        // 1. Create the Request "Header"
        $quoteRequest = QuotationRequest::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'customer_notes' => $fullMessage, // Or just request->message if we want cleaner notes
            'status' => 'pending'
        ]);

        // 2. Attach Products (The "Pivot" Magic)
        // Assuming frontend sends: items = [{product_id: 1, quantity: 5}, {product_id: 2, quantity: 1}]
        if ($request->items) {
            foreach ($request->items as $item) {
                // Check if product_id exists if strict, or just use what we have
                if (isset($item['product_id'])) {
                    $quoteRequest->products()->attach($item['product_id'], [
                        'quantity' => $item['quantity']
                    ]);
                }
            }
        }

        // 3. Send System Notification Emails
        // We load the products relationship so the email view can display them
        $quoteRequest->load('products');
        
        try {
            // Email to Customer
            Mail::to($quoteRequest->email)
                ->send(new \App\Mail\QuotationRequestNotification($quoteRequest));
            
            // Email to Admin/Sales
            $salesEmail = config('mail.sales.address');
            if ($salesEmail) {
                Mail::to($salesEmail)
                    ->send(new \App\Mail\AdminQuotationNotification($quoteRequest));
            } else {
                 // Fallback or log warning if no sales email configured, maybe send to "from" address
                 // For now, let's try sending to a default if not set, or just skip.
                 // Ideally user should configure MAIL_SALES_ADDRESS
                 \Illuminate\Support\Facades\Log::warning('MAIL_SALES_ADDRESS not configured, admin notification skipped.');
            }

        } catch (\Exception $e) {
            // Log error but don't fail the request
            \Illuminate\Support\Facades\Log::error('Failed to send quotation notification: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Request sent successfully!'], 201);
    }

    public function reply(Request $request, $id)
    {
        $quoteRequest = QuotationRequest::findOrFail($id);

        $validated = $request->validate([
            'mode' => 'nullable|string|in:create,upload',
            'items' => 'required_if:mode,create|array',
            'items.*.name' => 'required_if:mode,create|string',
            'items.*.quantity' => 'required_if:mode,create|numeric',
            'items.*.price' => 'required_if:mode,create|numeric',
            'message' => 'nullable|string',
            'file' => 'required_if:mode,upload|file|mimes:pdf|max:10240', // Max 10MB
        ]);

        try {
            \Illuminate\Support\Facades\Log::info('Reply Request Data:', $request->all());
            
            $mode = $request->input('mode', 'create');
            $pdfContent = null;

            if ($mode === 'upload') {
                // Read the uploaded file
                $file = $request->file('file');
                if (!$file) {
                     return response()->json(['message' => 'File not found.'], 400);
                }
                
                // Store file in public storage
                $path = $file->store('quotations', 'public');
                
                \Illuminate\Support\Facades\Log::info('Reply: PDF uploaded at: ' . $path);

                // Read content from the stored file
                $pdfContent = file_get_contents(storage_path('app/public/' . $path));
            } else {
                // Generate PDF from items
                $pdf = Pdf::loadView('pdfs.quotation', [
                    'request' => $quoteRequest,
                    'items' => $validated['items'] ?? [],
                    'message' => $validated['message'] ?? ''
                ]);
                $pdfContent = $pdf->output();
            }

            // 2. Send Email
            // Determine recipient email
            $recipientEmail = null;
            if ($quoteRequest->user) {
                $recipientEmail = $quoteRequest->user->email;
            } elseif ($quoteRequest->email) {
                 $recipientEmail = $quoteRequest->email;
            }
            
            if (!$recipientEmail && $quoteRequest->email) {
                $recipientEmail = $quoteRequest->email;
            }

            $messageContent = $request->input('message') ?? ($validated['message'] ?? '');

            if ($recipientEmail) {
                Mail::to($recipientEmail)->send(new QuotationReplyMail($pdfContent, $messageContent));
            }

            // 3. Update Status
            $quoteRequest->update(['status' => 'quoted']);

            return response()->json(['message' => 'Quotation sent successfully']);

        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Reply Error: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            file_put_contents(storage_path('logs/reply_debug.log'), $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json(['message' => 'Server Error: ' . $e->getMessage()], 500);
        }
    }

    public function sendDirectQuote(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'items' => 'required|array',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'required|numeric',
            'items.*.price' => 'required|numeric',
            'message' => 'nullable|string',
        ]);

        // Create a dummy request record for tracking or just generate PDF?
        // Better to create a record so we have a reference number (Quotation #)
        // We can set status to 'quoted' immediately
        $quoteRequest = QuotationRequest::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'status' => 'quoted',
            'customer_notes' => $validated['message'] ?? 'Direct Quote initiated by Admin'
        ]);

        // Generate PDF
        $pdf = Pdf::loadView('pdfs.quotation', [
            'request' => $quoteRequest, // pass the model
            'items' => $validated['items'],
            'message' => $validated['message']
        ]);

        // Send Email
        Mail::to($validated['email'])->send(new QuotationReplyMail($pdf->output(), $validated['message']));

        return response()->json(['message' => 'Direct quotation sent successfully']);
    }
}
