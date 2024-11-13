<?php

namespace App\Repositories;

use App\Models\Appointment;
use App\Contracts\AppointmentContract;

class AppointmentRepository implements AppointmentContract
{

    protected $model;

    public function __construct(Appointment $model)
    {
        $this->model = $model;
    }

    public function createOrUpdateAppointment($data)
    {
        return $this->model->updateOrCreate(
            [
                'doctor_id' => $data['doctor_id'] ?? null,
            ],
            [
                'booking_id' => $data['booking_id'] ?? null,
                'slot' => $data['slot'],
                'appointment_status' => $data['booking_status'] ?? 'Inprogress',
            ]
        );
    }

    public function getAllAppointments()
    {
        return Appointment::with([
            'booking' => function ($query) {
                $query->select('id', 'patient_id', 'title', 'appointment_date', 'appointment_start', 'appointment_end', 'notes')
                    ->with(['patient' => function ($subQuery) {
                        $subQuery->select('user_id', 'firstname', 'lastname');
                    }]);
            },
            'doctor' => function ($query) {
                $query->select('id', 'firstname', 'lastname');
            }
        ])
        ->get()
        ->map(function ($appointment) {
            return [
                'doctor_name' => optional($appointment->doctor)->firstname . ' ' . optional($appointment->doctor)->lastname,
                'patient_name' => optional($appointment->booking->patient)->firstname . ' ' . optional($appointment->booking->patient)->lastname,
                'title' => optional($appointment->booking)->title,
                'appointment_date' => optional($appointment->booking)->appointment_date,
                'time' => optional($appointment->booking)->appointment_start . ' - ' . optional($appointment->booking)->appointment_end,
                'notes' => optional($appointment->booking)->notes,
            ];
        });
    }
}
