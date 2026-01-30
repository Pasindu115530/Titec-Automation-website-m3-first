<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

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
    ];

    protected $casts = [
        'images' => 'array',
        'price' => 'decimal:2',
    ];

    // Relationship: A product can belong to many quotation requests
    public function quotationRequests()
    {
        return $this->belongsToMany(QuotationRequest::class, 'quotation_request_items')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }
}
