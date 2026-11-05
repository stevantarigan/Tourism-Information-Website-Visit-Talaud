<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'short_description',
        'description',
        'address',
        'opening_hours',
        'ticket_price',
        'contact',
        'cover_image',
        'view_count',
        'is_active',
    ];

    protected $casts = [
        'view_count' => 'integer',
        'is_active' => 'boolean',
    ];

    public function images()
    {
        return $this->hasMany(DestinationImage::class);
    }
}
