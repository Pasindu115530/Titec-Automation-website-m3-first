<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Invoice extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid', 'invoice_number', 'client_id', 'created_by',
        'subtotal', 'tax_rate', 'tax_amount', 'discount_amount',
        'discount_type', 'grand_total', 'status', 'payment_method',
        'amount_paid', 'payment_date', 'pdf_path', 'notes', 'terms',
        'due_date', 'sync_status', 'synced_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'payment_date' => 'date',
        'due_date' => 'date',
        'synced_at' => 'datetime',
    ];

    // ── Boot ─────────────────────────────────────

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($invoice) {
            if (!$invoice->uuid) {
                $invoice->uuid = (string) Str::uuid();
            }
            if (!$invoice->invoice_number) {
                $invoice->invoice_number = self::generateInvoiceNumber();
            }
        });
    }

    public static function generateInvoiceNumber(): string
    {
        $year = now()->year;
        $lastInvoice = self::whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastInvoice
            ? intval(substr($lastInvoice->invoice_number, -4)) + 1
            : 1;

        return sprintf('INV-%d-%04d', $year, $sequence);
    }

    // ── Relationships ────────────────────────────

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function installation()
    {
        return $this->hasOne(Installation::class);
    }

    public function stockMovements()
    {
        return $this->morphMany(StockMovement::class, 'reference');
    }

    // ── Business Logic ───────────────────────────

    public function calculateTotals(): void
    {
        $this->subtotal = $this->items->sum('line_total');

        if ($this->discount_type === 'percentage') {
            $discountValue = $this->subtotal * ($this->discount_amount / 100);
        } else {
            $discountValue = $this->discount_amount;
        }

        $taxableAmount = $this->subtotal - $discountValue;
        $this->tax_amount = $taxableAmount * ($this->tax_rate / 100);
        $this->grand_total = $taxableAmount + $this->tax_amount;
    }

    public function getBalanceDueAttribute(): float
    {
        return $this->grand_total - $this->amount_paid;
    }

    public function isPaid(): bool
    {
        return $this->amount_paid >= $this->grand_total;
    }

    // ── Scopes ───────────────────────────────────

    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeDateRange($query, $from, $to)
    {
        return $query->whereBetween('created_at', [$from, $to]);
    }
}
