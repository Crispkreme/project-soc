<?php

namespace App\Repositories;

use App\Models\Booking;
use App\Contracts\BookingContract;

class BookingRepository implements BookingContract
{

    protected $model;

    public function __construct(Booking $model)
    {
        $this->model = $model;
    }

    public function getAllBooking()
    {
        return $this->model
            ->with(['approver:id,firstname,middlename,lastname', 'patient:id,firstname,middlename,lastname'])
            ->get()
            ->map(function ($booking) {
                $doctorName = $booking->approver
                    ? trim("{$booking->approver->firstname} {$booking->approver->middlename} {$booking->approver->lastname}")
                    : 'N/A';
                
                $patientName = $booking->patient
                    ? trim("{$booking->patient->firstname} {$booking->patient->middlename} {$booking->patient->lastname}")
                    : 'N/A';

                return [
                    'id' => $booking->id,
                    'doctor_name' => $doctorName,
                    'patient_name' => $patientName,
                    'title' => $booking->title,
                    'notes' => $booking->notes,
                    'appointment_date' => $booking->appointment_date,
                    'appointment_start' => $booking->appointment_start,
                    'appointment_end' => $booking->appointment_end,
                    'booking_status' => $booking->booking_status,
                ];
            });
    }


    public function createOrUpdateBooking($data)
    {
        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],
            [
                'approve_by_id' => $data['approve_by_id'] ?? null,
                'patient_id' => $data['patient_id'],
                'title' => $data['title'],
                'notes' => $data['notes'],
                'appointment_date' => $data['appointment_date'],
                'appointment_start' => $data['appointment_start'],
                'appointment_end' => $data['appointment_end'],
                'approved_date' => $data['approved_date'] ?? null,
                'booking_status' => $data['booking_status'] ?? 'Inprogress',
            ]
        );
    }

    public function getBookingById($id)
    {
        return $this->model
            ->where('id', $id)
            ->first();
    }
}
