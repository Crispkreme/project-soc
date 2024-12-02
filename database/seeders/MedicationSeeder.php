<?php

namespace Database\Seeders;

use App\Models\Medication;
use App\Models\Medicine;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class MedicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $patients = User::where('role', 'patient')->get();
        $medicines = Medicine::all();

        foreach ($patients as $patient) {
            Medication::create([
                'patient_id' => $patient->id,
                'medicine_id' => $medicines->random()->id,
                'dosage' => '5',
                'quantity' => '5',
                'reason' => 'Headache',
            ]);
        }
    }
}
