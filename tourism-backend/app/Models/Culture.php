<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Culture extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'image',
        'description',
        'event_date',
        'location',
    ];

    protected $casts = [
        'event_date' => 'date',
    ];
}