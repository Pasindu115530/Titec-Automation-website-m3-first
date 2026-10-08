<?php

namespace App\Models;

use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceCategory extends Model
{
    use LogsActivity, HasFactory;

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


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->useLogName('services')
            ->setDescriptionForEvent(fn(string $eventName) => "ServiceCategory {$eventName}");
    }
}
