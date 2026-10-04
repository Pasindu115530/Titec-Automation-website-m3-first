<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'image_path',
        'slug',
        'sort_order',
    ];

    public function items()
    {
        return $this->hasMany(ServiceItem::class)->orderBy('sort_order');
    }
}
