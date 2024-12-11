<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\ActivitiesController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\RecordController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserDetailController;
use Illuminate\Support\Facades\Route;




// BHWS
Route::middleware(['auth', 'verified', 'bhw'])
->prefix('bhw')
->as('bhw.')
->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
    // Route::get('/view/password/{id}', [UserDetailController::class, 'viewPassword'])->name('view.password');
    // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/update/profile/{id}', [UserDetailController::class, 'updateProfile'])->name('profile.update');
    Route::post('/update/user/password/{id}', [UserController::class, 'updatePassword'])->name('update.user.password');
    Route::get('/view/profile/{id}', [UserDetailController::class, 'viewProfile'])->name('view.profile');
    Route::get('/get/all/doctors', [UserDetailController::class, 'getAllDoctors'])->name('get.all.doctors');
    Route::get('logout', [UserController::class, 'loginDestroy'])->name('logout');

    Route::get('/accounts/admin', [AccountController::class, 'getAccount'])->name('accounts.admin');
    Route::get('/accounts/doctor', [AccountController::class, 'getAccount'])->name('accounts.doctor');
    Route::get('/accounts/bhw', [AccountController::class, 'getAccount'])->name('accounts.bhw');
    Route::get('/accounts/patient', [AccountController::class, 'getAccount'])->name('accounts.patient');

    // MEDICINE
    Route::get('/medicines', [MedicineController::class, 'getAllMedicine'])->name('medicines');
    Route::delete('/delete/medicines/{id}', [MedicineController::class, 'deleteMedicine'])->name('delete.medicines');
    Route::post('/store/medicines', [MedicineController::class, 'updateOrCreateMedicine'])->name('store.medicines');
    Route::post('/update/medicines/{id}', [MedicineController::class, 'updateOrCreateMedicine'])->name('update.medicines');

    // INVENTORY
    Route::get('/inventories', [InventoryController::class, 'getAllInventory'])->name('inventories');
    Route::post('/store/inventory', [InventoryController::class, 'updateOrCreateInventory'])->name('store.inventory');

    // APPOINTMENTS
    Route::get('/schedules', [BookingController::class, 'getSchedules'])->name('schedules');
    Route::get('/appointments', [BookingController::class, 'getAppointments'])->name('appointments');
    Route::get('/referrals', [BookingController::class, 'getReferral'])->name('referrals');
    Route::get('/prescriptions', [BookingController::class, 'getPrescription'])->name('prescriptions');

    // MEDICAL
    Route::get('/medical/records', [MedicalRecordController::class, 'getUserMedicalRecord'])->name('medical.records');
    Route::get('/medical/patient/record/{id}', [MedicalRecordController::class, 'getPatientMedicalRecord'])->name('medical.patient.record');
    Route::get('/medical/history', [MedicalRecordController::class, 'getUserMedicalHistory'])->name('medical.history');
    Route::get('/medical/patient/history/{id}', [MedicalRecordController::class, 'getPatientMedicalHistory'])->name('medical.patient.history');
    Route::get('/activities', [ActivitiesController::class, 'getActivities'])->name('activities');
    Route::get('/show/data/analysis', [ServiceController::class, 'getAllDataAnalysis'])->name('show.data.analysis');
    // REPORTS
    Route::get('/medicine/requester', [MedicalRecordController::class, 'getMedicineRequester'])->name('medicine.requester');
    Route::get('/reports/medicine', [MedicalRecordController::class, 'getReport'])->name('reports.medicine');
    Route::get('/reports/inventory', [MedicalRecordController::class, 'getInventory'])->name('reports.inventory');
    Route::get('/reports/appointment', [MedicalRecordController::class, 'getAppointment'])->name('reports.appointment');
    Route::get('/reports/activity', [MedicalRecordController::class, 'getActivity'])->name('reports.activity');
    Route::get('/reports/medicine/request', [MedicalRecordController::class, 'getMedicineRequest'])->name('reports.medicine.request');
    Route::get('/reports/administrator/account', [MedicalRecordController::class, 'getAdministratorAccount'])->name('reports.administrator.account');
    Route::get('/reports/doctor/account', [MedicalRecordController::class, 'getDoctorAccount'])->name('reports.doctor.account');
    Route::get('/reports/bhw/account', [MedicalRecordController::class, 'getBhwAccount'])->name('reports.bhw.account');
    Route::get('/reports/patient/account', [MedicalRecordController::class, 'getPatientAccount'])->name('reports.patient.account');
    
    Route::get('/show/medical/certificate', [RecordController::class, 'getAllMedicalCertificate'])->name('show.medical.certificate');
    Route::get('/messages', [MessageController::class, 'getMessage'])->name('messages');
    Route::get('/message/user/{id}', [MessageController::class, 'getUserMessage'])->name('message.user');
});