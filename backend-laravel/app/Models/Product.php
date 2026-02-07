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
        'price',
        'stock',
        'category',
        'brand',
        'sku',
        'images',
        'datasheet_path',
        'stock_status',
        'on_store',
    ];

    protected $casts = [
        'images' => 'array',
        'price' => 'decimal:2',
        'on_store' => 'boolean',
    ];

    // Relationship: A product can belong to many quotation requests
    public function quotationRequests()
    {
        return $this->belongsToMany(QuotationRequest::class, 'quotation_request_items')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }
}
