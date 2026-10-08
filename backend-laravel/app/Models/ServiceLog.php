<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServiceLog extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid', 'client_id', 'invoice_item_id', 'product_id',
        'technician_id', 'title', 'description', 'diagnosis',
        'resolution', 'service_type', 'is_under_warranty',
        'is_chargeable', 'service_charge', 'service_date',
        'next_service_date', 'status', 'photos', 'sync_status', 'notes',
    ];

    protected $casts = [
        'service_date' => 'date',
        'next_service_date' => 'date',
        'service_charge' => 'decimal:2',
        'is_under_warranty' => 'boolean',
        'is_chargeable' => 'boolean',
        'photos' => 'array',
    ];

    // ── Relationships ────────────────────────────

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function invoiceItem()
    {
        return $this->belongsTo(InvoiceItem::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function technician()
    {
        return $this->belongsTo(User::class, 'technician_id');
    }

    // ── Business Logic ───────────────────────────

    /**
     * Auto-detect warranty status from linked invoice item.
     */
    public function checkWarranty(): void
    {
        if ($this->invoiceItem && $this->invoiceItem->isUnderWarranty()) {
            $this->is_under_warranty = true;
            $this->is_chargeable = false;
        }
    }
}
