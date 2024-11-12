<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;


// PRACTITIONERS
Route::middleware(['auth', 'verified', 'practitioner'])
->prefix('practitioner')
->as('practitioner.')
->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
});
