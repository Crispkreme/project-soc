<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = ['user_detail_id', 'guardian_name', 'address'];

    public function userDetail() {
        return $this->belongsTo(UserDetail::class);
    }
}
