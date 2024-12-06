<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalRecord extends Model
{
    use HasFactory;

    protected $fillable = ['patient_id', 'medicine_id', 'diagnosis', 'pdf_file'];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }
}
