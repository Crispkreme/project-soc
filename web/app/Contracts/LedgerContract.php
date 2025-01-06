<?php

namespace App\Contracts;

interface LedgerContract {

    public function createOrUpdateLedger($data);
    public function getLedgerById($id);
    public function getAllLedger();
    public function getLedgerByMedicineId($id);
    public function updateLedgerQuantity($id, $data);
    public function checkLedgerQuantity($id);
    public function getAllLedgerMedicine();
}
