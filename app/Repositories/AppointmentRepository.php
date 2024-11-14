<?php

namespace App\Repositories;

use App\Contracts\AppointmentContract;
use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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
                        $subQuery->select('user_detail_id', 'firstname', 'lastname');
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

    public function getAllAppointmentByMonth()
    {
        $appointments = Appointment::join('bookings', 'appointments.booking_id', '=', 'bookings.id')
            ->join('user_details as doctor_details', 'appointments.doctor_id', '=', 'doctor_details.id')
            ->join('users as doctor_users', 'doctor_details.user_id', '=', 'doctor_users.id')
            ->select([
                DB::raw("CONCAT(doctor_details.firstname, ' ', COALESCE(doctor_details.middlename, ''), ' ', doctor_details.lastname) as doctor_name"),
                'doctor_users.role as role',
                'bookings.title as appointment',
                'bookings.notes as description',
                'bookings.appointment_date as date',
                DB::raw("CONCAT(bookings.appointment_start, ' - ', bookings.appointment_end) as time")
            ])
            ->get();

        $groupedEvents = $appointments->groupBy(function ($appointment) {
            return Carbon::parse($appointment->date)->format('F Y');
        });

        return $groupedEvents;
    }
}
