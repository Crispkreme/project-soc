<?php

namespace App\Http\Controllers;

use App\Contracts\AppointmentContract;
use App\Contracts\BarangayEventContract;
use App\Contracts\UserDetailContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class ServiceController extends Controller
{
    protected $barangayEventContract;
    protected $userDetailContract;
    protected $appointmentContract;

    public function __construct(
        BarangayEventContract $barangayEventContract,
        UserDetailContract $userDetailContract,
        AppointmentContract $appointmentContract,
    ) {
        $this->userDetailContract = $userDetailContract;
        $this->barangayEventContract = $barangayEventContract;
        $this->appointmentContract = $appointmentContract;
    }
    
    public function getAllServiceAvailable()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.show.service.availables' => 'Practitioner',
            'patient.show.service.availables' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Services/Service',
            'Patient' => 'Patients/Services/Service',
            default => 'login'
        };

        return Inertia::render($viewPath);
        
    }

    public function getAllScheduleConsultation()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.show.schedule.consultations' => 'Practitioner',
            'patient.show.schedule.consultations' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }
        
        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Services/Consultation',
            'Patient' => 'Patients/Services/Consultation',
            default => 'login'
        };

        $consultations = $this->appointmentContract->getAllAppointmentByMonth();

        return Inertia::render($viewPath, [
            'consultations' => $consultations
        ]);
    }

    public function getAllMedicineAvailable()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.show.medicine.available' => 'Practitioner',
            'patient.show.medicine.available' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Services/Medicine',
            'Patient' => 'Patients/Services/Medicine',
            default => 'login'
        };

        return Inertia::render($viewPath);
    }

    public function getAllDataAnalysis()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.show.data.analysis' => 'Practitioner',
            'patient.show.data.analysis' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Services/DataAnalysis',
            'Patient' => 'Patients/Services/DataAnalysis',
            default => 'login'
        };

        return Inertia::render($viewPath);
    }  
    
    public function getAllBhwActivities()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.show.bhw.activities' => 'Practitioner',
            'patient.show.bhw.activities' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Services/BhwActivity',
            'Patient' => 'Patients/Services/BhwActivity',
            default => 'login'
        };
        $barangayEvents = $this->barangayEventContract->getAllBarangayEvent();
        
        return Inertia::render($viewPath, [
            'barangayEvents' => $barangayEvents,
        ]);
    }  
}
