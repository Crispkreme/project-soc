<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    public function bookAppointment()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.book.appointments' => 'Practitioner',
            'patient.book.appointments' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Appointments/Appointment',
            'Patient' => 'Patients/Appointments/Appointment',
            default => 'login'
        };

        return Inertia::render($viewPath);
    }
}
