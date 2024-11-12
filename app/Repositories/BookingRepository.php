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
            ->with(['approver:id,firstname,middlename,lastname', 'patient:id,firstname,middlename,lastname']) // Load first, middle, and last names
            ->get()
            ->map(function ($booking) {
                $doctorName = trim("{$booking->approver->firstname} {$booking->approver->middlename} {$booking->approver->lastname}");
                $patientName = trim("{$booking->patient->firstname} {$booking->patient->middlename} {$booking->patient->lastname}");

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

}
