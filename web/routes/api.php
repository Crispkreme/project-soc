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
