<?php

namespace App\Repositories;

use App\Models\Surgical;
use App\Contracts\SurgicalContract;

class SurgicalRepository implements SurgicalContract
{

    protected $model;

    public function __construct(Surgical $model)
    {
        $this->model = $model;
    }

    public function createOrUpdateSurgical($data)
    {
        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],
            [
                'patient_id' => $data['patient_id'],
                'doctor_id' => $data['doctor_id'],
                'procedure' => $data['procedure'],
                'description' => $data['description'],
                'pdf_file' => $data['pdf_file'] ?? null,
            ]
        );
    }

    public function getAllSurgicalById($id)
    {
        return Surgical::with([
                'doctor.details',
                'patient.details'
            ])
            ->select('id', 'procedure', 'description', 'doctor_id', 'patient_id', 'pdf_file')
            ->where('patient_id', $id)
            ->get()
            ->map(function ($surgical) {
                return [
                    'id' => $surgical->id, 
                    'doctor_id' => $surgical->doctor_id,
                    'doctor_name' => optional($surgical->doctor->details)->firstname . ' ' .
                                    optional($surgical->doctor->details)->middlename . ' ' .
                                    optional($surgical->doctor->details)->lastname,
                    'patient_name' => optional($surgical->patient->details)->firstname . ' ' .
                                    optional($surgical->patient->details)->middlename . ' ' .
                                    optional($surgical->patient->details)->lastname,
                    'procedure' => $surgical->procedure,
                    'pdf_file' => $surgical->pdf_file,
                    'description' => $surgical->description,
                    'created_at' => $surgical->created_at,
                ];
            });
    }


    public function getAllSurgical()
    {
        return $this->model
            ->get();
    }

    public function getSurgicalById($id)
    {
        return $this->model
            ->where('id', $id)
            ->get();
    }
}
