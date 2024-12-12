<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\MessageController;
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
    Route::post('/update/profile/{id}', [UserDetailController::class, 'updateProfile'])->name('profile.update');
    Route::post('/update/user/password/{id}', [UserController::class, 'updatePassword'])->name('update.user.password');
    Route::get('/view/password/{id}', [UserDetailController::class, 'viewPassword'])->name('view.password');
    Route::get('/profile/details/{id}', [UserController::class, 'getUserDetail'])->name('profile.details');
    Route::get('logout', [UserController::class, 'loginDestroy'])->name('logout');
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
    Route::get('/medical/history/{id}', [MedicalRecordController::class, 'getPatientMedicalHistory'])->name('medical.history');
    Route::get('/medical/record/{id}', [MedicalRecordController::class, 'getPatientMedicalRecord'])->name('medical.record');

    Route::get('/medicine/requester', [MedicalRecordController::class, 'getMedicineRequester'])->name('medicine.requester');
    Route::get('/logs', [DashboardController::class, 'getUserLogs'])->name('logs');

    Route::get('/messages', [MessageController::class, 'getMessage'])->name('messages');
    Route::get('/show/medical/certificate', [RecordController::class, 'getAllMedicalCertificate'])->name('show.medical.certificate');
    Route::get('/message/user/{id}', [MessageController::class, 'getUserMessage'])->name('message.user');
});