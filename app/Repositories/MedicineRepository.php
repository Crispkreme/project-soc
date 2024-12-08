<?php

namespace App\Repositories;

use App\Models\Medicine;
use App\Contracts\MedicineContract;

class MedicineRepository implements MedicineContract
{

    protected $model;

    public function __construct(Medicine $model)
    {
        $this->model = $model;
    }

    public function getAllMedicine()
    {
        return $this->model->orderBy('id', 'desc')->get();
    }

    public function createOrUpdateMedicine($data)
    {
        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],
            [
                'medicine_name' => $data['medicine_name'],
                'description' => $data['description'], 
            ]
        );
    }

    public function getMedicineById($id)
    {
        return $this->model
            ->where('id', $id)
            ->first();
    }

    public function deleteMedicine($id)
    {
        $data = $this->model->findOrFail($id);
        if ($data) {
            $data->delete();
        }
        return $data;
    }

    public function getAllMedicineName()
    {
        return $this->model
            ->select('id', 'medicine_name AS name')
            ->get();
    }
}
