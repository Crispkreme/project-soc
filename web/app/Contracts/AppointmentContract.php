<?php

namespace App\Contracts;

interface AppointmentContract {

    public function createOrUpdateAppointment($data);
    public function getAllAppointments();
    public function appointments();
    public function getAllAppointmentByMonth();
    public function updateAppointmentStatusById($status, $id);
    public function checkBookingSlot($id);
}
