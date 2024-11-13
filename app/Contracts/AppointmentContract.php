<?php

namespace App\Contracts;

interface AppointmentContract {

    public function createOrUpdateAppointment($data);
    public function getAllAppointments();
    public function getAllAppointmentByMonth();
}
