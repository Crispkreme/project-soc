<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 
        'firstname', 
        'middlename',
        'lastname', 
        'gender', 
        'birthday', 
        'civil_status', 
        'status',
        'religion', 
        'address',
        'profile'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function patient() {
        return $this->hasOne(Patient::class);
    }

    public function scopeWhereUser(Builder $query, $id)
    {
        return $query->where('user_id', $id);
    }
}
