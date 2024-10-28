<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('apointments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('booking_id')->nullable(); 
            $table->unsignedBigInteger('doctor_id')->nullable(); 
            $table->enum('appointment_status', [
                'Inprogress', 
                'Pending', 
                'Success', 
                'Failed', 
            ])
            ->nullable()
            ->default('Inprogress');

            $table->foreign('doctor_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('apointments');
    }
};
