<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id', 
        'doctor_id', 
        'slot',
        'appointment_status'
    ];

    public function booking() {
        return $this->belongsTo(Booking::class);
    }

    public function doctor() {
        return $this->belongsTo(UserDetail::class, 'doctor_id');
    }
}
