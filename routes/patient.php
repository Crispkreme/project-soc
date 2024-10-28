<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;


// PATIENTS
Route::middleware(['auth', 'verified', 'patient'])
->prefix('patient')
->as('patient.')
->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
});