<?php

namespace App\Http\Controllers;

use App\Contracts\AppointmentContract;
use App\Contracts\BarangayEventContract;
use App\Contracts\BookingContract;
use App\Contracts\DataAnalyticContract;
use App\Contracts\LedgerContract;
use App\Contracts\MedicineContract;
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
    protected $ledgerContract;
    protected $medicineContract;
    protected $bookingContract;
    protected $dataAnalyticContract;

    public function __construct(
        DataAnalyticContract $dataAnalyticContract,
        BarangayEventContract $barangayEventContract,
        UserDetailContract $userDetailContract,
        AppointmentContract $appointmentContract,
        LedgerContract $ledgerContract,
        BookingContract $bookingContract,
        MedicineContract $medicineContract,
    ) {
        $this->dataAnalyticContract = $dataAnalyticContract;
        $this->bookingContract = $bookingContract;
        $this->userDetailContract = $userDetailContract;
        $this->barangayEventContract = $barangayEventContract;
        $this->appointmentContract = $appointmentContract;
        $this->ledgerContract = $ledgerContract;
        $this->medicineContract = $medicineContract;
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

        $consultations = $this->barangayEventContract->getAllBarangayEventByMonth();

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
            'practitioner.show.report.medicine.available' => 'Practitioner',
            'patient.show.medicine.available' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Reports/Medicine',
            'Patient' => 'Patients/Services/Medicine',
            default => 'login'
        };

        $inventories = $this->ledgerContract->getAllLedger();

        return Inertia::render($viewPath, [
            'inventories' => $inventories,
        ]);
    }

    public function getAllDataAnalysis()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'admin.show.data.analysis' => 'Administrator',
            'bhw.show.data.analysis' => 'Bhw',
            'practitioner.show.data.analysis' => 'Practitioner',
            'patient.show.data.analysis' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $dataAnalytic = $this->dataAnalyticContract->getAllDataAnalyticByMonth();

        $viewPath = match ($accountType) {
            'Administrator' => 'Admins/Reports/DataAnalysis',
            'Bhw' => 'Bhws/Reports/DataAnalysis',
            'Practitioner' => 'Practitioners/Services/DataAnalysis',
            'Patient' => 'Patients/Services/DataAnalysis',
            default => 'login'
        };

        return Inertia::render($viewPath, [
            'dataAnalytic' => $dataAnalytic,
        ]);
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
