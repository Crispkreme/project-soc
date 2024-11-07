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
                'email' => $data['email'],
                'password' => $data['password'],
                'role' => $data['role'],
                'username' => $data['username'],
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
