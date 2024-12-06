<?php

namespace App\Http\Controllers;

use App\Contracts\BarangayEventContract;
use App\Contracts\BookingContract;
use App\Contracts\FamilyMedicalContract;
use App\Contracts\HealthContract;
use App\Contracts\HospitalContract;
use App\Contracts\HospitalizationContract;
use App\Contracts\ImmunizationContract;
use App\Contracts\LedgerContract;
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
use Illuminate\Support\Facades\Storage;
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
    protected $ledgerContract;
    protected $barangayEventContract;
    protected $immunizationContract;
    protected $hospitalizationContract;
    protected $medicalRecordContract;
    protected $bookingContract;
    protected $hospitalContract;

    public function __construct(
        BarangayEventContract $barangayEventContract,
        BookingContract $bookingContract,
        LedgerContract $ledgerContract,
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
        $this->bookingContract = $bookingContract;
        $this->barangayEventContract = $barangayEventContract;
        $this->ledgerContract = $ledgerContract;
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

        $userDetails = $this->userDetailContract->getAllUserByRole($user->role, true);

        $roleRoutes = [
            'Administration' => 'Admins/Medicals/Record',
            'Bhw' => 'Bhws/Medicals/Record',
        ];
        $redirectInertia = $roleRoutes[$user->role] ?? 'login';

        return Inertia::render($redirectInertia, [
            'userDetails' => $userDetails,
        ]);
    }

    public function getUserMedicalHistory()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $userDetails = $this->userDetailContract->getAllUserByRole($user->role, true);
        $roleRoutes = [
            'Administration' => 'Admins/Medicals/History',
            'Bhw' => 'Bhws/Medicals/History',
        ];
        $redirectInertia = $roleRoutes[$user->role] ?? 'login';

        return Inertia::render($redirectInertia, [
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
        
        $roleRoutes = [
            'Administration' => 'Admins/Medicals/PatientRecord',
            'Bhw' => 'Bhws/Medicals/PatientRecord',
        ];
        $redirectInertia = $roleRoutes[$user->role] ?? 'login';

        return Inertia::render($redirectInertia, [
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

        $surgicalRecords = $this->surgicalContract->getAllSurgicalById($id);
        $medicationRecords = $this->medicationContract->getMedicationById($id);
        $familyMedicalRecords = $this->familyMedicalContract->getFamilyMedicalById($id);

        $doctors = $this->userDetailContract->getAllUserByRole('Practitioner', true)
            ->map(function ($doctor) {
                return [ 
                    'id' => $doctor['id'],
                    'name' => $doctor['name'],
                ];
            });

        $roleRoutes = [
            'Administration' => 'Admins/Medicals/PatientHistory',
            'Bhw' => 'Bhws/Medicals/PatientHistory',
        ];
        $redirectInertia = $roleRoutes[$user->role] ?? 'login';
        $patient_id = $id;

        return Inertia::render($redirectInertia, [
            'medicines' => $medicines,
            'patients' => $patients,
            'healthRecords' => $healthRecords,
            'surgicalRecords' => $surgicalRecords,
            'medicationRecords' => $medicationRecords,
            'familyMedicalRecords' => $familyMedicalRecords,
            'doctors' => $doctors,
            'patient_id' => $patient_id,
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
                'pdf_file' => 'nullable|file|mimes:pdf|max:2048',
            ]);
            
            if ($id) {
                $data['id'] = $id; 
                $health = $this->healthContract->getHealthById($id);
                if ($request->hasFile('pdf_file')) {
                    if ($health->pdf_file) {
                        Storage::disk('public')->delete($health->pdf_file);
                    }
                    $filePath = $request->file('pdf_file')->store('pdfs', 'public');
                    $health->pdf_file = $filePath;
                }
                $this->healthContract->createOrUpdateHealth($data);
            } else {

                $filePath = null;
                if ($request->hasFile('pdf_file')) {
                    $filePath = $request->file('pdf_file')->store('pdfs', 'public');
                }

                $data['pdf_file'] = $filePath;
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
                'pdf_file' => 'nullable|file|mimes:pdf|max:2048',
            ]);

            $id = $request->id;
            if ($id) {
                $data['id'] = $id; 
                $surgical = $this->surgicalContract->getSurgicalById($id);
                if ($request->hasFile('pdf_file')) {
                    if ($surgical->pdf_file) {
                        Storage::disk('public')->delete($surgical->pdf_file);
                    }
                    $filePath = $request->file('pdf_file')->store('pdfs', 'public');
                    $surgical->pdf_file = $filePath;
                }
                $this->surgicalContract->createOrUpdateSurgical($data);
            } else {

                $filePath = null;
                if ($request->hasFile('pdf_file')) {
                    $filePath = $request->file('pdf_file')->store('pdfs', 'public');
                }

                $data['pdf_file'] = $filePath;
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
                'pdf_file' => 'nullable|file|mimes:pdf|max:2048',
            ]);

            $id = $request->id;
            if ($id) {
                $data['id'] = $id; 
                $familyMedical = $this->familyMedicalContract->getFamilyMedicalById($id);
                if ($request->hasFile('pdf_file')) {
                    if ($familyMedical->pdf_file) {
                        Storage::disk('public')->delete($familyMedical->pdf_file);
                    }
                    $filePath = $request->file('pdf_file')->store('pdfs', 'public');
                    $familyMedical->pdf_file = $filePath;
                }
                $this->familyMedicalContract->createOrUpdateFamilyMedical($data);
            } else {

                $filePath = null;
                if ($request->hasFile('pdf_file')) {
                    $filePath = $request->file('pdf_file')->store('pdfs', 'public');
                }

                $data['pdf_file'] = $filePath;
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
                'dosage' => 'nullable|string',  
                'quantity' => 'nullable|string',  
                'pdf_file' => 'nullable|file|mimes:pdf|max:2048',
            ]);
            $data['quantity'] = null; 
            
            $id = $request->id;
            if ($id) {
                $data['id'] = $id; 
                $medication = $this->medicationContract->getSpecificMedicationById($id);
                if ($request->hasFile('pdf_file')) {
                    if ($medication->pdf_file) {
                        Storage::disk('public')->delete($medication->pdf_file);
                    }
                    $filePath = $request->file('pdf_file')->store('pdfs', 'public');
                    $medication->pdf_file = $filePath;
                }
                $this->medicationContract->createOrUpdateMedication($data);
            } else {

                $filePath = null;
                if ($request->hasFile('pdf_file')) {
                    $filePath = $request->file('pdf_file')->store('pdfs', 'public');
                }

                $data['pdf_file'] = $filePath;
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

    public function getReport()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $roleRoutes = [
            'Administration' => 'Admins/Reports/MedicineReport',
            'Bhw' => 'Bhws/Reports/MedicineReport',
        ];
        $redirectInertia = $roleRoutes[$user->role] ?? 'login';

        $medicines = $this->medicineContract->getAllMedicine();

        return Inertia::render($redirectInertia, [
            'medicines' => $medicines,
        ]);
    }

    public function getInventory()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $roleRoutes = [
            'Administration' => 'Admins/Reports/InventoryReport',
            'Bhw' => 'Bhws/Reports/InventoryReport',
        ];
        $redirectInertia = $roleRoutes[$user->role] ?? 'login';

        $inventories = $this->ledgerContract->getAllLedger();

        return Inertia::render($redirectInertia, [
            'inventories' => $inventories,
        ]);
    }

    public function getAppointment()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $roleRoutes = [
            'Administration' => 'Admins/Reports/AppointmentRecord',
            'Bhw' => 'Bhws/Reports/AppointmentRecord',
        ];
        $redirectInertia = $roleRoutes[$user->role] ?? 'login';

        $appointments = $this->bookingContract->getAllBooking();

        return Inertia::render($redirectInertia, [
            'appointments' => $appointments,
        ]);
    }

    public function getActivity()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $roleRoutes = [
            'Administration' => 'Admins/Reports/ActivityReport',
            'Bhw' => 'Bhws/Reports/ActivityReport',
        ];
        $redirectInertia = $roleRoutes[$user->role] ?? 'login';

        $barangayEvents = $this->barangayEventContract->getBarangayEvent();

        return Inertia::render($redirectInertia, [
            'barangayEvents' => $barangayEvents,
        ]);
    }

    public function getMedicineRequest()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $roleRoutes = [
            'Administration' => 'Admins/Reports/MedicineRequesterRecord',
            'Bhw' => 'Bhws/Reports/MedicineRequesterRecord',
        ];
        $redirectInertia = $roleRoutes[$user->role] ?? 'login';

        $medicineRequesters = $user->role === 'Administration'
            ? $this->medicationContract->getAllMedication()
            : $this->medicationContract->getMedicationById($user->id);

        return Inertia::render($redirectInertia, [
            'medicineRequesters' => $medicineRequesters,
        ]);
    }

    public function getDoctorAccount()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $roleRoutes = [
            'Administration' => 'Admins/Reports/DoctorAccountRecord',
            'Bhw' => 'Bhws/Reports/DoctorAccountRecord',
        ];
        $redirectInertia = $roleRoutes[$user->role] ?? 'login';

        $accounts = $this->userDetailContract->getAllUserByRole($user->role, true);

        return Inertia::render($redirectInertia, [
            'accounts' => $accounts,
        ]);
    }
    
    public function getAdministratorAccount()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $roleRoutes = [
            'Administration' => 'Admins/Reports/AdminAccountReport',
            'Bhw' => 'Bhws/Reports/AdminAccountReport',
        ];
        $redirectInertia = $roleRoutes[$user->role] ?? 'login';

        $accounts = $this->userDetailContract->getAllUserByRole($user->role, true);

        return Inertia::render($redirectInertia, [
            'accounts' => $accounts,
        ]);
    }

    public function getPatientAccount()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $roleRoutes = [
            'Administration' => 'Admins/Reports/PatientAccountReport',
            'Bhw' => 'Bhws/Reports/PatientAccountReport',
        ];
        $redirectInertia = $roleRoutes[$user->role] ?? 'login';

        $accounts = $this->userDetailContract->getAllUserByRole($user->role, true);

        return Inertia::render($redirectInertia, [
            'accounts' => $accounts,
        ]);
    }

    public function getBhwAccount()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $roleRoutes = [
            'Administration' => 'Admins/Reports/BhwAccountReport',
            'Bhw' => 'Bhws/Reports/BhwAccountReport',
        ];
        $redirectInertia = $roleRoutes[$user->role] ?? 'login';

        $accounts = $this->userDetailContract->getAllUserByRole($user->role, true);

        return Inertia::render($redirectInertia, [
            'accounts' => $accounts,
        ]);
    }
}
