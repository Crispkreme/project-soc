<?php

namespace App\Repositories;

use App\Models\TestResult;
use App\Contracts\TestResultContract;

class TestResultRepository implements TestResultContract
{

    protected $model;

    public function __construct(TestResult $model)
    {
        $this->model = $model;
    }

    public function createOrUpdateTestResult($data)
    {
        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],
            [
                'patient_id' => $data['patient_id'],
                'name' => $data['name'],
                'result' => $data['result'],
                'pdf_file' => $data['pdf_file'] ?? null,
            ]
        );
    }

    public function getTestResultById($id)
    {
        return $this->model
            ->where('id', $id)
            ->get();
    }

    public function getAllTestResultById($id)
    {
        return $this->model
            ->where('patient_id', $id)
            ->get();
    }

    public function getAllTestResult()
    {
        return $this->model
            ->get();
    }
}
