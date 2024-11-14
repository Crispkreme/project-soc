<?php

namespace App\Contracts;

interface BookingContract {

    public function getAllBooking();
    public function createOrUpdateBooking($data);
}
