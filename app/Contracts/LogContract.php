<?php

namespace App\Contracts;

interface LogContract {

    public function updateOrCreateLog($data);
    public function getAllLog();
    public function getLogById($id);
}
