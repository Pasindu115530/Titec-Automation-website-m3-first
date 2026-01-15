<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class QuotationRequestResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'request_id' => $this->id,
            'status' => $this->status, // 'pending', 'quoted', etc.
            'customer_notes' => $this->customer_notes,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'human_date' => $this->created_at->diffForHumans(), // e.g., "2 hours ago"
            
            // Customer Details (Handle guest users smoothly)
            'customer' => [
                'id' => $this->user_id,
                'name' => $this->user ? $this->user->name : 'Guest User',
                'email' => $this->user ? $this->user->email : null,
            ],

            // The List of Requested Items
            'items' => ProductResource::collection($this->whenLoaded('products')),
            
            // If the Admin has already replied with a Quote, include it
            'admin_quotation' => $this->quotation ? [
                'id' => $this->quotation->id,
                'grand_total' => $this->quotation->grand_total,
                'valid_until' => $this->quotation->valid_until,
                'pdf_url' => $this->quotation->pdf_path ? asset('storage/' . $this->quotation->pdf_path) : null,
            ] : null,
        ];
    }
}
