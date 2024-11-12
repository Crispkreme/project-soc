<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LedgerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ledgers = [
            [
                'medicine_id' => 1,
                'sold' => 0,
                'in_stock' => 10,
            ],
            [
                'medicine_id' => 2,
                'sold' => 0,
                'in_stock' => 10,
            ],
            [
                'medicine_id' => 3,
                'sold' => 0,
                'in_stock' => 10,
            ],
            [
                'medicine_id' => 4,
                'sold' => 0,
                'in_stock' => 10,
            ],
            [
                'medicine_id' => 5,
                'sold' => 0,
                'in_stock' => 10,
            ],
            [
                'medicine_id' => 6,
                'sold' => 0,
                'in_stock' => 10,
            ],
            [
                'medicine_id' => 7,
                'sold' => 0,
                'in_stock' => 10,
            ],
            [
                'medicine_id' => 8,
                'sold' => 0,
                'in_stock' => 10,
            ],
            [
                'medicine_id' => 9,
                'sold' => 0,
                'in_stock' => 10,
            ],
            [
                'medicine_id' => 10,
                'sold' => 0,
                'in_stock' => 10,
            ],
            [
                'medicine_id' => 11,
                'sold' => 0,
                'in_stock' => 10,
            ],
            [
                'medicine_id' => 12,
                'sold' => 0,
                'in_stock' => 10,
            ],
            [
                'medicine_id' => 13,
                'sold' => 0,
                'in_stock' => 10,
            ],
            [
                'medicine_id' => 14,
                'sold' => 0,
                'in_stock' => 10,
            ],
            [
                'medicine_id' => 15,
                'sold' => 0,
                'in_stock' => 10,
            ],
            [
                'medicine_id' => 16,
                'sold' => 0,
                'in_stock' => 10,
            ],
            [
                'medicine_id' => 17,
                'sold' => 0,
                'in_stock' => 10,
            ],
            [
                'medicine_id' => 18,
                'sold' => 0,
                'in_stock' => 10,
            ],
            [
                'medicine_id' => 19,
                'sold' => 0,
                'in_stock' => 10,
            ],
            [
                'medicine_id' => 20,
                'sold' => 0,
                'in_stock' => 10,
            ],
        ];
         
        DB::table('ledgers')->insert($ledgers);
    }
}
