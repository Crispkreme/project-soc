<?php

namespace Database\Seeders;

use App\Models\FamilyMedical;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class FamilyMedicalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $patients = User::where('role', 'patient')->get();

        foreach ($patients as $patient) {
            FamilyMedical::create([
                'patient_id' => $patient->id,
                'disease' => 'Diabetes',
                'relationship_disease' => 'Mother Family Disease',
            ]);
        }
    }
}
