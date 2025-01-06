<?php

namespace App\Repositories;

use App\Models\FamilyMedical;
use App\Contracts\FamilyMedicalContract;

class FamilyMedicalRepository implements FamilyMedicalContract
{

    protected $model;

    public function __construct(FamilyMedical $model)
    {
        $this->model = $model;
    }
    
    public function createOrUpdateFamilyMedical($data)
    {
        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],
            [
                'patient_id' => $data['patient_id'],
                'disease' => $data['disease'],
                'relationship_disease' => $data['relationship_disease'],
                'pdf_file' => $data['pdf_file'] ?? null,
            ]
        );
    }

    public function getFamilyMedicalById($id)
    {
        return $this->model
            ->where('id', $id)
            ->get();
    }

    public function getAllFamilyMedical()
    {
        return $this->model
            ->get();
    }
}
