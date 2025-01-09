<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    use HasFactory;

    protected $fillable = ['medicine_name', 'description'];

    public function inventories() {
        return $this->hasMany(Inventory::class);
    }

    public function ledgers() {
        return $this->hasMany(Ledger::class);
    }

    public function prescriptions() {
        return $this->hasMany(Prescription::class);
    }

    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class);
    }
}
