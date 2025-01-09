<?php

namespace App\Contracts;

interface TestResultContract {

    public function createOrUpdateTestResult($data);
    public function getTestResultById($id);
    public function getAllTestResult();
    public function getAllTestResultById($id);
}
