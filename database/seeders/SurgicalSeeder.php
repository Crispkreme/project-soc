<?php

namespace Database\Seeders;

use App\Models\Surgical;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SurgicalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $patients = User::where('role', 'Patient')->get();
        $doctors = User::where('role', 'Practitioner')->get();

        foreach ($patients as $patient) {
            Surgical::create([
                'patient_id' => $patient->id,
                'doctor_id' => $doctors->random()->id,
                'procedure' => 'Appendectomy',
                'description' => 'Removal of the appendix',
            ]);
        }
    }
}
