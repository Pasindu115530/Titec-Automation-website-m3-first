<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\QuotationRequest;
use App\Mail\QuotationReplyMail;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;

class QuotationRequestController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');
        
        $query = QuotationRequest::with(['user', 'products'])->latest();

        if ($status) {
            $query->where('status', $status);
        }

        return $query->paginate(10);
    }

    public function store(Request $request)
    {
        // Security: Validate input to prevent malformed data and abuse
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20', // Enforce realistic length
            'message' => 'nullable|string|max:2000', // Prevent huge payloads
            'items' => 'nullable|array',
            'items.*.product_id' => 'required_with:items|exists:products,id',
            'items.*.quantity' => 'required_with:items|integer|min:1|max:1000'
        ]);

        // Concatenate contact info with the message for notes, but also store separately
        // We keep message in notes for now as per original design or just store message
        $fullMessage = "Message: " . ($validated['message'] ?? '');

        // 1. Create the Request "Header"
        $quoteRequest = QuotationRequest::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'customer_notes' => $fullMessage, 
            'status' => 'pending'
        ]);

        // 2. Attach Products (The "Pivot" Magic)
        if (!empty($validated['items'])) {
            foreach ($validated['items'] as $item) {
                $quoteRequest->products()->attach($item['product_id'], [
                    'quantity' => $item['quantity']
                ]);
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
            'mode' => 'nullable|string|in:create,upload',
            'items' => 'required_if:mode,create|array',
            'items.*.name' => 'required_if:mode,create|string',
            'items.*.quantity' => 'required_if:mode,create|numeric',
            'items.*.price' => 'required_if:mode,create|numeric',
            'message' => 'nullable|string',
            'file' => 'required_if:mode,upload|file|mimes:pdf|max:10240',
        ]);

        $mode = $request->input('mode', 'create');
        $pdfContent = null;

        if ($mode === 'upload') {
            $file = $request->file('file');
            if (!$file) {
                return response()->json(['message' => 'File not found.'], 400);
            }
            $path = $file->storage_path('quotations', 'public'); // path is not returned by storage_path? wait. $file->store()
            $path = $file->store('quotations', 'public');
            $pdfContent = file_get_contents(storage_path('app/public/' . $path));
        } else {
            // Create dummy request for PDF view context if needed, or pass null
            // We create a record anyway
            $items = $validated['items'] ?? [];
            // Generate PDF
             // We need a request object for the view usually
             $quoteRequestForPdf = new QuotationRequest([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'created_at' => now(),
             ]);
             
            $pdf = Pdf::loadView('pdfs.quotation', [
                'request' => $quoteRequestForPdf,
                'items' => $items,
                'message' => $validated['message'] ?? ''
            ]);
            $pdfContent = $pdf->output();
        }

        // Create Record
        QuotationRequest::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'status' => 'quoted',
            'customer_notes' => $validated['message'] ?? 'Direct Quote initiated by Admin'
        ]);

        // Send Email
        Mail::to($validated['email'])->send(new QuotationReplyMail($pdfContent, $validated['message'] ?? ''));

        return response()->json(['message' => 'Direct quotation sent successfully']);
    }
}
