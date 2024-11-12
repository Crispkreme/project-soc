<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class RecordController extends Controller
{
    public function getAllMedical()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.show.record.medicals' => 'Practitioner',
            'patient.show.record.medicals' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Records/Medical',
            'Patient' => 'Patients/Records/Medical',
            default => 'login'
        };

        return Inertia::render($viewPath);
    }  
    
    public function getAllHistory()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.show.record.histories' => 'Practitioner',
            'patient.show.record.histories' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Records/History',
            'Patient' => 'Patients/Records/History',
            default => 'login'
        };

        return Inertia::render($viewPath);
    }
}
