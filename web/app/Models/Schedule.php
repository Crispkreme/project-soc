<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $table = 'schedules';

    protected $fillable = [
        'doctor_id',
        'barangay_event_id',
        'notes',
        'appointment_date',
        'appointment_start',
        'appointment_end',
    ];

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function barangayEvent()
    {
        return $this->belongsTo(BarangayEvent::class, 'barangay_event_id');
    }
}
