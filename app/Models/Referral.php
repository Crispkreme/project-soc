<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Referral extends Model
{
    use HasFactory;

    protected $fillable = ['doctor_id', 'patient_id', 'refer_to_id', 'reason', 'referral_status'];

    public function doctor() {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function patient() {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function referTo() {
        return $this->belongsTo(User::class, 'refer_to_id');
    }
}
