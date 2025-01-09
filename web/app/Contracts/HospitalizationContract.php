<?php

namespace App\Contracts;

interface HospitalizationContract {

    public function createOrUpdateHospitalization($data);
    public function getHospitalizationById($id);
    public function getAllHospitalization();
}
