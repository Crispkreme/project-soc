<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'message',
    ];

    public function doctor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
