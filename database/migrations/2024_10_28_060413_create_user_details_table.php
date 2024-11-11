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
        Schema::create('user_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->unique()
                  ->nullable()
                  ->constrained('users')
                  ->onDelete('cascade');
            $table->string('firstname');
            $table->string('middlename')->nullable();
            $table->string('lastname');
            $table->enum('gender', ['Male', 'Female'])->nullable();
            $table->date('birthday')->nullable();
            $table->enum('civil_status', ['Single', 'Married', 'Divorce', 'Separated'])->nullable();
            $table->string('religion');
            $table->enum('status', ['Active', 'Deactivate'])->default('Active');
            $table->text('address')->nullable();
            $table->string('profile')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_details');
    }
};
