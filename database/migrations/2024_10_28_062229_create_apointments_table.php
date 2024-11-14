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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->onDelete('cascade');
            $table->foreignId('doctor_id')->nullable()->constrained('user_details')->onDelete('cascade');
            $table->integer('slot')->default(0);
            $table->enum('appointment_status', ['Inprogress', 'Pending', 'Success', 'Failed'])->nullable()->default('Inprogress');
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
