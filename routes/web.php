<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserDetailController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/user/avatar/{username}', [UserController::class, 'getUserAvatar']);
Route::get('/profile/details/{id}', [UserController::class, 'getUserDetail'])->name('profile.details');
Route::get('/dashboard', function () { return Inertia::render('Dashboard'); })->middleware(['verified'])->name('dashboard');
Route::get('/medicines/search', [MedicineController::class, 'searchMedicine'])->name('medicines.search');

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/practitioner.php';
require __DIR__.'/bhw.php';
require __DIR__.'/patient.php';
