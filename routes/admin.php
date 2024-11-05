<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserDetailController;
use Illuminate\Support\Facades\Route;

// ADMIN
Route::middleware(['auth', 'verified', 'admin'])
->prefix('admin')
->as('admin.')
->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
    // Route::get('/view/profile/{id}', [UserDetailController::class, 'viewProfile'])->name('view.profile');
    // Route::patch('/update/profile/{id}', [UserDetailController::class, 'updateProfile'])->name('profile.update');
    // Route::get('/view/password/{id}', [UserDetailController::class, 'viewPassword'])->name('view.password');
    // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/accounts', [AccountController::class, 'getAccount'])->name('accounts');

    // MEDICINE
    Route::get('/medicines', [MedicineController::class, 'getAllMedicine'])->name('medicines');
    Route::delete('/delete/medicines/{id}', [MedicineController::class, 'deleteMedicine'])->name('delete.medicines');
    Route::post('/store/medicines', [MedicineController::class, 'updateOrCreateMedicine'])->name('store.medicines');
    Route::post('/update/medicines/{id}', [MedicineController::class, 'updateOrCreateMedicine'])->name('update.medicines');

    // INVENTORY
    Route::get('/inventories', [InventoryController::class, 'getAllInventory'])->name('inventories');
    Route::post('/store/inventory', [InventoryController::class, 'updateOrCreateInventory'])->name('store.inventory');

    // APPOINTMENTS
    Route::get('/appointments', [BookingController::class, 'getAppointments'])->name('appointments');
});