<?php

namespace App\Http\Controllers;

use App\Contracts\FamilyMedicalContract;
use App\Contracts\HealthContract;
use App\Contracts\HospitalizationContract;
use App\Contracts\ImmunizationContract;
use App\Contracts\MedicalRecordContract;
use App\Contracts\MedicationContract;
use App\Contracts\SurgicalContract;
use App\Contracts\TestResultContract;
use App\Contracts\UserDetailContract;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class MedicalRecordController extends Controller
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

    public function __construct(
        UserDetailContract $userDetailContract,
        HealthContract $healthContract,
        SurgicalContract $surgicalContract,
        MedicationContract $medicationContract,
        FamilyMedicalContract $familyMedicalContract,
        TestResultContract $testResultContract,
        ImmunizationContract $immunizationContract,
        HospitalizationContract $hospitalizationContract,
        MedicalRecordContract $medicalRecordContract,
    ) {
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
        $accountType = 'Patient';
        $userDetails = $this->userDetailContract->getAllUserByRole($accountType, true);

        return Inertia::render('Admins/Medicals/History', [
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

        return Inertia::render('Admins/Medicals/PatientRecord', [
            'patient' => $patient,
            'testResults' => $testResults,
            'immunizations' => $immunizations,
            'hospitalizations' => $hospitalizations,
            'medicalRecords' => $medicalRecords,
        ]);
    }


    public function getPatientMedicalHistory($id)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $role = 'Patient';
        $status = 'Active';
        $patients = $this->userDetailContract->getSpecificUserDetailsById($id, $role, $status);
        $healthRecords = $this->healthContract->getHealthById($id);
        $surgicalRecords = $this->surgicalContract->getSurgicalById($id);
        $medicationRecords = $this->medicationContract->getMedicationById($id);
        $familyMedicalRecords = $this->familyMedicalContract->getFamilyMedicalById($id);

        return Inertia::render('Admins/Medicals/PatientHistory', [
            'patients' => $patients,
            'healthRecords' => $healthRecords,
            'surgicalRecords' => $surgicalRecords,
            'medicationRecords' => $medicationRecords,
            'familyMedicalRecords' => $familyMedicalRecords,
        ]);
    }

    public function updateOrCreateHealthRecord(Request $request, $id = null)
    {
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

            return response()->json([
                'success' => 'success',
                'message' => 'User saved successfully!'
            ]);

            return redirect()->route($viewPath);

        } catch (Exception $e) {
            
            Log::error('Error during updateOrCreateHealthRecord: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();
            Session::flash('error', 'An error occurred during updateOrCreateHealthRecord.');

            return response()->json([
                'error' => 'error',
                'message' => 'Please try again'
            ]);
        }
    }
}
