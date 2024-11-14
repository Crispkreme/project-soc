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
                'password' => Hash::make('admin@0896'),
                'role'     => 'Administration', 
                'username' => 'admin',
            ],
            [
                'email'    => 'practitioner@practitioner.com', 
                'password' => Hash::make('practitioner@0896'),
                'role'     => 'Practitioner', 
                'username' => 'practitioner',
            ],
            [
                'email'    => 'bhw@bhw.com', 
                'password' => Hash::make('bhw@0896'),
                'role'     => 'Bhw', 
                'username' => 'bhw',
            ],
            [
                'email'    => 'patient@patient.com', 
                'password' => Hash::make('patient@0896'),
                'role'     => 'Patient', 
                'username' => 'patient',
            ],
        ];
        
        DB::table('users')->insert($users);
    }
}
