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

        } catch (\Symfony\Component\Mailer\Exception\TransportException $e) {
            // SMTP-specific error, more actionable
            \Illuminate\Support\Facades\Log::error('SMTP Error - Quotation Notification Failed', [
                'quotation_id' => $quoteRequest->id,
                'recipient_email' => $quoteRequest->email,
                'error_type' => 'SMTP_TRANSPORT_ERROR',
                'exception_message' => $e->getMessage(),
                'smtp_host' => config('mail.mailers.smtp.host'),
                'smtp_port' => config('mail.mailers.smtp.port'),
                'suggestion' => 'Verify SMTP credentials and server configuration'
            ]);
        } catch (\Exception $e) {
            // Log error but don't fail the request
            \Illuminate\Support\Facades\Log::error('Quotation Notification Error', [
                'quotation_id' => $quoteRequest->id,
                'recipient_email' => $quoteRequest->email,
                'error_type' => 'GENERAL_EMAIL_ERROR',
                'exception_message' => $e->getMessage()
            ]);
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
            'vat' => 'nullable|numeric|min:0',
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
                // Store file in private storage
                $path = $file->store('quotations', 'quotations');
                
                \Illuminate\Support\Facades\Log::info('Reply: PDF uploaded at: ' . $path);

                // Read content from the stored file
                // With private disk, we can use Storage façade
                $pdfContent = \Illuminate\Support\Facades\Storage::disk('quotations')->get($path);
            } else {
                // Generate PDF from items
                $pdf = Pdf::loadView('pdfs.quotation', [
                    'request' => $quoteRequest,
                    'items' => $validated['items'] ?? [],
                    'message' => $validated['message'] ?? '',
                    'vat' => $validated['vat'] ?? 18
                ]);
                $pdfContent = $pdf->output();
                
                // Store the generated PDF for future download
                // Filename strategy: quote_{id}_{timestamp}.pdf
                $filename = 'quotations/quote_' . $quoteRequest->id . '_' . time() . '.pdf';
                \Illuminate\Support\Facades\Storage::disk('quotations')->put($filename, $pdfContent);
                $path = $filename; // Keep track of path if we want to save it to DB
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
                try {
                    $mail = Mail::to($recipientEmail);
                    if (config('mail.sales.address')) {
                        $mail->bcc(config('mail.sales.address'));
                    }
                    $mail->send(new QuotationReplyMail($pdfContent, $messageContent));
                    
                    \Illuminate\Support\Facades\Log::info('Quotation email sent successfully', [
                        'quotation_id' => $quoteRequest->id,
                        'recipient' => $recipientEmail,
                        'mode' => $mode
                    ]);
                    
                } catch (\Symfony\Component\Mailer\Exception\TransportException $e) {
                    // SMTP authentication or connection error
                    \Illuminate\Support\Facades\Log::error('SMTP Error - Quote Email Failed', [
                        'quotation_id' => $quoteRequest->id,
                        'recipient' => $recipientEmail,
                        'error_type' => 'SMTP_AUTH_FAILURE',
                        'exception_message' => $e->getMessage(),
                        'suggestion' => 'Check SMTP credentials in .env file'
                    ]);
                    
                    // Still update status but notify admin
                    throw new \Exception('Email sending failed: SMTP authentication error. Please contact administrator.');
                    
                } catch (\Exception $e) {
                    // General email error
                    \Illuminate\Support\Facades\Log::error('Email sending failed for quotation', [
                        'quotation_id' => $quoteRequest->id,
                        'recipient' => $recipientEmail,
                        'error_type' => 'GENERAL_EMAIL_ERROR',
                        'exception_message' => $e->getMessage(),
                        'exception_trace' => $e->getTraceAsString()
                    ]);
                    
                    throw new \Exception('Email sending failed: ' . $e->getMessage());
                }
            }

            // 3. Update Status and save file path
            $quoteRequest->update([
                'status' => 'quoted',
                'file_path' => $path
            ]);

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
            'vat' => 'nullable|numeric|min:0',
        ]);

        $mode = $request->input('mode', 'create');
        $pdfContent = null;
        $path = null;

        if ($mode === 'upload') {
            $file = $request->file('file');
            if (!$file) {
                return response()->json(['message' => 'File not found.'], 400);
            }
            $path = $file->store('quotations', 'quotations');
            $pdfContent = \Illuminate\Support\Facades\Storage::disk('quotations')->get($path);
        } else {
            // Create dummy request for PDF view context
            $items = $validated['items'] ?? [];
            $quoteRequestForPdf = new QuotationRequest([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'created_at' => now(),
             ]);
             
            $pdf = Pdf::loadView('pdfs.quotation', [
                'request' => $quoteRequestForPdf,
                'items' => $items,
                'message' => $validated['message'] ?? '',
                'vat' => $validated['vat'] ?? 18
            ]);
            $pdfContent = $pdf->output();
            
            $filename = 'quotations/direct_' . time() . '.pdf';
            \Illuminate\Support\Facades\Storage::disk('quotations')->put($filename, $pdfContent);
            $path = $filename;
        }

        // Create Record
        QuotationRequest::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'status' => 'quoted',
            'customer_notes' => $validated['message'] ?? 'Direct Quote initiated by Admin',
            'file_path' => $path
        ]);

        // Send Email
        try {
            $mail = Mail::to($validated['email']);
            if (config('mail.sales.address')) {
                $mail->bcc(config('mail.sales.address'));
            }
            $mail->send(new QuotationReplyMail($pdfContent, $validated['message'] ?? ''));
            
            \Illuminate\Support\Facades\Log::info('Direct quotation email sent successfully', [
                'recipient' => $validated['email'],
                'name' => $validated['name']
            ]);
            
        } catch (\Symfony\Component\Mailer\Exception\TransportException $e) {
            \Illuminate\Support\Facades\Log::error('SMTP Error - Direct Quote Email Failed', [
                'recipient' => $validated['email'],
                'error_type' => 'SMTP_AUTH_FAILURE',
                'exception_message' => $e->getMessage(),
                'suggestion' => 'Check SMTP credentials in .env file'
            ]);
            
            return response()->json([
                'message' => 'Email sending failed: SMTP authentication error.',
                'error' => 'Please contact administrator.'
            ], 500);
            
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Direct Quote Email Failed', [
                'recipient' => $validated['email'],
                'error_type' => 'GENERAL_EMAIL_ERROR',
                'exception_message' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Failed to send email.',
                'error' => $e->getMessage()
            ], 500);
        }

        return response()->json(['message' => 'Direct quotation sent successfully']);
    }

    public function download(Request $request, $id)
    {
        // 1. Find the request to ensure it exists
        $quoteRequest = QuotationRequest::findOrFail($id);

        if (!$quoteRequest->file_path) {
             abort(404, 'No file attached to this quotation.');
        }

        // 2. Find the file on the secure disk
        $disk = \Illuminate\Support\Facades\Storage::disk('quotations');
        $filename = $quoteRequest->file_path;
        
        if (!$disk->exists($filename)) {
             // Fallback: Check if it's stored with full path from 'store()' which might include disk prefix? 
             // store('quotations', 'quotations') stores as 'quotations/filename.pdf' relative to disk root?
             // If we stored 'quotations/...' and disk root is '.../app/private/quotations', do we get double?
             // Check: filesystems.php root is 'app/private/quotations'.
             // $file->store('quotations', 'quotations') puts it in 'app/private/quotations/quotations/...'
             // So $path variable holds 'quotations/...'
             // Accessing disk('quotations')->exists('quotations/...') should work.
             
             abort(404, 'File not found on server.');
        }

        return $disk->download($filename);
    }
}
