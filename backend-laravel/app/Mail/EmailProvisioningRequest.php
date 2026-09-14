<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class EmailProvisioningRequest extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $password;
    public $confirmUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, string $password, string $confirmUrl)
    {
        $this->user = $user;
        $this->password = $password;
        $this->confirmUrl = $confirmUrl;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[ACTION REQUIRED] Create Email Account: ' . $this->user->email,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.provisioning_request',
            with: [
                'user' => $this->user,
                'password' => $this->password,
                'confirmUrl' => $this->confirmUrl,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
