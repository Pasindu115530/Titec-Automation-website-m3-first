<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuotationRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 
        'customer_notes', 
        'status' // pending, quoted, closed
    ];

    // 1. Who asked for this?
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 2. What products did they ask for?
    public function products()
    {
        return $this->belongsToMany(Product::class, 'quotation_request_items')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }

    // 3. Has the admin replied?
    public function quotation()
    {
        return $this->hasOne(Quotation::class);
    }
}