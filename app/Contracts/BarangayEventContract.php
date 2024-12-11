<?php

namespace App\Contracts;

interface BarangayEventContract {

    public function getLatestBarangayEvent();
    public function getAllBarangayEvent();
    public function getBarangayEvent();
    public function updateOrCreateBarangayEvent($data);
    public function getDoctorBarangayEvent($id, $data);
    public function getUpcomingBarangayEvent();
    public function getAllBarangayEventByMonth();
}
