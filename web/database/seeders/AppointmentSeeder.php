<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $doctorIds = User::where('role', 'Practitioner')->pluck('id')->toArray();
        $bookingIds = Booking::pluck('id')->toArray();

        $statuses = ['Inprogress', 'Pending', 'Success', 'Failed'];

        for ($i = 0; $i < 10; $i++) {
            Appointment::create([
                'booking_id' => $bookingIds ? $bookingIds[array_rand($bookingIds)] : null,
                'doctor_id' => $doctorIds ? $doctorIds[array_rand($doctorIds)] : null,
                'slot' => rand(1, 10),
                'appointment_status' => $statuses[array_rand($statuses)],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
