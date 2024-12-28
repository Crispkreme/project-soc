<?php

namespace App\Repositories;

use App\Models\Inventory;
use App\Contracts\InventoryContract;

class InventoryRepository implements InventoryContract
{

    protected $model;

    public function __construct(Inventory $model)
    {
        $this->model = $model;
    }

    public function createOrUpdateInventory($data)
    {
        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],
            [
                'medicine_id' => $data['medicine_id'],
                'encode_by_id' => $data['encode_by_id'],
                'usage' => $data['usage'],
                'quantity' => $data['quantity'],
            ]
        );
    }

    public function getInventoryById($id)
    {
        return $this->model
            ->where('id', $id)
            ->first();
    }

    public function getAllInventory()
    {
        return $this->model
            ->join('users', 'inventories.encode_by_id', '=', 'users.id')
            ->join('medicines', 'inventories.medicine_id', '=', 'medicines.id')
            ->select(
                'inventories.*',
                'users.firstname',
                'users.middlename',
                'users.lastname',
                'medicines.medicine_name',
                'medicines.description',
            )
            ->get();
    }

    public function getAllInventoryQuantityById($id)
    {
        return $this->model
            ->where('medicine_id', $id)
            ->first();
    }
}
