<?php

namespace App\Contracts;

interface BookingContract {

    public function getAllBooking();
    public function getCurrentBooking();
    public function getPatientBooking($id);
    public function createOrUpdateBooking($data);
    public function getBookingById($id);
    public function cancelBooking($id, $approverId, $reason);
    public function getPatientIdByBookingId($id);
    public function updateBookingstatus($status, $id, $approverId);
    public function checkExistingBooking($date, $start, $end);
    public function checkPatientExistingBooking($id, $appointment_start, $appointment_end);
}
