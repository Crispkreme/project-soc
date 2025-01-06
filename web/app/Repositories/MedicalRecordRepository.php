<?php

namespace App\Repositories;

use App\Models\MedicalRecord;
use App\Contracts\MedicalRecordContract;

class MedicalRecordRepository implements MedicalRecordContract
{

    protected $model;

    public function __construct(MedicalRecord $model)
    {
        $this->model = $model;
    }
            
    public function createOrUpdateMedicalRecord($data)
    {
        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],
            [
                'patient_id' => $data['patient_id'],
                'medicine_id' => $data['medicine_id'],
                'diagnosis' => $data['diagnosis'],
                'pdf_file' => $data['pdf_file'] ?? null,
            ]
        );
    }

    public function getMedicalRecordById($id)
    {

        return $this->model->with([
            'medicine',
        ])
        ->select('id', 'patient_id', 'medicine_id', 'diagnosis', 'created_at')
        ->where('patient_id', $id)
        ->get();
    }

    public function getAllMedicalRecord()
    {
        return $this->model
            ->get();
    }

    public function searchMedicine($data)
    {
        return MedicalRecord::where('diagnosis', 'like', "%{$data}%")
        ->with('medicine')
        ->get()
        ->map(function ($record) {
            return $record->medicine ? $record->medicine->medicine_name : null;
        })
        ->filter();
    }
}
