<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{
    use HasFactory;

    protected $fillable = [
        'quotation_request_id',
        'admin_id',
        'grand_total',
        'pdf_path',
        'valid_until',
        'remarks'
    ];

    protected $casts = [
        'valid_until' => 'date', // Casts to Carbon date object
    ];

    // Link back to the original request
    public function request()
    {
        return $this->belongsTo(QuotationRequest::class, 'quotation_request_id');
    }

    // Which admin created this?
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}