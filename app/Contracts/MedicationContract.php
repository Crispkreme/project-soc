<?php

namespace App\Contracts;

interface MedicationContract {

    public function createOrUpdateMedication($data);
    public function getMedicationById($id);
    public function getAllMedication();
}
