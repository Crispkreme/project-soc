<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'approve_by_id', 
        'patient_id', 
        'barangay_event_id', 
        'title',
        'reason', 
        'notes', 
        'appointment_date', 
        'appointment_start', 
        'appointment_end', 
        'approved_date', 
        'booking_status'
    ];

    public function approver() {
        return $this->belongsTo(UserDetail::class, 'approve_by_id');
    }

    public function patient() {
        return $this->belongsTo(UserDetail::class, 'patient_id');
    }

    public function barangayEvent() {
        return $this->belongsTo(BarangayEvent::class, 'barangay_event_id');
    }
}
