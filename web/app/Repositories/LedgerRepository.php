<?php

namespace App\Repositories;

use App\Contracts\LedgerContract;
use App\Models\Ledger;
use Carbon\Carbon;
use Exception;

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
                'expiration_date' => $data['expiration_date'] ?? null,
                'dosage' => $data['dosage'] ?? null,
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
                'ledgers.sold',
                'ledgers.in_stock',
                'ledgers.expiration_date',
                'ledgers.dosage',
                'medicines.medicine_name',
                'medicines.description',
                'medicines.id'
            )
            ->get()
            ->map(function ($record) {
                return [
                    'medicine_id' => $record->id,
                    'medicine_name' => $record->medicine_name,
                    'description' => $record->description,
                    'sold' => $record->sold,
                    'in_stock' => $record->in_stock,
                    'expiration_date' => Carbon::parse($record->expiration_date)->format('F d, Y'),
                    'dosage' => $record->dosage,
                ];
            })
            ->filter(function ($record) {
                return $record['in_stock'] > 0;
            });
    }

    public function updateLedgerQuantity($id, $quantity)
    {
        $medicine = $this->model->where('medicine_id', $id)->firstOrFail();
        
        if ($quantity > $medicine->in_stock) {
            throw new Exception('Quantity to deduct exceeds available stock.');
        }

        $newInStock = $medicine->in_stock - $quantity;
        $newSold = $medicine->sold + $quantity;
        
        $medicine->update([
            'sold' => $newSold,
            'in_stock' => $newInStock,
        ]);

        return $medicine;
    }

    public function checkLedgerQuantity($id)
    {
        return $this->model->where('medicine_id', $id)->firstOrFail();
    }

    public function getAllLedgerMedicine()
    {
        return $this->model
        ->join('medicines', 'medicines.id', '=', 'ledgers.medicine_id')
        ->select('medicines.medicine_name', 'medicines.id as medicine_id', 'ledgers.in_stock')
        ->get();
    }
}
