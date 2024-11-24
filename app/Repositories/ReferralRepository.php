<?php

namespace App\Repositories;

use App\Contracts\ReferralContract;
use App\Models\Referral;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReferralRepository implements ReferralContract
{

    protected $model;

    public function __construct(Referral $model)
    {
        $this->model = $model;
    }

    public function updateOrCreateReferral($data)
    {
        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],[
                'doctor_id' => $data['doctor_id'],
                'patient_id' => $data['patient_id'],
                'refer_to_id' => $data['refer_to_id'],
                'reason' => $data['reason'],
                'referral_status' => $data['referral_status'],
                'hospital_id' => $data['hospital_id'],
            ]
        );
    }

    public function getAllReferral()
    {
        return $this->model
        ->select(
            'referrals.id',
            'referrals.doctor_id',
            'referrals.patient_id',
            'referrals.refer_to_id',
            'referrals.hospital_id',
            'referrals.reason',
            'referrals.referral_status',
            'referrals.created_at',
            'referrals.updated_at',
            DB::raw("CONCAT(doctor_details.firstname, ' ', doctor_details.lastname) as doctor_name"),
            DB::raw("CONCAT(patient_details.firstname, ' ', patient_details.lastname) as patient_name"),
            DB::raw("CONCAT(refer_to_details.firstname, ' ', refer_to_details.lastname) as refer_to_name"),
            'hospitals.name as hospital_name'
        )
        ->leftJoin('user_details as doctor_details', 'referrals.doctor_id', '=', 'doctor_details.user_id')
        ->leftJoin('user_details as patient_details', 'referrals.patient_id', '=', 'patient_details.user_id')
        ->leftJoin('user_details as refer_to_details', 'referrals.refer_to_id', '=', 'refer_to_details.user_id')
        ->leftJoin('hospitals', 'referrals.hospital_id', '=', 'hospitals.id')
        ->get();
    }
}
