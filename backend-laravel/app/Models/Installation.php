<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Installation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'reference_number', 'client_id', 'invoice_id', 'title',
        'description', 'location', 'location_coordinates', 'status',
        'scheduled_date', 'started_date', 'completed_date',
        'priority', 'notes',
    ];

    protected $casts = [
        'scheduled_date' => 'date',
        'started_date' => 'date',
        'completed_date' => 'date',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($installation) {
            if (!$installation->reference_number) {
                $installation->reference_number = self::generateReferenceNumber();
            }
        });
    }

    public static function generateReferenceNumber(): string
    {
        $year = now()->year;
        $last = self::whereYear('created_at', $year)->orderBy('id', 'desc')->first();
        $sequence = $last ? intval(substr($last->reference_number, -4)) + 1 : 1;
        return sprintf('INST-%d-%04d', $year, $sequence);
    }

    // ── Relationships ────────────────────────────

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function technicians()
    {
        return $this->belongsToMany(User::class, 'installation_technicians')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    public function notes()
    {
        return $this->hasMany(InstallationNote::class)->orderBy('created_at', 'desc');
    }

    // ── Scopes ───────────────────────────────────

    public function scopeAssignedTo($query, int $userId)
    {
        return $query->whereHas('technicians', fn($q) => $q->where('user_id', $userId));
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['scheduled', 'in_progress']);
    }
}
