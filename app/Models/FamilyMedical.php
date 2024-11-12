<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FamilyMedical extends Model
{
    use HasFactory;

    protected $fillable = ['patient_id', 'disease', 'relationship_disease'];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }
}
