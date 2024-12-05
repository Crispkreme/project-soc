<?php

namespace App\Contracts;

interface PrescriptionContract {

    public function updateOrCreatePrescription($data);
    public function getAllPrescription();
}
