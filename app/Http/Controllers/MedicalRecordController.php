<?php

namespace App\Http\Controllers;

use App\Contracts\FamilyMedicalContract;
use App\Contracts\HealthContract;
use App\Contracts\HospitalContract;
use App\Contracts\HospitalizationContract;
use App\Contracts\ImmunizationContract;
use App\Contracts\MedicalRecordContract;
use App\Contracts\MedicationContract;
use App\Contracts\MedicineContract;
use App\Contracts\SurgicalContract;
use App\Contracts\TestResultContract;
use App\Contracts\UserDetailContract;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class MedicalRecordController extends Controller
{
    protected $userDetailContract;
    protected $healthContract;
    protected $surgicalContract;
    protected $medicineContract;
    protected $medicationContract;
    protected $familyMedicalContract;
    protected $testResultContract;
    protected $immunizationContract;
    protected $hospitalizationContract;
    protected $medicalRecordContract;
    protected $hospitalContract;

    public function __construct(
        HospitalContract $hospitalContract,
        UserDetailContract $userDetailContract,
        MedicineContract $medicineContract,
        MedicationContract $MedicationContract,
        HealthContract $healthContract,
        SurgicalContract $surgicalContract,
        MedicationContract $medicationContract,
        FamilyMedicalContract $familyMedicalContract,
        TestResultContract $testResultContract,
        ImmunizationContract $immunizationContract,
        HospitalizationContract $hospitalizationContract,
        MedicalRecordContract $medicalRecordContract,
    ) {
        $this->hospitalContract = $hospitalContract;
        $this->userDetailContract = $userDetailContract;
        $this->medicineContract = $medicineContract;
        $this->medicationContract = $medicationContract;
        $this->healthContract = $healthContract;
        $this->surgicalContract = $surgicalContract;
        $this->familyMedicalContract = $familyMedicalContract;
        $this->testResultContract = $testResultContract;
        $this->hospitalizationContract = $hospitalizationContract;
        $this->immunizationContract = $immunizationContract;
        $this->medicalRecordContract = $medicalRecordContract;
    }

    public function getUserMedicalRecord()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }
        $accountType = 'Patient';
        $userDetails = $this->userDetailContract->getAllUserByRole($accountType, true);

        return Inertia::render('Admins/Medicals/Record', [
            'userDetails' => $userDetails,
        ]);
    }

    public function getUserMedicalHistory()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'admin.medical.history' => 'Administration',
            'bhw.medical.history' => 'Bhw',
            default => 'login',
        };
        
        if (!$accountType) {
            return redirect()->route('login');
        }

        $accountTypes = 'Patient';
        $userDetails = $this->userDetailContract->getAllUserByRole($accountTypes, true);

        $viewPath = match ($accountType) {
            'Administration' => 'Admins/Medicals/History',
            'Bhw' => 'Bhws/Medicals/History',
            default => 'login'
        };

        return Inertia::render($viewPath, [
            'userDetails' => $userDetails,
        ]);
    }

    public function getPatientMedicalRecord($id)
    {
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

        return Inertia::render('Admins/Medicals/PatientRecord', [
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

    public function getPatientMedicalHistory($id)
    {
        $user = Auth::user();
        $role = 'Patient';
        $status = 'Active';
        $patients = $this->userDetailContract->getSpecificUserDetailsById($id, $role, $status);
        $medicines = $this->medicineContract->getAllMedicine();
        $healthRecords = $this->healthContract->getHealthById($id);
        $surgicalRecords = $this->surgicalContract->getSurgicalById($id);
        $medicationRecords = $this->medicationContract->getMedicationById($id);
        $familyMedicalRecords = $this->familyMedicalContract->getFamilyMedicalById($id);

        $doctors = $this->userDetailContract->getAllUserByRole('Practitioner', true)
            ->map(function ($doctor) {
                return [
                    'id' => $doctor['id'],
                    'firstname' => $doctor['firstname'],
                    'middlename' => $doctor['middlename'],
                    'lastname' => $doctor['lastname'],
                ];
            });

        $roleRoutes = [
            'Administration' => 'Admins/Medicals/PatientHistory',
            'Bhw' => 'Admins/Medicals/PatientHistory',
        ];
        $redirectInertia = $roleRoutes[$user->role] ?? 'login';
        dd($medicationRecords);
        return Inertia::render($redirectInertia, [
            'medicines' => $medicines,
            'patients' => $patients,
            'healthRecords' => $healthRecords,
            'surgicalRecords' => $surgicalRecords,
            'medicationRecords' => $medicationRecords,
            'familyMedicalRecords' => $familyMedicalRecords,
            'doctors' => $doctors,
        ]);
    }

    public function updateOrCreateHealthRecord(Request $request, $id = null)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        DB::beginTransaction();

        try {

            $data = $request->validate([
                'patient_id' => 'nullable|exists:users,id',
                'name' => 'required|string|max:255',         
                'description' => 'nullable|string|max:1000',
            ]);
            
            if ($id) {
                $data['id'] = $id; 
                $this->healthContract->createOrUpdateHealth($data);
            } else {
                $this->healthContract->createOrUpdateHealth($data);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Health Record saved successfully!');

        } catch (Exception $e) {
            
            Log::error('Error during updateOrCreateHealthRecord: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();
            
            return redirect()->back()->with('error', 'An error occurred during the process.');
        }
    }

    public function updateOrCreateSurgicalRecord(Request $request, $id = null)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        DB::beginTransaction();

        try {

            $data = $request->validate([
                'patient_id' => 'nullable|exists:users,id',      
                'doctor_id'  => 'nullable|exists:users,id',      
                'procedure'  => 'required|string|max:255',       
                'description'=> 'nullable|string',  
            ]);
            
            $id = $request->id;
            if ($id) {
                $data['id'] = $id; 
                $this->surgicalContract->createOrUpdateSurgical($data);
            } else {
                $this->surgicalContract->createOrUpdateSurgical($data);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Surgical Record saved successfully!');

        } catch (Exception $e) {
            
            Log::error('Error during updateOrCreateSurgicalRecord: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            return redirect()->back()->with('error', 'An error occurred during the process.');
        }
    }

    public function updateOrCreateFamilyMedical(Request $request, $id = null)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        DB::beginTransaction();

        try {

            $data = $request->validate([
                'patient_id' => 'nullable|exists:users,id',
                'disease' => 'nullable|string|max:255',
                'relationship_disease' => 'nullable|in:Mother Family Disease,Father Family Disease',
            ]);

            $id = $request->id;
            if ($id) {
                $data['id'] = $id; 
                $this->familyMedicalContract->createOrUpdateFamilyMedical($data);
            } else {
                $data['patient_id'] = $user->id; 
                $this->familyMedicalContract->createOrUpdateFamilyMedical($data);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Family Medical Record saved successfully!');

        } catch (Exception $e) {
 
            Log::error('Error during updateOrCreateFamilyMedical: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            return redirect()->back()->with('error', 'An error occurred during the process.');
        }
    }

    public function updateOrCreateMedication(Request $request, $id = null)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        DB::beginTransaction();

        try {

            $data = $request->validate([
                'patient_id' => 'nullable|exists:users,id',
                'medicine_id' => 'nullable|exists:medicines,id',
                'reason' => 'nullable|string',  
            ]);

            $id = $request->id;
            if ($id) {
                $data['id'] = $id; 
                $this->medicationContract->createOrUpdateMedication($data);
            } else {
                $data['patient_id'] = $user->id; 
                $this->medicationContract->createOrUpdateMedication($data);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Medication Record saved successfully!');

        } catch (Exception $e) {
 
            Log::error('Error during updateOrCreateMedication: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            return redirect()->back()->with('error', 'An error occurred during the process.');
        }
    }

    public function updateOrCreateTestResult(Request $request, $id = null)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        DB::beginTransaction();

        try {

            $data = $request->validate([
                'patient_id' => 'nullable|exists:users,id',
                'name'       => 'required|string|max:255',
                'result'     => 'nullable|string',
            ]);

            $id = $request->id;
            if ($id) {
                $data['id'] = $id; 
                $this->testResultContract->createOrUpdateTestResult($data);
            } else {
                $data['patient_id'] = $user->id; 
                $this->testResultContract->createOrUpdateTestResult($data);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Test Result saved successfully!');

        } catch (Exception $e) {
 
            Log::error('Error during updateOrCreateMedication: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();
            
            return redirect()->back()->with('error', 'An error occurred during the process.');
        }
    }

    public function updateOrCreateImmunization(Request $request, $id = null)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        DB::beginTransaction();

        try {

            $data = $request->validate([
                'doctor_id' => 'nullable|exists:users,id',
                'patient_id' => 'required|exists:users,id',
                'immunization' => 'required|string|max:255',
            ]);

            $id = $request->id;
            if ($id) {
                $data['id'] = $id; 
                $this->immunizationContract->createOrUpdateImmunization($data);
            } else {
                $data['patient_id'] = $user->id; 
                $this->immunizationContract->createOrUpdateImmunization($data);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Immunization saved successfully!');

        } catch (Exception $e) {
 
            Log::error('Error during updateOrCreateImmunization: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();
            
            return redirect()->back()->with('error', 'An error occurred during the process.');
        }
    }
    public function updateOrCreateHospitalization(Request $request, $id = null)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        DB::beginTransaction();

        try {

            $data = $request->validate([
                'hospital_id' => 'nullable|exists:hospitals,id',
                'doctor_id' => 'nullable|exists:users,id',
                'patient_id' => 'nullable|exists:users,id',
                'diagnosis' => 'required|string|max:255', 
            ]);

            $id = $request->id;
            if ($id) {
                $data['id'] = $id; 
                $this->hospitalizationContract->createOrUpdateHospitalization($data);
            } else {
                $data['patient_id'] = $user->id; 
                $this->hospitalizationContract->createOrUpdateHospitalization($data);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Hospitalization saved successfully!');

        } catch (Exception $e) {
 
            Log::error('Error during updateOrCreateHospitalization: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();
            
            return redirect()->back()->with('error', 'An error occurred during the process.');
        }
    }

    public function getMedicineRequester()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $viewPath = match (Route::currentRouteName()) {
            'admin.medicine.requester' => 'Admins/Medicines/Requester',
            'patient.medicine.requester' => 'Patients/Requesters/Requester',
            default => null,
        };

        if (!$viewPath) {
            return redirect()->route('login');
        }

        $medicineRequesters = $user->role === 'Administration'
            ? $this->medicationContract->getAllMedication()
            : $this->medicationContract->getMedicationById($user->id);

        $medicines = $this->medicineContract->getAllMedicine();

        return Inertia::render($viewPath, [
            'medicineRequesters' => $medicineRequesters,
            'medicines' => $medicines,
        ]);
    }
}
