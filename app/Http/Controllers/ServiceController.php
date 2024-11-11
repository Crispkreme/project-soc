<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function getAllServiceAvailable()
    {
        return Inertia::render('Patients/Services/Service');
    }

    public function getAllScheduleConsultation()
    {
        return Inertia::render('Patients/Services/Consultation');
    }

    public function getAllMedicineAvailable()
    {
        return Inertia::render('Patients/Services/Medicine');
    }

    public function getAllDataAnalysis()
    {
        return Inertia::render('Patients/Services/DataAnalysis');
    }  
    
    public function getAllBhwActivities()
    {
        return Inertia::render('Patients/Services/PatientActivity');
    }  
    
}
