<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockReceivingItem extends Model
{
    protected $fillable = [
        'stock_receiving_id', 'product_id', 'quantity',
        'stock_before', 'stock_after',
    ];

    public function stockReceiving()
    {
        return $this->belongsTo(StockReceiving::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
