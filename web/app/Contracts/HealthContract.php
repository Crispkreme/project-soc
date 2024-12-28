<?php

namespace App\Contracts;

interface HealthContract {

    public function createOrUpdateHealth($data);
    public function getHealthById($id);
    public function getAllHealth();
}
