<?php

namespace Database\Seeders;

use App\Models\Hospital;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class HospitalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Faker::create();

        foreach (range(1, 10) as $index) {
            Hospital::create([
                'name' => $faker->company,
                'address' => $faker->address,
                'email' => $faker->unique()->safeEmail,
                'phone' => $faker->unique()->phoneNumber,
            ]);
        }
    }
}
