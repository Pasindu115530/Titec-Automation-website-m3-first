<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class QuotationReplyMail extends Mailable
{
    public $pdfPath;
    public $adminMessage;

    /**
     * Create a new message instance.
     */
    public function __construct($pdfPath, $adminMessage)
    {
        $this->pdfPath = $pdfPath;
        $this->adminMessage = $adminMessage;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Quotation for your Request - Titec Automation',
            replyTo: [
                new \Illuminate\Mail\Mailables\Address(
                    config('mail.sales.address'), 
                    config('mail.sales.name')
                )
            ],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.quotation_reply',
            with: ['adminMessage' => $this->adminMessage],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        // Only attach PDF if path is provided
        if ($this->pdfPath) {
            return [
                \Illuminate\Mail\Mailables\Attachment::fromStorageDisk('quotations', $this->pdfPath)
                    ->as('Quotation.pdf')
                    ->withMime('application/pdf'),
            ];
        }
        
        return [];
    }
}
