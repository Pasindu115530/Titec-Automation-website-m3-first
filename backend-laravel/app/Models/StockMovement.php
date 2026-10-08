<?php

namespace App\Models;

use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    protected $fillable = [
        'product_id', 'user_id', 'type', 'quantity',
        'stock_before', 'stock_after', 'reference_type',
        'reference_id', 'stock_receiving_id', 'notes',
    ];

    protected $appends = ['movement_type'];

    public function getMovementTypeAttribute()
    {
        // Normalize for frontend
        return $this->type === 'sale' ? 'sold' : $this->type;
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->useLogName('inventory')
            ->setDescriptionForEvent(fn(string $eventName) => "Stock movement {$eventName}");
    }

    public function tapActivity(\Spatie\Activitylog\Models\Activity $activity, string $eventName)
    {
        if ($eventName === 'created') {
            $this->load('product');
            $productName = $this->product ? $this->product->name : 'Unknown Product';
            $sign = $this->quantity > 0 ? '+' : '';
            $activity->description = "Stock {$this->type} for {$productName}: {$sign}{$this->quantity} units";
        }
    }
}
