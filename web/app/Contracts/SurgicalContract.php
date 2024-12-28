<?php

namespace App\Contracts;

interface SurgicalContract {

    public function createOrUpdateSurgical($data);
    public function getAllSurgicalById($id);
    public function getAllSurgical();
    public function getSurgicalById($id);
}
