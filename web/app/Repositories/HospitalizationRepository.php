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
                'pdf_file' => $data['pdf_file'],
            ]
        );
    }

    public function getHospitalizationById($id)
    {
        return $this->model
            ->with([
                'hospital:id,name',
                'doctor.details:id,user_id,firstname,middlename,lastname',
                'patient.details:id,user_id,firstname,middlename,lastname',
            ])
            ->where('patient_id', $id)
            ->get()
            ->map(function ($hospitalization) {
                return [
                    'id' => $hospitalization->id,
                    'hospital_name' => $hospitalization->hospital->name ?? null,
                    'doctor_name' => trim(
                        ($hospitalization->doctor->details->firstname ?? '') . ' ' .
                        ($hospitalization->doctor->details->middlename ?? '') . ' ' .
                        ($hospitalization->doctor->details->lastname ?? '')
                    ),
                    'patient_name' => trim(
                        ($hospitalization->patient->details->firstname ?? '') . ' ' .
                        ($hospitalization->patient->details->middlename ?? '') . ' ' .
                        ($hospitalization->patient->details->lastname ?? '')
                    ),
                    'diagnosis' => $hospitalization->diagnosis,
                    'pdf_file' => $hospitalization->pdf_file,
                    'created_at' => $hospitalization->created_at->format('F d, Y'),
                ];
            });
    }

    public function getAllHospitalization()
    {
        return $this->model->get();
    }    
}
