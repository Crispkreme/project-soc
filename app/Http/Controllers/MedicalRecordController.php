<?php

namespace App\Http\Controllers;

use App\Contracts\FamilyMedicalContract;
use App\Contracts\HealthContract;
use App\Contracts\MedicationContract;
use App\Contracts\SurgicalContract;
use App\Contracts\UserDetailContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MedicalRecordController extends Controller
{
    protected $userDetailContract;
    protected $healthContract;
    protected $surgicalContract;
    protected $medicationContract;
    protected $familyMedicalContract;

    public function __construct(
        UserDetailContract $userDetailContract,
        HealthContract $healthContract,
        SurgicalContract $surgicalContract,
        MedicationContract $medicationContract,
        FamilyMedicalContract $familyMedicalContract,
    ) {
        $this->userDetailContract = $userDetailContract;
        $this->healthContract = $healthContract;
        $this->surgicalContract = $surgicalContract;
        $this->medicationContract = $medicationContract;
        $this->familyMedicalContract = $familyMedicalContract;
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

    public function getPatientMedicalRecord($id)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $role = 'Patient';
        $status = 'Active';
        $patient = $this->userDetailContract->getSpecificUserDetailsById($id, $role, $status);
        $healthRecords = $this->healthContract->getHealthById($id);
        $surgicalRecords = $this->surgicalContract->getSurgicalById($id);
        $medicationRecords = $this->medicationContract->getMedicationById($id);
        $familyMedicalRecords = $this->familyMedicalContract->getFamilyMedicalById($id);

        return Inertia::render('Admins/Medicals/PatientRecord', [
            'patient' => $patient,
            'healthRecords' => $healthRecords,
            'surgicalRecords' => $surgicalRecords,
            'medicationRecords' => $medicationRecords,
            'familyMedicalRecords' => $familyMedicalRecords,
        ]);
    }
}
