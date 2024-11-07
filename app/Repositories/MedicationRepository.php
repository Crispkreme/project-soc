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
                'dosage' => $data['dosage'],
                'reason' => $data['reason'],
            ]
        );
    }

    public function getMedicationById($id)
    {
        return $this->model
            ->with(['medicine'])
            ->where('medications.patient_id', '=', $id)
            ->get();
    }

    public function getAllMedication()
    {
        return $this->model
            ->get();
    }
}
