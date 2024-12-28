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
            'doctor.details',  // Eager load doctor's details
            'patient.details',  // Eager load patient's details
            'hospital', // Make sure the hospital relationship is eager-loaded
        ])
        ->select('id', 'hospital_id', 'doctor_id', 'patient_id', 'diagnosis')
        ->where('patient_id', $id)
        ->get()
        ->map(function ($hospitalizations) {
            return [
                'id' => $hospitalizations->id,
                'doctor_name' => optional($hospitalizations->doctor)->details
                                ? optional($hospitalizations->doctor->details)->firstname . ' ' . 
                                  optional($hospitalizations->doctor->details)->middlename . ' ' . 
                                  optional($hospitalizations->doctor->details)->lastname
                                : 'No doctor assigned',
                'patient_name' => optional($hospitalizations->patient)->details
                                 ? optional($hospitalizations->patient->details)->firstname . ' ' . 
                                   optional($hospitalizations->patient->details)->middlename . ' ' . 
                                   optional($hospitalizations->patient->details)->lastname
                                 : 'No patient details',
                'hospital_name' => optional($hospitalizations->hospital)->name,
                'diagnosis' => $hospitalizations->diagnosis,
                'created_at' => $hospitalizations->created_at,
            ];
        });
    }

    public function getAllHospitalization()
    {
        return $this->model->get();
    }
}
