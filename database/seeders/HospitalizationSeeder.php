<?php

namespace Database\Seeders;

use App\Models\Hospital;
use App\Models\Hospitalization;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class HospitalizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $hospitals = Hospital::all();
        $patients = User::where('role', 'Patient')->get();
        $doctors = User::where('role', 'Practitioner')->get();

        foreach ($patients as $patient) {
            Hospitalization::create([
                'hospital_id' => $hospitals->random()->id,
                'doctor_id' => $doctors->random()->id,
                'patient_id' => $patient->id,
                'diagnosis' => 'Pneumonia',
            ]);
        }
    }
}
