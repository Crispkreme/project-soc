<?php

namespace App\Repositories;

use App\Models\Hospitalization;
use App\Contracts\HospitalizationContract;

class HospitalizationRepository implements HospitalizationContract
{

    protected $model;

    public function __construct(Hospitalization $model)
    {
        $this->model = $model;
    }
            
    public function createOrUpdateHospitalization($data)
    {
        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],
            [
                'hospital_id' => $data['hospital_id'],
                'doctor_id' => $data['doctor_id'],
                'patient_id' => $data['patient_id'],
                'diagnosis' => $data['diagnosis'],
            ]
        );
    }

    public function getHospitalizationById($id)
    {
        return $this->model->with([
            'doctor.details',
            'patient.details',
        ])
        ->select('id', 'hospital_id', 'doctor_id', 'patient_id', 'diagnosis')
        ->where('patient_id', $id)
        ->get()
        ->map(function ($hospitalizations) {
            return [
                'doctor_name' => optional($hospitalizations->doctor->details)->firstname . ' ' .
                                optional($hospitalizations->doctor->details)->middlename . ' ' .
                                optional($hospitalizations->doctor->details)->lastname,
                'patient_name' => optional($hospitalizations->patient->details)->firstname . ' ' .
                                optional($hospitalizations->patient->details)->middlename . ' ' .
                                optional($hospitalizations->patient->details)->lastname,
                'hospital_name' => $hospitalizations->hospital->name,
                'diagnosis' => $hospitalizations->diagnosis,
                'created_at' => $hospitalizations->created_at,
            ];
        });
    }

    public function getAllHospitalization()
    {
        return $this->model
            ->get();
    }
}
