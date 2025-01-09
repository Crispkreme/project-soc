<?php

namespace App\Repositories;

use App\Models\Medication;
use App\Contracts\MedicationContract;

class MedicationRepository implements MedicationContract
{

    protected $model;

    public function __construct(Medication $model)
    {
        $this->model = $model;
    }
            
    public function createOrUpdateMedication($data)
    {
        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],
            [
                'patient_id' => $data['patient_id'],
                'medicine_id' => $data['medicine_id'],
                'quantity' => $data['quantity'] ?? 0,
                'pdf_file' => $data['pdf_file'] ?? null,
                'dosage' => $data['dosage'] ?? null,
                'reason' => $data['reason'],
                'medication_status' => $data['medication_status'] ?? 'Pending',
            ]
        );
    }

    public function getMedicationById($id)
    {
        return $this->model
            ->with(['medicine'])
            ->where('medications.patient_id', '=', $id)
            ->get()
            ->map(function ($medication) {
                return [
                    'id' => $medication->id,
                    'patient_id' => $medication->patient_id,
                    'medicine_id' => $medication->medicine_id,
                    'medicine_name' => $medication->medicine->medicine_name ?? null,
                    'reason' => $medication->reason,
                    'medication_status' => $medication->medication_status,
                    'quantity' => $medication->quantity,
                    'dosage' => $medication->dosage,
                    'pdf_file' => $medication->pdf_file,
                    'created_at' => $medication->created_at,
                    'updated_at' => $medication->updated_at,
                ];
            });
    }

    public function getAllMedication()
    {
        return $this->model
            ->with(['medicine', 'patient.details'])
            ->get()
            ->map(function ($medication) {
                $patientDetails = $medication->patient->details ?? null;
                $patientName = $patientDetails 
                    ? $patientDetails->firstname . ' ' . $patientDetails->lastname 
                    : null;

                return [
                    'id' => $medication->id,
                    'patient_id' => $medication->patient_id,
                    'patient_name' => $patientName,
                    'medicine_id' => $medication->medicine_id,
                    'medicine_name' => $medication->medicine->medicine_name ?? null,
                    'reason' => $medication->reason,
                    'medication_status' => $medication->medication_status,
                    'quantity' => $medication->quantity,
                    'created_at' => $medication->created_at,
                    'updated_at' => $medication->updated_at,
                ];
            });
    }

    public function updateMedicationStatusById($status, $id)
    {
        $appointment = $this->model->where('id', $id)->first();
        if ($appointment) {
            $appointment->update(['medication_status' => $status]);
            return $appointment;
        }
    }

    public function getSpecificMedicationById($id)
    {
        
        return $this->model->where('id', $id)->first();
    }
}
