<?php

namespace App\Contracts;

interface ImmunizationContract {

    public function createOrUpdateImmunization($data);
    public function getImmunizationById($id);
    public function getAllImmunization();
    public function getAllImmunizationById($id);
}
