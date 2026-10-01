<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id', 'product_id', 'product_name', 'product_model',
        'product_sku', 'serial_number', 'unit_price', 'quantity',
        'unit', 'line_total', 'warranty_months', 'warranty_start_date',
        'warranty_end_date', 'notes',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'line_total' => 'decimal:2',
        'warranty_start_date' => 'date',
        'warranty_end_date' => 'date',
    ];

    // ── Boot ─────────────────────────────────────

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($item) {
            $item->line_total = $item->unit_price * $item->quantity;
        });

        static::updating(function ($item) {
            $item->line_total = $item->unit_price * $item->quantity;
        });
    }

    // ── Relationships ────────────────────────────

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function serviceLogs()
    {
        return $this->hasMany(ServiceLog::class);
    }

    // ── Business Logic ───────────────────────────

    public function isUnderWarranty(): bool
    {
        if (!$this->warranty_end_date) {
            return false;
        }
        return now()->lte($this->warranty_end_date);
    }

    /**
     * Set warranty dates based on a confirmation date and warranty_months.
     */
    public function setWarrantyDates(?\Carbon\Carbon $startDate = null): void
    {
        $start = $startDate ?? now();
        $this->warranty_start_date = $start;

        if ($this->warranty_months > 0) {
            $this->warranty_end_date = $start->copy()->addMonths($this->warranty_months);
        }
    }
}
