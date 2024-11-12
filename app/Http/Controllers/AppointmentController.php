<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    //

    public function bookAppointment()
    {
        return Inertia::render('Patients/Appointments/Appointment');
    }
}
