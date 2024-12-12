<?php

namespace App\Repositories;

use App\Contracts\BookingContract;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BookingRepository implements BookingContract
{

    protected $model;

    public function __construct(Booking $model)
    {
        $this->model = $model;
    }

    public function formatDateTime($dateTime, $type = 'date')
    {
        if (!$dateTime) {
            return '';
        }

        $carbonDate = Carbon::parse($dateTime);

        if ($type == 'date') {
            return $carbonDate->format('F j, Y');
        } elseif ($type == 'time') {
            return $carbonDate->format('h:i A');
        }

        return $dateTime;
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
                    'patient_id' => $booking->patient_id,
                    'doctor_id' => $booking->approve_by_id,
                    'doctor_name' => $doctorName,
                    'patient_name' => $patientName,
                    'title' => $booking->title,
                    'notes' => $booking->notes,
                    'reason' => $booking->reason,
                    'appointment_date' => $this->formatDateTime($booking->appointment_date, 'date'),
                    'updated_at' => $this->formatDateTime($booking->updated_at, 'date'),
                    'appointment_start' => $this->formatDateTime($booking->appointment_start, 'time'),
                    'appointment_end' => $this->formatDateTime($booking->appointment_end, 'time'),
                    'booking_status' => $booking->booking_status,
                ];
            });
    }

    public function getCurrentBooking()
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
                    'patient_id' => $booking->patient_id,
                    'doctor_id' => $booking->approve_by_id,
                    'doctor_name' => $doctorName,
                    'patient_name' => $patientName,
                    'title' => $booking->title,
                    'notes' => $booking->notes,
                    'reason' => $booking->reason,
                    'appointment_date' => $this->formatDateTime($booking->appointment_date, 'date'),
                    'updated_at' => $this->formatDateTime($booking->updated_at, 'date'),
                    'appointment_start' => $this->formatDateTime($booking->appointment_start, 'time'),
                    'appointment_end' => $this->formatDateTime($booking->appointment_end, 'time'),
                    'booking_status' => $booking->booking_status,
                ];
            });
    }

    public function getPatientBooking($id)
    {
        return $this->model
            ->with(['approver:id,firstname,middlename,lastname'])
            ->where('patient_id', $id)
            ->get()
            ->map(function ($booking) {
                $approverName = $booking->approver
                    ? implode(' ', array_filter([
                        $booking->approver->firstname,
                        $booking->approver->middlename,
                        $booking->approver->lastname,
                    ]))
                    : 'N/A';

                $appointmentDate = $this->formatDateTime($booking->appointment_date, 'date');
                $updatedAt = $this->formatDateTime($booking->updated_at, 'date');
                $appointmentStart = $this->formatDateTime($booking->appointment_start, 'time');
                $appointmentEnd = $this->formatDateTime($booking->appointment_end, 'time');

                return [
                    'id' => $booking->id,
                    'approver_name' => $approverName,
                    'title' => $booking->title,
                    'notes' => $booking->notes,
                    'reason' => $booking->reason,
                    'appointment_date' => $appointmentDate,
                    'updated_at' => $updatedAt,
                    'appointment_start' => $appointmentStart,
                    'appointment_end' => $appointmentEnd,
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
                'reason' => $data['reason'] ?? null,
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

    public function getPatientIdByBookingId($id)
    {
        return $this->model->where('id', $id)->value('patient_id');
    }

    public function updateBookingstatus($status, $id, $approverId)
    {
        $booking = $this->model->findOrFail($id);
        $booking->update([
            'approve_by_id' => $approverId,
            'booking_status' => $status,
            'approved_date' => now(),
        ]);
        return $booking;
    }

    public function cancelBooking($id, $approverId, $reason)
    {
        $booking = $this->model->findOrFail($id);
        $booking->update([
            'approve_by_id' => $approverId,
            'reason' => $reason,
            'booking_status' => 'Cancel',
        ]);
        return $booking;
    }

    public function checkExistingBooking($date, $start, $end)
    {
        return $this->model->where('appointment_date', $date)
            ->where('appointment_start', $start)
            ->where('appointment_end', $end)
            ->count();
    }

    public function checkPatientExistingBooking($id, $appointment_start, $appointment_end)
    {
        return $this->model->where('patient_id', $id)
        ->where('appointment_start', $appointment_start)
        ->where('appointment_end', $appointment_end)
        ->count();
    }
}
