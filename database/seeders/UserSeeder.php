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
        ];
        
        DB::table('users')->insert($users);
    }
}
