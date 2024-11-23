<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserDetailController;
use App\Models\FamilyMedical;
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
Route::post('/store/profile/detail', [UserDetailController::class, 'storeProfileDetail'])->name('store.profile.detail');
Route::post('/accounts/activate', [UserDetailController::class, 'activateAccount'])->name('account.activate');
Route::post('/accounts/deactivate', [UserDetailController::class, 'deactivateAccount'])->name('account.deactivate');
Route::post('/health/record/update/{id}', [MedicalRecordController::class, 'updateOrCreateHealthRecord'])->name('health.record.update');
Route::post('/health/record/create', [MedicalRecordController::class, 'updateOrCreateHealthRecord'])->name('health.record.create');
Route::post('/surgical/record/update/{id}', [MedicalRecordController::class, 'updateOrCreateSurgicalRecord'])->name('surgical.record.update');
Route::post('/surgical/record/create', [MedicalRecordController::class, 'updateOrCreateSurgicalRecord'])->name('surgical.record.create');
Route::post('/medication/update/{id}', [MedicalRecordController::class, 'updateOrCreateMedication'])->name('medication.update');
Route::post('/medication/create', [MedicalRecordController::class, 'updateOrCreateMedication'])->name('medication.create');
Route::post('/family/medical/update/{id}', [MedicalRecordController::class, 'updateOrCreateFamilyMedical'])->name('family.medical.update');
Route::post('/family/medical/create', [MedicalRecordController::class, 'updateOrCreateFamilyMedical'])->name('family.medical.create');

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/practitioner.php';
require __DIR__.'/bhw.php';
require __DIR__.'/patient.php';
