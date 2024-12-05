<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            UserDetailSeeder::class,
            MedicineSeeder::class,
            InventorySeeder::class,
            LedgerSeeder::class,
            BookingSeeder::class,
            HospitalSeeder::class,
            MedicalRecordSeeder::class,
            HealthSeeder::class,
            SurgicalSeeder::class,
            MedicationSeeder::class,
            FamilyMedicalSeeder::class,
            TestResultSeeder::class,
            ImmunizationSeeder::class,
            HospitalizationSeeder::class,
            BarangayEventSeeder::class,
            AppointmentSeeder::class,
            MessageSeeder::class,
        ]);
    }
}
