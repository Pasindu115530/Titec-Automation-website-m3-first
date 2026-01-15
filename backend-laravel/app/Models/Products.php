<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'model_number', 
        'slug',
        'description', 
        'images', 
        'datasheet_path', 
        'stock_status'
    ];

    // AUTOMATION: Automatically converts JSON to Array and vice-versa
    protected $casts = [
        'images' => 'array', 
    ];

    // Relationship: A product can belong to many quotation requests
    public function quotationRequests()
    {
        return $this->belongsToMany(QuotationRequest::class, 'quotation_request_items')
                    ->withPivot('quantity') // Important to access quantity
                    ->withTimestamps();
    }
}


