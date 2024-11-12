<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RecordController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// PRACTITIONERS
Route::middleware(['auth', 'verified', 'practitioner'])
->prefix('practitioner')
->as('practitioner.')
->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');

    // APPOINTMENTS
    Route::get('/book/appointments', [AppointmentController::class, 'bookAppointment'])->name('book.appointments');

    // COMMUNITY
    Route::get('/show/communities', [UserController::class, 'getAllCommunity'])->name('show.communities');

    // SERVICE
    Route::get('/show/service/availables', [ServiceController::class, 'getAllServiceAvailable'])->name('show.service.availables');
    Route::get('/show/schedule/consultations', [ServiceController::class, 'getAllScheduleConsultation'])->name('show.schedule.consultations');
    Route::get('/show/medicine/available', [ServiceController::class, 'getAllMedicineAvailable'])->name('show.medicine.available');
    Route::get('/show/data/analysis', [ServiceController::class, 'getAllDataAnalysis'])->name('show.data.analysis');
    Route::get('/show/bhw/activities', [ServiceController::class, 'getAllBhwActivities'])->name('show.bhw.activities');

    // RECORDS
    Route::get('/show/record/medicals', [RecordController::class, 'getAllMedical'])->name('show.record.medicals');
    Route::get('/show/record/histories', [RecordController::class, 'getAllHistory'])->name('show.record.histories');
});
