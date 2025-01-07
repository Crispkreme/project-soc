<?php

namespace App\Repositories;

use App\Models\Prescription;
use App\Contracts\PrescriptionContract;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PrescriptionRepository implements PrescriptionContract
{

    protected $model;

    public function __construct(Prescription $model)
    {
        $this->model = $model;
    }

    public function updateOrCreatePrescription($data)
    {
        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],[
                'doctor_id' => $data['doctor_id'],
                'patient_id' => $data['patient_id'],
                'medicine_id' => $data['medicine_id'],
                'instruction' => $data['instruction'],
                'quantity' => $data['quantity'],
                'diagnosis' => $data['diagnosis'],
            ]
        );
    }

    public function getAllPrescription()
    {
        return $this->model
            ->selectRaw("
                prescriptions.created_at,
                doctors.id AS doctor_id,
                CONCAT(doctor_details.firstname, ' ', doctor_details.lastname) AS doctor_name,
                patients.id AS patient_id,
                CONCAT(patient_details.firstname, ' ', patient_details.lastname) AS patient_name,
                GROUP_CONCAT(medicines.medicine_name SEPARATOR ', ') AS medicines,
                GROUP_CONCAT(prescriptions.instruction SEPARATOR '; ') AS instructions
            ")
            ->join('users AS doctors', 'prescriptions.doctor_id', '=', 'doctors.id')
            ->join('user_details AS doctor_details', 'doctors.id', '=', 'doctor_details.user_id')
            ->join('users AS patients', 'prescriptions.patient_id', '=', 'patients.id')
            ->join('user_details AS patient_details', 'patients.id', '=', 'patient_details.user_id')
            ->join('medicines', 'prescriptions.medicine_id', '=', 'medicines.id')
            ->groupBy('prescriptions.created_at', 'doctor_id', 'doctor_name', 'patient_id', 'patient_name')
            ->orderBy('prescriptions.created_at', 'DESC')
        ->get();
    }
}
