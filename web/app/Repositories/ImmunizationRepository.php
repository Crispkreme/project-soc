<?php

namespace App\Repositories;

use App\Models\Immunization;
use App\Contracts\ImmunizationContract;

class ImmunizationRepository implements ImmunizationContract
{

    protected $model;

    public function __construct(Immunization $model)
    {
        $this->model = $model;
    }
            
    public function createOrUpdateImmunization($data)
    {
        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],
            [
                'doctor_id' => $data['doctor_id'],
                'patient_id' => $data['patient_id'],
                'immunization' => $data['immunization'],
                'pdf_file' => $data['pdf_file'] ?? null,
            ]
        );
    }

    public function getImmunizationById($id)
    {
        return $this->model
            ->where('id', $id)
            ->get();
    }

    public function getAllImmunization()
    {
        return $this->model
            ->get();
    }

    public function getAllImmunizationById($id)
    {
        return $this->model->with([
            'doctor.details',
            'patient.details'
        ])
        ->select('id', 'immunization', 'doctor_id', 'patient_id', 'pdf_file')
        ->where('patient_id', $id)
        ->get()
        ->map(function ($immunizations) {
            return [
                'id' => $immunizations->id,
                'doctor_name' => optional($immunizations->doctor->details)->firstname . ' ' .
                                optional($immunizations->doctor->details)->middlename . ' ' .
                                optional($immunizations->doctor->details)->lastname,
                'patient_name' => optional($immunizations->patient->details)->firstname . ' ' .
                                optional($immunizations->patient->details)->middlename . ' ' .
                                optional($immunizations->patient->details)->lastname,
                'immunization' => $immunizations->immunization,
                'pdf_file' => $immunizations->pdf_file,
                'created_at' => $immunizations->created_at,
            ];
        });
    }
}
