<?php

namespace App\Http\Controllers;

use App\Contracts\FamilyMedicalContract;
use App\Contracts\HealthContract;
use App\Contracts\HospitalContract;
use App\Contracts\HospitalizationContract;
use App\Contracts\ImmunizationContract;
use App\Contracts\MedicalCertificateContract;
use App\Contracts\MedicalRecordContract;
use App\Contracts\MedicationContract;
use App\Contracts\MedicineContract;
use App\Contracts\SurgicalContract;
use App\Contracts\TestResultContract;
use App\Contracts\UserDetailContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class RecordController extends Controller
{
    protected $userDetailContract;
    protected $healthContract;
    protected $surgicalContract;
    protected $medicationContract;
    protected $familyMedicalContract;
    protected $testResultContract;
    protected $immunizationContract;
    protected $hospitalizationContract;
    protected $medicalRecordContract;
    protected $medicineContract;
    protected $medicalCertificateContract;
    protected $hospitalContract;
    
    public function __construct(
        MedicalCertificateContract $medicalCertificateContract,
        HospitalContract $hospitalContract,
        UserDetailContract $userDetailContract,
        HealthContract $healthContract,
        SurgicalContract $surgicalContract,
        MedicationContract $medicationContract,
        FamilyMedicalContract $familyMedicalContract,
        TestResultContract $testResultContract,
        ImmunizationContract $immunizationContract,
        HospitalizationContract $hospitalizationContract,
        MedicalRecordContract $medicalRecordContract,
        MedicineContract $medicineContract,
    ) {
        $this->medicalCertificateContract = $medicalCertificateContract;
        $this->medicineContract = $medicineContract;
        $this->hospitalContract = $hospitalContract;
        $this->userDetailContract = $userDetailContract;
        $this->healthContract = $healthContract;
        $this->surgicalContract = $surgicalContract;
        $this->medicationContract = $medicationContract;
        $this->familyMedicalContract = $familyMedicalContract;
        $this->testResultContract = $testResultContract;
        $this->hospitalizationContract = $hospitalizationContract;
        $this->immunizationContract = $immunizationContract;
        $this->medicalRecordContract = $medicalRecordContract;
    }
    
    public function getAllMedical()
    {
        $user = Auth::user();
        $id = $user->id;

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

        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }
       
        $role = 'Patient';
        $status = 'Active';
        $patient = $this->userDetailContract->getSpecificUserDetailsById($id, $role, $status);
        $testResults = $this->testResultContract->getTestResultById($id);
        $immunizations = $this->immunizationContract->getImmunizationById($id);
        $hospitalizations = $this->hospitalizationContract->getHospitalizationById($id);
        $medicalRecords = $this->medicalRecordContract->getMedicalRecordById($id);
        $patients = $this->userDetailContract->getSpecificUserDetailsById($id, $role, $status);
        $medicines = $this->medicineContract->getAllMedicine();
        $hospitals = $this->hospitalContract->getAllHospital();
        $doctors = $this->userDetailContract->getAllUserByRole('Practitioner', true)
            ->map(function ($doctor) {
                return [
                    'id' => $doctor['id'],
                    'doctor_name' => trim("{$doctor['firstname']} {$doctor['middlename']} {$doctor['lastname']}"), // Combine names into a single field
                ];
            });

        return Inertia::render($viewPath, [
            'patient' => $patient,
            'hospitals' => $hospitals,
            'testResults' => $testResults,
            'immunizations' => $immunizations,
            'hospitalizations' => $hospitalizations,
            'medicalRecords' => $medicalRecords,
            'patients' => $patients,
            'medicines' => $medicines,
            'doctors' => $doctors,
        ]);
    }  
    
    public function getAllHistory()
    {
        $user = Auth::user();
        $id = $user->id;
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

        $role = 'Patient';
        $status = 'Active';
        $patients = $this->userDetailContract->getSpecificUserDetailsById($id, $role, $status);
        $healthRecords = $this->healthContract->getHealthById($id);
        $surgicalRecords = $this->surgicalContract->getSurgicalById($id);
        $medicationRecords = $this->medicationContract->getMedicationById($id);
        $familyMedicalRecords = $this->familyMedicalContract->getFamilyMedicalById($id);
        $surgicalRecords = $this->surgicalContract->getSurgicalById($id);
        $medicines = $this->medicineContract->getAllMedicine();
        $doctors = $this->userDetailContract->getAllUserByRole('Practitioner', true)
            ->map(function ($doctor) {
                return [
                    'id' => $doctor['id'],
                    'firstname' => $doctor['firstname'],
                    'middlename' => $doctor['middlename'],
                    'lastname' => $doctor['lastname'],
                ];
            });

        return Inertia::render($viewPath, [
            'medicines' => $medicines,
            'patients' => $patients,
            'doctors' => $doctors,
            'healthRecords' => $healthRecords,
            'surgicalRecords' => $surgicalRecords,
            'medicationRecords' => $medicationRecords,
            'familyMedicalRecords' => $familyMedicalRecords,
        ]);
    }

    // THIS IS TEMP PLEASE CHANGE
    public function getAllAppointmentReports()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.show.report.appointment' => 'Practitioner',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Reports/Appointment',
            default => 'login'
        };

        return Inertia::render($viewPath);
    }

    public function getAllMedicalAvailable()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.show.report.available' => 'Practitioner',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Reports/Available',
            default => 'login'
        };

        return Inertia::render($viewPath);
    }

    public function getAllDataAnalytics()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.show.report.analytics' => 'Practitioner',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Reports/Analytics',
            default => 'login'
        };

        return Inertia::render($viewPath);
    }

    public function getAllReleasedReports()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.show.report.released' => 'Practitioner',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Reports/Released',
            default => 'login'
        };

        return Inertia::render($viewPath);
    }

    public function getAllMedicalCertificate()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.show.medical.certificate' => 'Practitioner',
            'patient.show.medical.certificate' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $medicalCertificates = $this->medicalCertificateContract->getAllMedicalCertificate();

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Reports/MedicalCertificate',
            'Patient' => 'Patients/Reports/MedicalCertificate',
            default => 'login'
        };

        return Inertia::render($viewPath, [
            'medicalCertificates' => $medicalCertificates,
        ]);
    }
}
