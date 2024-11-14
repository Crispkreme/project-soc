<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BarangayEventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = [
            [
                'doctor_id'   => 2, 
                'bhw_id'      => 3,
                'event_name'  => 'Operation Tuli',
                'event_date'  => '2024-10-07',
                'event_start' => '08:10:00',
                'event_end'   => '05:30:00',
                'event_venue' => 'Barangay Hall',
            ],
            [
                'doctor_id'   => 2, 
                'bhw_id'      => 3,
                'event_name'  => 'Brigada Eskwela',
                'event_date'  => '2024-11-07',
                'event_start' => '08:10:00',
                'event_end'   => '05:30:00',
                'event_venue' => 'Elementary School',
            ],
        ];

        DB::table('barangay_events')->insert($events);
    }
}
