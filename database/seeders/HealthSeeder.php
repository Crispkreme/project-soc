<?php

namespace Database\Seeders;

use App\Models\Health;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class HealthSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $patients = User::where('role', 'patient')->get();

        foreach ($patients as $patient) {
            Health::create([
                'patient_id' => $patient->id,
                'name' => 'Chronic Illness',
                'description' => 'Sample description for chronic illness',
            ]);
        }
    }
}
