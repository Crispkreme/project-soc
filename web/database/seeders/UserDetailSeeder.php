<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UserDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $userDetails = [
            [
                'user_id'      => 1,
                'firstname'    => $faker->firstName,
                'middlename'   => $faker->firstName,
                'lastname'     => $faker->lastName,
                'gender'       => 'Male',
                'birthday'     => $faker->date($format = 'Y-m-d', $max = 'now'),
                'civil_status' => 'Single',
                'religion'     => $faker->word,
                'profile'      => null,
            ],
            [
                'user_id'      => 2,
                'firstname'    => $faker->firstName,
                'middlename'   => $faker->firstName,
                'lastname'     => $faker->lastName,
                'gender'       => 'Male',
                'birthday'     => $faker->date($format = 'Y-m-d', $max = 'now'),
                'civil_status' => 'Single',
                'religion'     => $faker->word,
                'profile'      => null,
            ],
            [
                'user_id'      => 3,
                'firstname'    => $faker->firstName,
                'middlename'   => $faker->firstName,
                'lastname'     => $faker->lastName,
                'gender'       => 'Male',
                'birthday'     => $faker->date($format = 'Y-m-d', $max = 'now'),
                'civil_status' => 'Single',
                'religion'     => $faker->word,
                'profile'      => null,
            ],
            [
                'user_id'      => 4,
                'firstname'    => $faker->firstName,
                'middlename'   => $faker->firstName,
                'lastname'     => $faker->lastName,
                'gender'       => 'Male',
                'birthday'     => $faker->date($format = 'Y-m-d', $max = 'now'),
                'civil_status' => 'Single',
                'religion'     => $faker->word,
                'profile'      => null,
            ],
        ];

        DB::table('user_details')->insert($userDetails);
    }
}
