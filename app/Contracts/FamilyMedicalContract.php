<?php

namespace App\Contracts;

interface FamilyMedicalContract {

    public function createOrUpdateFamilyMedical($data);
    public function getFamilyMedicalById($id);
    public function getAllFamilyMedical();
}
