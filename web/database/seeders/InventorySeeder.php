<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $inventories = [
            [
                'medicine_id' => 1,
                'encode_by_id' => 1,
                'usage' => '3x a day',
                'quantity' => 10,
            ],
            [
                'medicine_id' => 2,
                'encode_by_id' => 1,
                'usage' => '3x a day',
                'quantity' => 10,
            ],
            [
                'medicine_id' => 3,
                'encode_by_id' => 1,
                'usage' => '3x a day',
                'quantity' => 10,
            ],
            [
                'medicine_id' => 4,
                'encode_by_id' => 1,
                'usage' => '3x a day',
                'quantity' => 10,
            ],
            [
                'medicine_id' => 5,
                'encode_by_id' => 1,
                'usage' => '3x a day',
                'quantity' => 10,
            ],
            [
                'medicine_id' => 6,
                'encode_by_id' => 1,
                'usage' => '3x a day',
                'quantity' => 10,
            ],
            [
                'medicine_id' => 7,
                'encode_by_id' => 1,
                'usage' => '3x a day',
                'quantity' => 10,
            ],
            [
                'medicine_id' => 8,
                'encode_by_id' => 1,
                'usage' => '3x a day',
                'quantity' => 10,
            ],
            [
                'medicine_id' => 9,
                'encode_by_id' => 1,
                'usage' => '3x a day',
                'quantity' => 10,
            ],
            [
                'medicine_id' => 10,
                'encode_by_id' => 1,
                'usage' => '3x a day',
                'quantity' => 10,
            ],
            [
                'medicine_id' => 11,
                'encode_by_id' => 1,
                'usage' => '3x a day',
                'quantity' => 10,
            ],
            [
                'medicine_id' => 12,
                'encode_by_id' => 1,
                'usage' => '3x a day',
                'quantity' => 10,
            ],
            [
                'medicine_id' => 13,
                'encode_by_id' => 1,
                'usage' => '3x a day',
                'quantity' => 10,
            ],
            [
                'medicine_id' => 14,
                'encode_by_id' => 1,
                'usage' => '3x a day',
                'quantity' => 10,
            ],
            [
                'medicine_id' => 15,
                'encode_by_id' => 1,
                'usage' => '3x a day',
                'quantity' => 10,
            ],
            [
                'medicine_id' => 16,
                'encode_by_id' => 1,
                'usage' => '3x a day',
                'quantity' => 10,
            ],
            [
                'medicine_id' => 17,
                'encode_by_id' => 1,
                'usage' => '3x a day',
                'quantity' => 10,
            ],
            [
                'medicine_id' => 18,
                'encode_by_id' => 1,
                'usage' => '3x a day',
                'quantity' => 10,
            ],
            [
                'medicine_id' => 19,
                'encode_by_id' => 1,
                'usage' => '3x a day',
                'quantity' => 10,
            ],
            [
                'medicine_id' => 20,
                'encode_by_id' => 1,
                'usage' => '3x a day',
                'quantity' => 10,
            ],
        ];
         
        DB::table('inventories')->insert($inventories);
    }
}
