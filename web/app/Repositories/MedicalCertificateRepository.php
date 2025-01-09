<?php

namespace App\Repositories;

use App\Contracts\MedicalCertificateContract;
use App\Models\MedicalCertificate;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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

    public function getAllMedicalCertificate()
    {
        return $this->model
            ->select(
                'medical_certificates.id',
                'medical_certificates.purpose',
                'medical_certificates.examin_date',
                'medical_certificates.issue_date',
                DB::raw("CONCAT(doctor_details.firstname, ' ', doctor_details.lastname) as doctor_name"),
                DB::raw("CONCAT(patient_details.firstname, ' ', patient_details.lastname) as patient_name")
            )
            ->join('user_details as doctor_details', 'medical_certificates.doctor_id', '=', 'doctor_details.id')
            ->join('user_details as patient_details', 'medical_certificates.patient_id', '=', 'patient_details.id')
            ->orderBy('medical_certificates.id', 'desc')
            ->get()
            ->map(function ($certificate) {
                return [
                    'id' => $certificate->id,
                    'doctor_name' => $certificate->doctor_name,
                    'patient_name' => $certificate->patient_name,
                    'purpose' => $certificate->purpose,
                    'examin_date' => $certificate->examin_date ? Carbon::parse($certificate->examin_date)->format('F d, Y') : null,
                    'issue_date' => $certificate->issue_date ? Carbon::parse($certificate->issue_date)->format('F d, Y') : null,
                ];
            });
    }

    public function getAllMedicalCertificateById($id)
    {
        return $this->model
            ->select(
                'medical_certificates.id',
                'medical_certificates.purpose',
                'medical_certificates.examin_date',
                'medical_certificates.issue_date',
                DB::raw("CONCAT(doctor_details.firstname, ' ', doctor_details.lastname) as doctor_name"),
                DB::raw("CONCAT(patient_details.firstname, ' ', patient_details.lastname) as patient_name")
            )
            ->join('user_details as doctor_details', 'medical_certificates.doctor_id', '=', 'doctor_details.id')
            ->join('user_details as patient_details', 'medical_certificates.patient_id', '=', 'patient_details.id')
            ->orderBy('medical_certificates.id', 'desc')
            ->where('patient_id', $id)
            ->get()
            ->map(function ($certificate) {
                return [
                    'id' => $certificate->id,
                    'doctor_name' => $certificate->doctor_name,
                    'patient_name' => $certificate->patient_name,
                    'purpose' => $certificate->purpose,
                    'examin_date' => $certificate->examin_date ? Carbon::parse($certificate->examin_date)->format('F d, Y') : null,
                    'issue_date' => $certificate->issue_date ? Carbon::parse($certificate->issue_date)->format('F d, Y') : null,
                ];
            });
    }

}
