<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'email'    => 'admin@admin.com', 
                'password' => Hash::make('admin'),
                'role'     => 'Administration', 
                'username' => 'admin',
            ],
            [
                'email'    => 'practitioner@practitioner.com', 
                'password' => Hash::make('practitioner'),
                'role'     => 'Practitioner', 
                'username' => 'practitioner',
            ],
            [
                'email'    => 'bhw@bhw.com', 
                'password' => Hash::make('bhw'),
                'role'     => 'Bhw', 
                'username' => 'bhw',
            ],
            [
                'email'    => 'patient@patient.com', 
                'password' => Hash::make('patient'),
                'role'     => 'Patient', 
                'username' => 'patient',
            ],
            [
                'email'    => 'patient1@patient1.com', 
                'password' => Hash::make('patient1'),
                'role'     => 'Patient', 
                'username' => 'patient1',
            ],
            [
                'email'    => 'patient2@patient2.com', 
                'password' => Hash::make('patient2'),
                'role'     => 'Patient', 
                'username' => 'patient2',
            ],
            [
                'email'    => 'patient3@patient3.com', 
                'password' => Hash::make('patient3'),
                'role'     => 'Patient', 
                'username' => 'patient3',
            ],
            [
                'email'    => 'patient4@patient4.com', 
                'password' => Hash::make('patient4'),
                'role'     => 'Patient', 
                'username' => 'patient4',
            ],
            [
                'email'    => 'patient5@patient5.com', 
                'password' => Hash::make('patient5'),
                'role'     => 'Patient', 
                'username' => 'patient5',
            ],
        ];
        
        DB::table('users')->insert($users);
    }
}
