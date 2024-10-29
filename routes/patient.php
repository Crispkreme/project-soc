<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserDetailController;
use Illuminate\Support\Facades\Route;



// PATIENTS
Route::middleware(['auth', 'verified', 'patient'])
->prefix('patient')
->as('patient.')
->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('/view/profile/{id}', [UserDetailController::class, 'viewProfile'])->name('view.profile');
    Route::patch('/update/profile/{id}', [UserDetailController::class, 'updateProfile'])->name('profile.update');
    // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});