<?php

use App\Http\Controllers\RecordController;
use App\Http\Controllers\UserController;
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
