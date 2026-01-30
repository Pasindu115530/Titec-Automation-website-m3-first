<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'client',
        'location',
        'description',
        'completion_date',
        'status',
        'technologies',
        'thumbnail_path',
        'project_image_urls',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'completion_date' => 'date',
        'technologies' => 'array',
        'project_image_urls' => 'array',
    ];
}
