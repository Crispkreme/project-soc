<?php

namespace App\Contracts;

interface MedicalRecordContract {

    public function createOrUpdateMedicalRecord($data);
    public function getMedicalRecordById($id);
    public function getAllMedicalRecord();
    public function searchMedicine($data);
}
