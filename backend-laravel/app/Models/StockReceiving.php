<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class StockReceiving extends Model
{
    use LogsActivity;

    protected $fillable = [
        'reference_number', 'user_id', 'type', 'notes',
    ];

    // ── Boot ─────────────────────────────────────

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($receiving) {
            if (!$receiving->reference_number) {
                $receiving->reference_number = self::generateReferenceNumber();
            }
        });
    }

    public static function generateReferenceNumber(): string
    {
        $year = now()->year;
        $last = self::whereYear('created_at', $year)->orderBy('id', 'desc')->first();
        $sequence = $last ? intval(substr($last->reference_number, -4)) + 1 : 1;
        return sprintf('SR-%d-%04d', $year, $sequence);
    }

    // ── Relationships ────────────────────────────

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(StockReceivingItem::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    // ── Activity Log ─────────────────────────────

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->useLogName('inventory')
            ->setDescriptionForEvent(fn(string $eventName) => "Stock receiving {$eventName}");
    }

    public function tapActivity(\Spatie\Activitylog\Models\Activity $activity, string $eventName)
    {
        if ($eventName === 'created') {
            $itemCount = $this->items()->count();
            $totalQty = $this->items()->sum('quantity');
            $typeLabel = $this->type === 'received' ? 'Restocking' : ucfirst($this->type);
            $activity->description = "{$typeLabel} #{$this->reference_number}: {$itemCount} products, {$totalQty} total units";
        }
    }
}
