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
    public $pdfContent;
    public $adminMessage;

    /**
     * Create a new message instance.
     */
    public function __construct($pdfContent, $adminMessage)
    {
        $this->pdfContent = $pdfContent;
        $this->adminMessage = $adminMessage;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new \Illuminate\Mail\Mailables\Address(
                config('mail.sales.address'), 
                config('mail.sales.name')
            ),
            subject: 'Quotation for your Request - Titec Automation',
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
        return [
            \Illuminate\Mail\Mailables\Attachment::fromData(fn () => $this->pdfContent, 'Quotation.pdf')
                ->withMime('application/pdf'),
        ];
    }
}
