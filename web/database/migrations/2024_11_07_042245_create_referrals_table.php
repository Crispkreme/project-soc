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
        Schema::create('referrals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('patient_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('refer_to_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('hospital_id')->nullable()->constrained('hospitals')->onDelete('cascade');
            $table->text('reason');
            $table->enum('referral_status', ['Inprogress', 'Pending', 'Success', 'Failed'])->nullable()->default('Inprogress');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('referrals');
    }
};
