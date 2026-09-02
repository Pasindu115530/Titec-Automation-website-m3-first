<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstallationNote extends Model
{
    protected $fillable = ['installation_id', 'user_id', 'content', 'attachments'];

    protected $casts = [
        'attachments' => 'array',
    ];

    public function installation()
    {
        return $this->belongsTo(Installation::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
