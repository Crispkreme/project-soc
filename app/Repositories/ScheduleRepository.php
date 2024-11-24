<?php

namespace App\Repositories;

use App\Contracts\ScheduleContract;
use App\Models\Schedule;
use Illuminate\Support\Facades\Auth;

class ScheduleRepository implements ScheduleContract
{

    protected $model;

    public function __construct(Schedule $model)
    {
        $this->model = $model;
    }

    public function updateOrCreateSchedule($data)
    {
        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],[
                'doctor_id' => $data['doctor_id'],
                'barangay_event_id' => $data['barangay_event_id'],
                'notes' => $data['notes'],
                'appointment_date' => $data['appointment_date'],
                'appointment_start' => $data['appointment_start'],
                'appointment_end' => $data['appointment_end'],
            ]
        );
    }

    public function getDoctorScheduleByID()
    {
        $userId = Auth::user()->id;
        return $this->model
            ->where('doctor_id', '=', $userId)
            ->get();
    }
}
