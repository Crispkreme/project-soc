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
        Schema::create('medical_certificates', function (Blueprint $table) {
            $table->id();
            $table->string('issue_date')->nullable();
            $table->string('examin_date')->nullable();
            $table->foreignId('patient_id')->nullable()->constrained('user_details')->onDelete('cascade');
            $table->foreignId('doctor_id')->nullable()->constrained('user_details')->onDelete('cascade');
            $table->text('purpose')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_certificates');
    }
};
