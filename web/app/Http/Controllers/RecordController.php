<?php

namespace App\Http\Controllers;

use App\Contracts\DataAnalyticContract;
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
use App\Models\Hospitalization;
use App\Models\Immunization;
use App\Models\MedicalCertificate;
use App\Models\MedicalRecord;
use App\Models\Prescription;
use App\Models\TestResult;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
    protected $dataAnalyticContract;
    
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
        DataAnalyticContract $dataAnalyticContract,
    ) {
        $this->dataAnalyticContract = $dataAnalyticContract;
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
                    'doctor_name' => trim("{$doctor['name']}"),
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
                    'doctor_name' => $doctor['name'], 
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

        $dataAnalytic = $this->dataAnalyticContract->getAllDataAnalyticByMonth();

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Reports/Analytics',
            default => 'login'
        };

        return Inertia::render($viewPath, [
            'dataAnalytic' => $dataAnalytic,
        ]);
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
            'admin.show.medical.certificate' => 'Administrator',
            'bhw.show.medical.certificate' => 'Bhw',
            default => null,
        };

        if (!$accountType) {
            return redirect()->route('login');
        }
        $userDetail = $this->userDetailContract->getUserDetailById($user->id);
        
        if (!$userDetail) {
            return redirect()->route('login')->with('error', 'User details not found.');
        }
        
        $userID = $userDetail->id;

        if (in_array($user->role, ['Practitioner', 'Administrator', 'Bhw'])) {
            $medicalCertificates = $this->medicalCertificateContract->getAllMedicalCertificate();
        } else {
            $medicalCertificates = $this->medicalCertificateContract->getAllMedicalCertificateById($userID);
        }

        $doctors = $this->userDetailContract->getAllUserNameByRole('Practitioner', 'Active');

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Reports/MedicalCertificate',
            'Patient' => 'Patients/Records/MedicalCertificate',
            'Administrator' => 'Admins/Reports/MedicalCertificate',
            'Bhw' => 'Bhws/Reports/MedicalCertificate',
            default => 'Auth/Login', 
        };

        return Inertia::render($viewPath, [
            'medicalCertificates' => $medicalCertificates,
            'doctors' => $doctors,
        ]);
    }

    public function viewPDF($id)
    {
        $certificate = MedicalCertificate::select(
            'medical_certificates.id',
            'medical_certificates.purpose',
            'medical_certificates.examin_date',
            'medical_certificates.issue_date',
            DB::raw("CONCAT(doctor_details.firstname, ' ', doctor_details.lastname) as doctor_name"),
            DB::raw("CONCAT(patient_details.firstname, ' ', patient_details.lastname) as patient_name")
        )
        ->join('user_details as doctor_details', 'medical_certificates.doctor_id', '=', 'doctor_details.id')
        ->join('user_details as patient_details', 'medical_certificates.patient_id', '=', 'patient_details.id')
        ->where('medical_certificates.id', $id)
        ->firstOrFail();

        // Format dates
        $certificate->examin_date = $certificate->examin_date ? Carbon::parse($certificate->examin_date)->format('F d, Y') : null;
        $certificate->issue_date = $certificate->issue_date ? Carbon::parse($certificate->issue_date)->format('F d, Y') : null;

        // Load PDF view
        $pdf = Pdf::loadView('pdf.medical_certificate', ['certificate' => $certificate]);

        // Return PDF inline for viewing
        return $pdf->stream('medical_certificate.pdf');
    }
    public function downloadPDF($id)
    {
        $certificate = MedicalCertificate::select(
            'medical_certificates.id',
            'medical_certificates.purpose',
            'medical_certificates.examin_date',
            'medical_certificates.issue_date',
            DB::raw("CONCAT(doctor_details.firstname, ' ', doctor_details.lastname) as doctor_name"),
            DB::raw("CONCAT(patient_details.firstname, ' ', patient_details.lastname) as patient_name")
        )
        ->join('user_details as doctor_details', 'medical_certificates.doctor_id', '=', 'doctor_details.id')
        ->join('user_details as patient_details', 'medical_certificates.patient_id', '=', 'patient_details.id')
        ->where('medical_certificates.id', $id)
        ->firstOrFail();

        // Format dates
        $certificate->examin_date = $certificate->examin_date ? Carbon::parse($certificate->examin_date)->format('F d, Y') : null;
        $certificate->issue_date = $certificate->issue_date ? Carbon::parse($certificate->issue_date)->format('F d, Y') : null;

        // Load PDF view
        $pdf = Pdf::loadView('pdf.medical_certificate', ['certificate' => $certificate]);

        // Return PDF for download
        return $pdf->download('medical_certificate.pdf');
    }

    // for mobile
    public function getTestResultMobile($userId)
    {
        $testResults = TestResult::where('patient_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($testResult) {
                return [
                    'name' => $testResult->name,
                    'result' => $testResult->result,
                    'created_at' => $testResult->created_at->format('F d, Y'),
                ];
            });
            
        Log::info('testResults:', ['testResults' => $testResults]);
        
        if ($testResults->isEmpty()) {
            return response()->json(['message' => 'No test results found'], 404);
        }

        return response()->json([
            'testResult' => $testResults
        ]);
    }
    public function getImmunizationMobile($userId)
    {
        
        $immunizations = Immunization::with('doctor.details')
            ->where('patient_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        Log::info('Immunizations:', ['immunizations' => $immunizations]);

        if ($immunizations->isEmpty()) {
            return response()->json(['message' => 'No immunizations found'], 404);
        }

        $formattedImmunizations = $immunizations->map(function ($immunization) {
            $createdDate = $immunization->created_at->format('F d, Y');
            
            $doctor = $immunization->doctor;
            $doctorFullName = $doctor && $doctor->details ? 
                $doctor->details->firstname . ' ' .
                ($doctor->details->middlename ? substr($doctor->details->middlename, 0, 1) . '. ' : '') .
                $doctor->details->lastname
                : 'Unknown Doctor';

            return [
                'immunization' => $immunization->immunization,
                'doctor_name' => $doctorFullName,
                'created_at' => $createdDate,
            ];
        });

        return response()->json([
            'immunizations' => $formattedImmunizations
        ]);
    }
    public function getHospitalizationMobile($userId)
    {
        $hospitalizations = Hospitalization::with('doctor.details', 'hospital')
            ->where('patient_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        Log::info('Hospitalizations:', ['hospitalizations' => $hospitalizations]);

        if ($hospitalizations->isEmpty()) {
            return response()->json(['message' => 'No hospitalizations found'], 404);
        }

        $formattedHospitalizations = $hospitalizations->map(function ($hospitalization) {
            $createdDate = $hospitalization->created_at->format('F d, Y');
            
            $doctor = $hospitalization->doctor;
            $doctorFullName = $doctor && $doctor->details ? 
                $doctor->details->firstname . ' ' .
                ($doctor->details->middlename ? substr($doctor->details->middlename, 0, 1) . '. ' : '') .
                $doctor->details->lastname
                : 'Unknown Doctor';

            $hospitalName = $hospitalization->hospital ? $hospitalization->hospital->name : 'Unknown Hospital';

            return [
                'diagnosis' => $hospitalization->diagnosis,
                'hospital' => $hospitalName,
                'doctor' => $doctorFullName,
                'created_at' => $createdDate,
            ];
        });

        return response()->json([
            'hospitalizations' => $formattedHospitalizations
        ]);
    } 
    public function getPrescriptionMobile($userId)
    {
        $medicalRecords = MedicalRecord::with('medicine', 'patient.details')
            ->where('patient_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        Log::info('Medical Records:', ['medicalRecords' => $medicalRecords]);

        if ($medicalRecords->isEmpty()) {
            return response()->json(['message' => 'No medical records found'], 404);
        }

        $formattedRecords = $medicalRecords->map(function ($record) {

            $createdDate = $record->created_at->format('F d, Y');
            $medicineName = $record->medicine ? $record->medicine->medicine_name : 'Unknown Medicine';

            return [
                'diagnosis' => $record->diagnosis,
                'medicine' => $medicineName,
                'created_at' => $createdDate,
            ];
        });

        return response()->json([
            'medical_records' => $formattedRecords
        ]);
    }
}
