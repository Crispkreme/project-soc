<?php

namespace App\Repositories;

use App\Models\MedicalCertificate;
use App\Contracts\MedicalCertificateContract;

class MedicalCertificateRepository implements MedicalCertificateContract
{

    protected $model;

    public function __construct(MedicalCertificate $model)
    {
        $this->model = $model;
    }

    public function createOrUpdateMedicalCertificate($data)
    {
        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],
            [
                'issue_date' => $data['issue_date'],
                'examin_date' => $data['examin_date'],
                'patient_id' => $data['patient_id'],
                'doctor_id' => $data['doctor_id'],
                'purpose' => $data['purpose'],
            ]
        );
    }
}
