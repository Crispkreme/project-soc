<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalCertificate extends Model
{
    use HasFactory;

    protected $fillable = ['patient_id', 'doctor_id', 'examin_date', 'issue_date', 'purpose'];

    public function patient()
    {
        return $this->belongsTo(UserDetail::class, 'patient_id');
    }

    public function doctor()
    {
        return $this->belongsTo(UserDetail::class, 'doctor_id');
    }
}
