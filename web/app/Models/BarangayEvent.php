<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BarangayEvent extends Model
{
    protected $fillable = [
        'doctor_id',
        'bhw_id',
        'event_name',
        'event_date',
        'event_start',
        'event_end',
        'event_venue',
    ];

    public function doctor()
    {
        return $this->belongsTo(UserDetail::class, 'doctor_id');
    }

    public function bhw()
    {
        return $this->belongsTo(UserDetail::class, 'bhw_id');
    }
}
