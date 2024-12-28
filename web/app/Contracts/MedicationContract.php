<?php

namespace App\Contracts;

interface MedicationContract {

    public function createOrUpdateMedication($data);
    public function getMedicationById($id);
    public function getAllMedication();
    public function getSpecificMedicationById($id);
    public function updateMedicationStatusById($status, $id);
}
