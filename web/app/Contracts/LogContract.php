<?php

namespace App\Contracts;

interface LogContract {

    public function updateOrCreateLog($data);
    public function getAllLog();
    public function getLogById($id);
    public function getAllPatientLog($id);
    public function getAllDoctorLog($id);
}
