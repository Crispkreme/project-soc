<?php

namespace App\Contracts;

interface MedicalCertificateContract {

    public function createOrUpdateMedicalCertificate($data);
    public function getAllMedicalCertificate();
    public function getAllMedicalCertificateById($id);
}
