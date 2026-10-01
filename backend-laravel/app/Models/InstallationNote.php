<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstallationNote extends Model
{
    protected $fillable = [
        'installation_id', 'user_id', 'content', 'attachments',
        'type', 'cost_amount', 'cost_description',
        'review_status', 'reviewed_by', 'reviewed_at', 'rejection_reason',
    ];

    protected $casts = [
        'attachments'  => 'array',
        'cost_amount'  => 'decimal:2',
        'reviewed_at'  => 'datetime',
    ];

    protected $appends = ['image_urls'];

    // ── Note types that require accountant review ──
    public const REVIEWABLE_TYPES = ['extra_cost', 'defect', 'additional_parts'];

    // ── Accessors ────────────────────────────────────

    /**
     * Legacy single-image accessor (backward compatible).
     */
    public function getImageUrlAttribute()
    {
        if (is_array($this->attachments) && count($this->attachments) > 0) {
            return $this->attachments[0];
        }
        return null;
    }

    /**
     * All image URLs for multi-image support.
     */
    public function getImageUrlsAttribute(): array
    {
        return is_array($this->attachments) ? $this->attachments : [];
    }

    // ── Relationships ────────────────────────────────

    public function installation()
    {
        return $this->belongsTo(Installation::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviewedByUser()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    // ── Query Scopes ─────────────────────────────────

    public function scopePendingReview($query)
    {
        return $query->where('review_status', 'pending');
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    // ── Business Logic ───────────────────────────────

    /**
     * Does this note type require accountant review?
     */
    public function requiresReview(): bool
    {
        return in_array($this->type, self::REVIEWABLE_TYPES);
    }
}
