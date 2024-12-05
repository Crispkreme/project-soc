<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'medicine_id', 
        'encode_by_id', 
        'usage', 
        'quantity', 
    ];

    public function medicine() {
        return $this->belongsTo(Medicine::class);
    }

    public function encoder() {
        return $this->belongsTo(User::class, 'encode_by_id');
    }
}
