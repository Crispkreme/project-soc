<?php

namespace App\Repositories;

use App\Models\Health;
use App\Contracts\HealthContract;

class HealthRepository implements HealthContract
{

    protected $model;

    public function __construct(Health $model)
    {
        $this->model = $model;
    }

    public function createOrUpdateHealth($data)
    {
        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],
            [
                'patient_id' => $data['patient_id'],
                'name' => $data['name'],
                'description' => $data['description'],
                'pdf_file' => $data['pdf_file'],
            ]
        );
    }

    public function getHealthById($id)
    {
        return $this->model
            ->where('patient_id', $id)
            ->get();
    }

    public function getAllHealth()
    {
        return $this->model
            ->get();
    }
}
