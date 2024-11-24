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
                'quantity' => $data['quantity'],
                'reason' => $data['reason'],
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
                    'quantity' => $medication->quantity,
                    'created_at' => $medication->created_at,
                    'updated_at' => $medication->updated_at,
                ];
            });
    }

    public function getAllMedication()
    {
        return $this->model
            ->get();
    }
}
