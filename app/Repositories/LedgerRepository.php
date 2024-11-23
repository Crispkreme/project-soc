<?php

namespace App\Repositories;

use App\Models\Ledger;
use App\Contracts\LedgerContract;

class LedgerRepository implements LedgerContract
{

    protected $model;

    public function __construct(Ledger $model)
    {
        $this->model = $model;
    }

    public function createOrUpdateLedger($data)
    {        
        return $this->model->updateOrCreate(
            [
                'medicine_id' => $data['medicine_id'],
            ],
            [
                'sold' => $data['sold'],
                'in_stock' => $data['in_stock'],
            ]
        );
    }

    public function getLedgerById($id)
    {
        return $this->model
            ->where('id', $id)
            ->first();
    }

    public function getLedgerByMedicineId($id)
    {
        return $this->model
            ->where('medicine_id', $id)
            ->first();
    }

    public function getAllLedger()
    {
        return $this->model
            ->join('medicines', 'ledgers.medicine_id', '=', 'medicines.id')
            ->select(
                'ledgers.*',
                'medicines.medicine_name',
                'medicines.description',
            )
            ->get();
    }
}
