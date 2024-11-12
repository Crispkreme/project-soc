<?php

namespace App\Contracts;

interface SurgicalContract {

    public function createOrUpdateSurgical($data);
    public function getSurgicalById($id);
    public function getAllSurgical();
}
