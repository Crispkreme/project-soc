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
            $table->foreignId('approve_by_id')
                  ->nullable()
                  ->constrained('user_details')
                  ->onDelete('cascade');
            $table->foreignId('patient_id')
                  ->nullable()
                  ->constrained('user_details')
                  ->onDelete('cascade');
            $table->string('title');
            $table->text('notes')->nullable();
            $table->date('appointment_date')->nullable();
            $table->time('appointment_start')->nullable();
            $table->time('appointment_end')->nullable();
            $table->dateTime('approved_date')->nullable();
            $table->string('reason')->nullable();
            $table->enum('booking_status', ['Approve', 'Pending', 'Success', 'Failed', 'Cancel'])
                  ->nullable()
                  ->default('Approve');
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
