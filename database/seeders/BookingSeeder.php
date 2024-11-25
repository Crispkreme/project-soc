<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        
        $bookings = [
            [
                'approve_by_id'     => 2, 
                'patient_id'        => 4,
                'title'             => 'Routine Checkup',
                'appointment_date'  => '2024-11-07',
                'appointment_start' => '09:13:00',
                'appointment_end'   => '10:00:00',
                'approved_date'     => null,
                'booking_status'    => 'Approve',
                'notes'             => $faker->sentence(),
            ],
            [
                'approve_by_id'     => 2,
                'patient_id'        => 4,
                'title'             => 'Vaccination',
                'appointment_date'  => '2024-11-08',
                'appointment_start' => '11:30:00',
                'appointment_end'   => '12:00:00',
                'approved_date'     => null,
                'booking_status'    => 'Pending',
                'notes'             => $faker->sentence(),
            ],
            [
                'approve_by_id'     => 2,
                'patient_id'        => 4,
                'title'             => 'Dental Cleaning',
                'appointment_date'  => '2024-11-09',
                'appointment_start' => '14:00:00',
                'appointment_end'   => '15:00:00',
                'approved_date'     => null,
                'booking_status'    => 'Success',
                'notes'             => $faker->sentence(),
            ]
        ];

        DB::table('bookings')->insert($bookings);
    }
}
