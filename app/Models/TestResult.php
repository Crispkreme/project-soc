<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestResult extends Model
{
    use HasFactory;

    protected $fillable = ['patient_id', 'name', 'result', 'pdf_file'];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }
}
