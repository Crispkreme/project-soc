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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('approve_by_id')->nullable(); 
            $table->unsignedBigInteger('patient_id')->nullable(); 
            $table->string('title');
            $table->text('notes');
            $table->date('appointment_date');
            $table->time('appointment_start');
            $table->time('appointment_end');
            $table->dateTime('approved_date');
            $table->enum('booking_status', [
                'Inprogress', 
                'Pending', 
                'Success', 
                'Failed', 
            ])
            ->nullable()
            ->default('Inprogress');
            
            $table->foreign('approve_by_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('patient_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
