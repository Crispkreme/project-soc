<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\RecordController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserDetailController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) { return $request->user(); })->middleware('auth:sanctum');

// LOGIN
Route::post('mobile/login', [UserController::class, 'loginMobile'])->name('mobile.login');
Route::get('mobile/test/result/{userId}', [RecordController::class, 'getTestResultMobile'])->name('mobile.test.result');
Route::get('mobile/immunization/result/{userId}', [RecordController::class, 'getImmunizationMobile'])->name('mobile.immunization.result');
Route::get('mobile/hospitalization/result/{userId}', [RecordController::class, 'getHospitalizationMobile'])->name('mobile.hospitalization.result');
Route::get('mobile/prescription/result/{userId}', [RecordController::class, 'getHealthRecordMobile'])->name('mobile.prescription.result');
Route::get('mobile/health/record/{userId}', [RecordController::class, 'getMedicalRecordMobile'])->name('mobile.health.record');
Route::get('mobile/surgical/record/{userId}', [RecordController::class, 'getSurgicalRecordMobile'])->name('mobile.surgical.record');
Route::get('mobile/medication/record/{userId}', [RecordController::class, 'getMedicationRecordMobile'])->name('mobile.medication.record');
Route::get('mobile/family/medical/record/{userId}', [RecordController::class, 'getFamilyMedicalRecordMobile'])->name('mobile.family.medical.record');
Route::get('mobile/medical/certificate/{userId}', [RecordController::class, 'getMedicalCertificateMobile'])->name('mobile.medical.certificate');
Route::get('mobile/medicine/available', [ServiceController::class, 'getMedicineAvailableMobile'])->name('mobile.medicine.available');
Route::get('mobile/schedule/consultation', [ServiceController::class, 'getScheduleConsultationMobile'])->name('mobile.schedule.consultation');
Route::get('mobile/barangay/event', [AppointmentController::class, 'getBarangayEventMobile'])->name('mobile.barangay.event');
Route::get('mobile/top/medicine', [DashboardController::class, 'getTopMedicineMobile'])->name('mobile.top.medicine');
Route::get('mobile/upcoming/barangay/event', [AppointmentController::class, 'getUpcomingBarangayEventMobile'])->name('mobile.upcoming.barangay.event');
Route::get('mobile/get/all/medicine', [MedicineController::class, 'getAllMedicineMobile'])->name('mobile.get.all.medicine');
Route::get('mobile/get/all/doctor', [UserDetailController::class, 'getAllDoctorMobile'])->name('mobile.get.all.doctor');
Route::get('mobile/get/all/hospital', [RecordController::class, 'getAllHospitalMobile'])->name('mobile.get.all.hospital');
Route::get('mobile/get/all/medicine/inventory', [MedicineController::class, 'getAllInventoryMedicineMobile'])->name('mobile.get.all.medicine.inventory');
Route::get('mobile/get/all/medicine/requester/{id}', [MedicineController::class, 'getAllMedicineRequesterMobile'])->name('mobile.get.all.medicine.requester');
Route::get('mobile/get/user/detail/{id}', [UserController::class, 'getUserDetailsMobile'])->name('mobile.get.user.detail');
Route::get('mobile/client/message/{id}', [UserController::class, 'getAllMessageMobile'])->name('mobile.client.message');

Route::post('mobile/store/booking', [AppointmentController::class, 'storeBooking'])->name('mobile.store.booking');
Route::post('mobile/store/health/record', [MedicalRecordController::class, 'storeHealthRecordMobile'])->name('mobile.store.health.record');
Route::post('mobile/store/surgical/record', [MedicalRecordController::class, 'storeSurgicalRecordMobile'])->name('mobile.store.surgical.record');
Route::post('mobile/store/medication/record', [MedicalRecordController::class, 'storeMedicationRecordMobile'])->name('mobile.store.medication.record');
Route::post('mobile/store/family/record', [MedicalRecordController::class, 'storeFamilyRecordMobile'])->name('mobile.store.family.record');
Route::post('mobile/store/test/result', [MedicalRecordController::class, 'storeTestResultMobile'])->name('mobile.store.test.result');
Route::post('mobile/store/immunization/result', [MedicalRecordController::class, 'storeImmunizationResultMobile'])->name('mobile.store.immunization.result');
Route::post('mobile/store/user', [UserController::class, 'createUserMobile'])->name('mobile.store.user');
Route::post('mobile/update/user/detail', [UserController::class, 'updateUserMobile'])->name('mobile.update.user.detail');
Route::post('mobile/update/user/email', [UserController::class, 'updateUserEmailMobile'])->name('mobile.update.user.email');
Route::post('mobile/update/user/password', [UserController::class, 'updateUserPasswordMobile'])->name('mobile.update.user.password');
Route::post('mobile/deactivate/user/{id}', [UserController::class, 'deactivateUserMobile'])->name('mobile.deactivate.user');
