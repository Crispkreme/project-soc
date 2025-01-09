<?php

namespace App\Contracts;

interface ScheduleContract {

    public function updateOrCreateSchedule($data);
    public function getDoctorScheduleByID();
}
