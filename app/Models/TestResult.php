<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestResult extends Model
{
    use HasFactory;

    protected $fillable = ['patient_id', 'name', 'result'];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }
}
