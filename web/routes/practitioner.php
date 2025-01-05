<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\RecordController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserDetailController;
use Illuminate\Support\Facades\Route;




// PRACTITIONERS
Route::middleware(['auth', 'verified', 'practitioner'])
->prefix('practitioner')
->as('practitioner.')
->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');

    // AUTH
    Route::post('/update/profile/{id}', [UserDetailController::class, 'updateProfile'])->name('profile.update');
    Route::post('/update/user/password/{id}', [UserController::class, 'updatePassword'])->name('update.user.password');
    Route::get('/view/profile/{id}', [UserDetailController::class, 'viewProfile'])->name('view.profile');
    Route::get('logout', [UserController::class, 'loginDestroy'])->name('logout');
    
    // APPOINTMENTS
    Route::get('/book/appointments', [AppointmentController::class, 'bookAppointment'])->name('book.appointments');
    Route::get('/book/appointments/booked', [AppointmentController::class, 'bookedAppointment'])->name('book.appointments.booked');

    // COMMUNITY
    Route::get('/show/communities', [UserController::class, 'getAllCommunity'])->name('show.communities');
    Route::get('/show/communities/practitioner', [UserController::class, 'getAllPractitionerCommunity'])->name('show.communities.practitioner');
    Route::get('/show/communities/bhw', [UserController::class, 'getAllBhwCommunity'])->name('show.communities.bhw');
    // TEMP
    Route::get('/show/communities/patient', [UserController::class, 'getAllPatientCommunity'])->name('show.communities.patient');

    // SERVICE
    Route::get('/show/service/availables', [ServiceController::class, 'getAllServiceAvailable'])->name('show.service.availables');
    Route::get('/show/schedule/consultations', [ServiceController::class, 'getAllScheduleConsultation'])->name('show.schedule.consultations');
    Route::get('/show/medicine/available', [ServiceController::class, 'getAllMedicineAvailable'])->name('show.medicine.available');
    Route::get('/show/data/analysis', [ServiceController::class, 'getAllDataAnalysis'])->name('show.data.analysis');
    Route::get('/show/bhw/activities', [ServiceController::class, 'getAllBhwActivities'])->name('show.bhw.activities');
    // SERVICE THIS IS TEMP
    Route::get('/show/reports/medicine/available', [ServiceController::class, 'getAllMedicineAvailable'])->name('show.report.medicine.available');

    // RECORDS
    Route::get('/show/record/medicals', [RecordController::class, 'getAllMedical'])->name('show.record.medicals');
    Route::get('/show/record/histories', [RecordController::class, 'getAllHistory'])->name('show.record.histories');
    Route::get('/appointments', [AppointmentController::class, 'getAllAppointment'])->name('appointments');

    // REPORTS THIS IS TEMP
    Route::get('/show/reports/appointment', [RecordController::class, 'getAllAppointmentReports'])->name('show.report.appointment');
    Route::get('/show/reports/analytics', [RecordController::class, 'getAllDataAnalytics'])->name('show.report.analytics');
    Route::get('/show/reports/released', [RecordController::class, 'getAllReleasedReports'])->name('show.report.released');
    Route::get('/show/medical/certificate', [RecordController::class, 'getAllMedicalCertificate'])->name('show.medical.certificate');

    Route::get('/messages', [MessageController::class, 'getMessage'])->name('messages');
    Route::get('/message/user/{id}', [MessageController::class, 'getUserMessage'])->name('message.user');

    Route::get('/medical/records', [MedicalRecordController::class, 'getUserMedicalRecord'])->name('medical.records');
    Route::get('/medical/patient/record/{id}', [MedicalRecordController::class, 'getPatientMedicalRecord'])->name('medical.patient.record');
    Route::get('/medical/history', [MedicalRecordController::class, 'getUserMedicalHistory'])->name('medical.history');
    Route::get('/medical/patient/history/{id}', [MedicalRecordController::class, 'getPatientMedicalHistory'])->name('medical.patient.history');
});
