<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserDetailController;
use Illuminate\Support\Facades\Route;



// BHWS
Route::middleware(['auth', 'verified', 'bhw'])
->prefix('bhw')
->as('bhw.')
->group(function () {

    // DASHBOARD
    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
    Route::post('/store/profile/detail', [UserDetailController::class, 'storeProfileDetail'])->name('store.profile.detail');
    
});