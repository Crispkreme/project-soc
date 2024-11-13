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
        Schema::create('barangay_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')->nullable()->constrained('user_details')->onDelete('cascade');
            $table->foreignId('bhw_id')->nullable()->constrained('user_details')->onDelete('cascade');
            $table->string('event_name');
            $table->date('event_date');
            $table->time('event_start');
            $table->time('event_end');
            $table->string('event_venue');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangay_events');
    }
};
