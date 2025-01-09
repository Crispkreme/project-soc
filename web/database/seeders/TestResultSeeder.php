<?php

namespace Database\Seeders;

use App\Models\TestResult;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TestResultSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $patients = User::where('role', 'patient')->get();

        foreach ($patients as $patient) {
            TestResult::create([
                'patient_id' => $patient->id,
                'name' => 'Blood Test',
                'result' => 'Normal',
            ]);
        }
    }
}
