<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $messages = [
            [
                'sender_id' => 1,
                'receiver_id' => 3,
                'message' => 'Hello, how can I assist you today?',
            ],
            [
                'sender_id' => 3,
                'receiver_id' => 1,
                'message' => 'I need help with a patient.',
            ],
            [
                'sender_id' => 1,
                'receiver_id' => 3,
                'message' => 'Sure, can you provide the patient details?',
            ],
            [
                'sender_id' => 3,
                'receiver_id' => 1,
                'message' => 'Here is the information.',
            ],
        ];

        DB::table('messages')->insert($messages);
    }
}
