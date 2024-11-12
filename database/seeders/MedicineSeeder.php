<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MedicineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $medicines = [
           [
                'medicine_name' => 'Paracetamol',
                'description' => 'Used for pain relief and fever reduction.'
            ],
            [
                'medicine_name' => 'Ibuprofen',
                'description' => 'Anti-inflammatory drug used to reduce pain and swelling.'
            ],
            [
                'medicine_name' => 'Amoxicillin',
                'description' => 'Antibiotic used for treating bacterial infections.'
            ],
            [
                'medicine_name' => 'Cetirizine',
                'description' => 'Antihistamine used for allergy relief.'
            ],
            [
                'medicine_name' => 'Amlodipine',
                'description' => 'Used to treat high blood pressure and angina.'
            ],
            [
                'medicine_name' => 'Metformin',
                'description' => 'Medication for managing type 2 diabetes.'
            ],
            [
                'medicine_name' => 'Omeprazole',
                'description' => 'Used for acid reflux and stomach ulcers.'
            ],
            [
                'medicine_name' => 'Simvastatin',
                'description' => 'Lowers cholesterol and reduces risk of heart disease.'
            ],
            [
                'medicine_name' => 'Losartan',
                'description' => 'Medication for high blood pressure management.'
            ],
            [
                'medicine_name' => 'Gabapentin',
                'description' => 'Used to treat nerve pain and seizures.'
            ],
            [
                'medicine_name' => 'Levothyroxine',
                'description' => 'Hormone replacement for thyroid deficiency.'
            ],
            [
                'medicine_name' => 'Ciprofloxacin',
                'description' => 'Antibiotic used to treat various bacterial infections.'
            ],
            [
                'medicine_name' => 'Alprazolam',
                'description' => 'Used to treat anxiety and panic disorders.'
            ],
            [
                'medicine_name' => 'Warfarin',
                'description' => 'Blood thinner used to prevent blood clots.'
            ],
            [
                'medicine_name' => 'Prednisone',
                'description' => 'Steroid used to reduce inflammation.'
            ],
            [
                'medicine_name' => 'Azithromycin',
                'description' => 'Antibiotic used for respiratory and skin infections.'
            ],
            [
                'medicine_name' => 'Clonazepam',
                'description' => 'Used to treat seizures and panic disorders.'
            ],
            [
                'medicine_name' => 'Hydrochlorothiazide',
                'description' => 'Diuretic used to treat high blood pressure.'
            ],
            [
                'medicine_name' => 'Insulin',
                'description' => 'Hormone used to control blood sugar in diabetes.'
            ],
            [
                'medicine_name' => 'Lisinopril',
                'description' => 'Medication for high blood pressure and heart failure.'
            ],
        ];
        
        DB::table('medicines')->insert($medicines);
    }
}
