<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medication extends Model
{
    use HasFactory;
    protected $primaryKey = 'id';
    protected $fillable = [
        'patient_id', 
        'medicine_id', 
        'dosage', 
        'quantity', 
        'reason', 
        'pdf_file',
        'medication_status'
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }
}
