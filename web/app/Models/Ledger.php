<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ledger extends Model
{
    use HasFactory;

    protected $fillable = [
        'medicine_id', 
        'sold', 
        'in_stock',
        'expiration_date', 
        'dosage'
    ];

    public function medicine() {
        return $this->belongsTo(Medicine::class);
    }
}
