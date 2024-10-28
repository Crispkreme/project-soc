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
            $table->unsignedBigInteger('user_id')->nullable(); 
            $table->string('firstname');
            $table->string('middlename')->nullable();
            $table->string('lastname');
            $table->enum('gender', [
                'Male', 
                'Female', 
            ])
            ->nullable()
            ->default('');
            $table->date('birthday')->nullable();
            $table->enum('civil_status', [
                'Single', 
                'Married', 
                'Divorce', 
                'Separated', 
            ])
            ->nullable()
            ->default('');
            $table->string('religion');
            $table->string('profile');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
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
