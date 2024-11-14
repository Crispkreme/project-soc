<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RecordController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\UserController;
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
    Route::get('/view/password/{id}', [UserDetailController::class, 'viewPassword'])->name('view.password');
    // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // APPOINTMENTS
    Route::get('/book/appointments', [AppointmentController::class, 'bookAppointment'])->name('book.appointments');

    // BOOKINGS
    Route::post('/create/booking', [BookingController::class, 'createBooking'])->name('create.booking');

    // COMMUNITY
    Route::get('/show/communities', [UserController::class, 'getAllCommunity'])->name('show.communities');
    Route::get('/show/communities/practitioner', [UserController::class, 'getAllPractitionerCommunity'])->name('show.communities.practitioner');
    Route::get('/show/communities/bhw', [UserController::class, 'getAllBhwCommunity'])->name('show.communities.bhw');
    
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