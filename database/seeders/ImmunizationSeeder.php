<?php

namespace Database\Seeders;

use App\Models\Immunization;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ImmunizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $patients = User::where('role', 'Patient')->get();
        $doctors = User::where('role', 'Practitioner')->get();

        foreach ($patients as $patient) {
            Immunization::create([
                'doctor_id' => $doctors->random()->id,
                'patient_id' => $patient->id,
                'immunization' => 'Polio Vaccine',
            ]);
        }
    }
}
