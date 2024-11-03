<?php

namespace App\Contracts;

interface LedgerContract {

    public function createOrUpdateLedger($data);
    public function getLedgerById($id);
    public function getAllLedger();
}
