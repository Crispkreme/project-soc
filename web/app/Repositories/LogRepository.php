<?php

namespace App\Repositories;

use App\Contracts\LogContract;
use App\Models\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LogRepository implements LogContract
{

    protected $model;

    public function __construct(Log $model)
    {
        $this->model = $model;
    }

    public function updateOrCreateLog($data)
    {
        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],[
                'doctor_id' => $data['doctor_id'] ?? null,
                'patient_id' => $data['patient_id'] ?? null,
                'message' => $data['message'],
                'log_status' => $data['log_status'],
            ]
        );
    }

    public function getAllLog()
    {
        return $this->model->get();
    }

    public function getLogById($id)
    {
        return $this->model
            ->where('patient_id', $id)
            ->leftJoin('user_details as doctor_details', 'logs.doctor_id', '=', 'doctor_details.user_id')
            ->leftJoin('user_details as patient_details', 'logs.patient_id', '=', 'patient_details.user_id')
            ->select(
                'logs.*',
                DB::raw("CONCAT(doctor_details.firstname, ' ', COALESCE(doctor_details.middlename, ''), ' ', doctor_details.lastname) as doctor_name"),
                DB::raw("CONCAT(patient_details.firstname, ' ', COALESCE(patient_details.middlename, ''), ' ', patient_details.lastname) as patient_name")
            )
            ->get();
    }

    public function getAllPatientLog($id)
    {
        return $this->model
            ->where('patient_id', $id)
            ->leftJoin('user_details as doctor_details', 'logs.doctor_id', '=', 'doctor_details.user_id')
            ->leftJoin('user_details as patient_details', 'logs.patient_id', '=', 'patient_details.user_id')
            ->select(
                'logs.*',
                DB::raw("CONCAT(doctor_details.firstname, ' ', COALESCE(doctor_details.middlename, ''), ' ', doctor_details.lastname) as doctor_name"),
                DB::raw("CONCAT(patient_details.firstname, ' ', COALESCE(patient_details.middlename, ''), ' ', patient_details.lastname) as patient_name")
            )
            ->get();
    }

    public function getAllDoctorLog($id)
    {
        return $this->model->where('doctor_id', $id)->get();
    }
}
