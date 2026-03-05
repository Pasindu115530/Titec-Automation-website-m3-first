<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'model_number' => $this->model_number, // Crucial for your automation client
            'description' => $this->description,
            'show_price' => $this->show_price,
            // Ensure full URL is sent to frontend if images are stored locally
            'images' => $this->images ? array_map(function($img) {
                return asset('storage/' . $img); 
            }, $this->images) : [],
            'datasheet' => $this->datasheet_path ? asset('storage/' . $this->datasheet_path) : null,
            'stock_status' => $this->stock_status,
            // Only include quantity if this product is part of a request (Pivot table check)
            'quantity_requested' => $this->whenPivotLoaded('quotation_request_items', function () {
                return $this->pivot->quantity;
            }),
        ];
    }
}
