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
        'unit',
        'category',
        'brand',
        'sku',
        'images',
        'datasheet_path',
        'stock_status',
        'on_store',
        'brand_id',
        'show_price',
        'warranty_months',
    ];

    protected $casts = [
        'images' => 'array',
        'price' => 'decimal:2',
        'on_store' => 'boolean',
        'show_price' => 'boolean',
    ];

    public function brand() {
        return $this->belongsTo(Brand::class);
    }

    // Relationship: A product can belong to many quotation requests
    public function quotationRequests()
    {
        return $this->belongsToMany(QuotationRequest::class, 'quotation_request_items')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }

    public function invoiceItems()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    // Stock management methods
    public function deductStock(int $quantity, int $userId, ?int $invoiceId = null): StockMovement
    {
        $stockBefore = $this->stock;
        $this->stock -= $quantity;
        $this->updateStockStatus();
        $this->save();

        return StockMovement::create([
            'product_id' => $this->id,
            'user_id' => $userId,
            'type' => 'sale',
            'quantity' => -$quantity,
            'stock_before' => $stockBefore,
            'stock_after' => $this->stock,
            'reference_type' => 'invoice',
            'reference_id' => $invoiceId,
        ]);
    }

    public function restoreStock(int $quantity, int $userId, ?int $invoiceId = null): StockMovement
    {
        $stockBefore = $this->stock;
        $this->stock += $quantity;
        $this->updateStockStatus();
        $this->save();

        return StockMovement::create([
            'product_id' => $this->id,
            'user_id' => $userId,
            'type' => 'void',
            'quantity' => $quantity,
            'stock_before' => $stockBefore,
            'stock_after' => $this->stock,
            'reference_type' => 'invoice',
            'reference_id' => $invoiceId,
        ]);
    }

    private function updateStockStatus(): void
    {
        if ($this->stock <= 0) {
            $this->stock_status = 'out_of_stock';
        } elseif ($this->stock <= 5) {
            $this->stock_status = 'low_stock';
        } else {
            $this->stock_status = 'in_stock';
        }
    }
}
