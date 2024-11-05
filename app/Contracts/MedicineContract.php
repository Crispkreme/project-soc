<?php

namespace App\Contracts;

interface MedicineContract {

    public function getAllMedicine();
    public function getAllMedicineName();
    public function getMedicineById($id);
    public function createOrUpdateMedicine($data);
    public function deleteMedicine($id);
}
